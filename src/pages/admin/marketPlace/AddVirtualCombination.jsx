import { useEffect, useState } from 'react'
import Modal from '../components/ui/Modal'
import { ErrorMessage, Formik } from 'formik'
import * as yup from 'yup'
import useApiReqs from '../../../hooks/useApiReqs'
import { toast } from 'react-toastify'
import ErrorMsg1 from '../components/ErrorMsg1'
import { useDispatch } from 'react-redux'
import { appLoadStart, appLoadStop } from '../../../redux/slices/appLoadingSlice'
import { getPublicImageUrl, uploadAsset } from '../../../lib/requestApi'
import DisplayMedia from '../components/ui/DisplayMedia'

const FILE_TYPES = {
    image: {
        label: 'Image',
        accept: 'image/*',
    },
    video: {
        label: 'Video',
        accept: 'video/*',
    },
    audio: {
        label: 'Audio',
        accept: 'audio/*',
    },
    pdf: {
        label: 'PDF',
        accept: 'application/pdf',
    },
}

export default function AddVirtualCombination({ modalProps, product, setProduct }) {
    const dispatch = useDispatch()

    const { addVariantsCombination, updateVarantCombinaton } = useApiReqs()

    const [options, setOptions] = useState({})
    const [items, setItems] = useState([])
    const [selectedType, setSelectedType] = useState('image')

    useEffect(() => {
        resetState()
    }, [modalProps])

    const resetState = () => {
        setItems([])
    }

    if (!modalProps) return <></>

    const { visible, hide, vCombo } = modalProps

    const handleAddFile = (file) => {
        if (!file) return

        const preview =
            selectedType !== 'pdf'
                ? URL.createObjectURL(file)
                : null

        setItems((prev) => [
            ...prev,
            {
                type: selectedType,
                value: file,
                preview,
            },
        ])
    }

    const handleFileChange = (e) => {
        handleAddFile(e.target.files[0])
        e.target.value = null // reset input
    }

    const removeItem = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSave = () => {
        console.log('Final payload:', items)
        // 🔗 Supabase insert goes here
    }

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    "{product?.product_name}" virtual combinations
                </h2>
            </div>

            {
                vCombo &&
                <div className='mb-5'>
                    <h2 className='mb-3'>
                        Existing media
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {
                            vCombo?.virtual_files?.map((file, i) => {
                                const { type, path } = file

                                const url = getPublicImageUrl({ path, bucket_name: 'admin_products' })

                                const handleDeleteVirtualFile = (index) => {

                                    if (vCombo?.virtual_files?.length <= 1) return toast.info("Must have at least 1 virtual file!")

                                    const update = {
                                        virtual_files: vCombo?.virtual_files?.filter((_f, _i) => _i !== index)
                                    }

                                    updateVarantCombinaton({
                                        callBack: ({ updatedVCombo }) => {
                                            const updatedProductVariantCombo = (product?.product_variants_combinations || [])?.map(vCombo => {
                                                if (vCombo?.id === updatedVCombo?.id) {
                                                    return {
                                                        ...vCombo,
                                                        ...updatedVCombo
                                                    }
                                                }

                                                return vCombo
                                            })
                                            setProduct({
                                                ...product,
                                                product_variants_combinations: updatedProductVariantCombo
                                            })
                                            hide && hide()
                                        },
                                        update,
                                        combo_id: vCombo?.id
                                    })
                                }

                                return (
                                    <DisplayMedia
                                        key={i}
                                        item={{
                                            type,
                                            preview: url
                                        }}
                                        index={i}
                                        removeItem={(index) => handleDeleteVirtualFile(index)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            }

            <div className="space-y-6">
                {/* Type Selector */}
                <div className="flex gap-3 flex-wrap">
                    {Object.entries(FILE_TYPES).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedType(key)}
                            className={`px-4 py-2 rounded-md text-sm border transition
                                ${selectedType === key
                                    ? 'bg-[#703dcb] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }
                            `}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>

                {/* File Input */}
                <div>
                    <input
                        type="file"
                        accept={FILE_TYPES[selectedType].accept}
                        onChange={handleFileChange}
                        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#703dcb] file:text-white hover:file:opacity-90"
                    />
                </div>

                {/* Preview Section */}
                {items.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item, index) => (
                            <DisplayMedia
                                key={index}
                                index={index}
                                item={item}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>
                )}

                {/* Save */}
                {(items.length > 0 || vCombo) && (
                    <div className="pt-4">
                        <Formik
                            enableReinitialize
                            validationSchema={yup.object().shape({
                                whatsIncluded: yup
                                    .string()
                                    .required("Specify what's included"),
                                price_currency: yup
                                    .string()
                                    .required("Currency is required"),
                                price_value: yup
                                    .number('Price must be a number')
                                    .min(0, 'Price cannot be negative')
                                    .required('Price is required'),
                            })}
                            initialValues={{
                                price_currency: vCombo?.price_currency || '',
                                price_value: vCombo?.price_value || '',
                                whatsIncluded: vCombo?.options?.['value'] || ''
                            }}
                            onSubmit={async (values, { resetForm }) => {
                                try {
                                    if (items?.length === 0 && !vCombo) return toast.info("Add variants");

                                    if (items?.length > 0) {
                                        dispatch(appLoadStart())
                                    }

                                    const virtual_files = await Promise.all(
                                        items?.map(async item => {

                                            const { value, type, preview } = item

                                            const ext =
                                                type === 'image'
                                                    ?
                                                    'png'
                                                    :
                                                    type === 'audio'
                                                        ?
                                                        'mp4'
                                                        :
                                                        type === 'video'
                                                            ?
                                                            'm4a'
                                                            :
                                                            type === 'pdf'
                                                                ?
                                                                'pdf'
                                                                :
                                                                'png' //default to img

                                            const { filePath, error } = await uploadAsset({ file: value, id: product?.id, ext, bucket_name: 'admin_products' })

                                            if (error) {
                                                console.log(error)
                                                throw new Error()
                                            }

                                            return {
                                                type, path: filePath
                                            }
                                        })
                                    )

                                    const options = {
                                        type: "What's included:",
                                        value: values.whatsIncluded
                                    }

                                    if (vCombo) {
                                        const update = {
                                            price_value: values.price_value,
                                            stock: 10000,
                                            price_currency: values.price_currency,
                                            options,
                                            virtual_files: [...(virtual_files || []), ...(vCombo?.virtual_files || [])]
                                        }

                                        updateVarantCombinaton({
                                            callBack: ({ updatedVCombo }) => {
                                                const updatedProductVariantCombo = (product?.product_variants_combinations || [])?.map(vCombo => {
                                                    if (vCombo?.id === updatedVCombo?.id) {
                                                        return {
                                                            ...vCombo,
                                                            ...updatedVCombo
                                                        }
                                                    }

                                                    return vCombo
                                                })
                                                setProduct({
                                                    ...product,
                                                    product_variants_combinations: updatedProductVariantCombo
                                                })
                                                hide && hide()
                                            },
                                            update,
                                            combo_id: vCombo?.id
                                        })

                                    } else {
                                        addVariantsCombination({
                                            callBack: ({ newVariantCombo }) => {
                                                const updatedProductVariantCombo = [newVariantCombo, ...(product?.product_variants_combinations || [])]
                                                setProduct({
                                                    ...product,
                                                    product_variants_combinations: updatedProductVariantCombo
                                                })
                                                hide && hide()
                                                resetForm()
                                            },
                                            price_value: values.price_value,
                                            stock: 10000,
                                            price_currency: values.price_currency,
                                            product_id: product?.id,
                                            options,
                                            virtual_files,
                                            is_virtual: true
                                        })
                                    }

                                } catch (error) {
                                    console.log(error)
                                    dispatch(appLoadStop())
                                    toast.error("Error uploading assets")
                                }
                            }}
                        >
                            {({ values, handleBlur, handleChange, handleSubmit }) => (
                                <div className="">
                                    <div>
                                        <label className="text-gray-700 font-medium">Price</label>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <select
                                                value={values.price_currency}
                                                name="price_currency"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={""}>Currency</option>
                                                <option value={'NGN'}>NGN</option>
                                            </select>

                                            <input
                                                // style={{ flex: 1 }}
                                                type="number"
                                                placeholder="0"
                                                value={values.price_value}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="price_value"
                                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <label className="text-gray-700 font-medium">What's included</label>

                                            <textarea
                                                placeholder="This and that..."
                                                value={values.whatsIncluded}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="whatsIncluded"
                                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                style={{
                                                    width: '100%',
                                                    minHeight: '150px',
                                                    height: '150px'
                                                }}
                                            />
                                        </div>

                                        <ErrorMessage name="price_currency">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>

                                        <ErrorMessage name="price_value">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>

                                        <ErrorMessage name="whatsIncluded">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 rounded-md bg-[#703dcb] text-white hover:opacity-90"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            )}
                        </Formik>
                    </div>
                )}
            </div>
        </Modal>
    )
}