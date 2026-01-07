import { useEffect, useState } from "react"
import Modal from "../components/ui/Modal"
import { ErrorMessage, Formik } from "formik"
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1"
import { toast } from "react-toastify"
import { MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md"
import useApiReqs from "../../../hooks/useApiReqs"
import { ColorCircle } from "../components/ColorPicker"
import { BsCheck2Square } from "react-icons/bs"


export default function AddVariantCombination({ modalProps, product, setProduct, types, values }) {

    const { addVariantsCombination, updateVarantCombinaton } = useApiReqs()

    const [options, setOptions] = useState({})
    const [variantTypeId, setVariantTypeId] = useState('')
    const [variantValue, setVariantValue] = useState('')

    useEffect(() => {
        setVariantValue('')
    }, [variantTypeId])

    useEffect(() => {
        if (modalProps?.vCombo) {
            setOptions(vCombo?.options)
        }
    }, [modalProps])

    if (!modalProps || !product || !setProduct || !types || !values) return <></>

    const { hide, visible, vCombo } = modalProps

    const variantValues =
        variantTypeId
            ?
            (values || [])?.filter(v => v?.variant_type_id === variantTypeId)
            :
            []

    const onHide = () => {
        hide && hide()
        setVariantTypeId('')
        setVariantValue('')
        setOptions({})
    }

    const handleAddOption = () => {
        if (!variantTypeId || !variantValue) return toast.info("Select a variant type and value!");

        const optionsClone = { ...options }

        const typeName = (types || [])?.filter(t => t?.id === variantTypeId)?.[0]?.name

        if (!typeName) return toast.error("Can't seem to add variant combination at the moment! Try again later");

        optionsClone[typeName] = variantValue

        setOptions(optionsClone)
        setVariantTypeId('')
        setVariantValue('')
    }

    const optionsArray = Object.keys(options)

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    "{product?.product_name}" variant combinations
                </h2>
            </div>

            <Formik
                enableReinitialize
                validationSchema={yup.object().shape({
                    stock: yup
                        .number('Stock must be a number')
                        .integer('Stock must be an integer')
                        .min(0, 'Stock cannot be negative')
                        .required('Stock is required'),
                    price_currency: yup
                        .string()
                        .required("Currency is required"),
                    price_value: yup
                        .number('Price must be a number')
                        .min(0, 'Price cannot be negative')
                        .required('Price is required'),
                    weight: yup
                        .number('Weight must be a number')
                        .min(0, 'Weight cannot be negative')
                        .required('Weight is required'),                        
                })}
                initialValues={{
                    price_currency: vCombo?.price_currency || '',
                    price_value: vCombo?.price_value || '',
                    stock: vCombo?.stock || '',
                    weight: vCombo?.weight || ''
                }}
                onSubmit={(values, { resetForm }) => {
                    if (optionsArray?.length > 0) {
                        if (vCombo) {
                            const update = {
                                ...values,
                                options
                            }
                            updateVarantCombinaton({
                                callBack: ({ updatedVCombo }) => {
                                    const updatedProductVariantCombo = (product?.product_variants_combinations || [])?.map(vCombo => {
                                        if(vCombo?.id === updatedVCombo?.id){
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
                                },
                                price_value: values.price_value,
                                stock: values.stock,
                                price_currency: values.price_currency,
                                product_id: product?.id,
                                options
                            })
                        }

                    } else {
                        return toast.info("Add variants")
                    }

                    resetForm()
                }}
            >
                {({ values, handleBlur, handleChange, handleSubmit, isValid, dirty }) => (
                    <div>
                        <div className="mb-10">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2 w-1/2 px-1">
                                    <label className="text-gray-700 font-medium">Stock</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={values.stock}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="stock"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 w-1/2 px-1">
                                    <label className="text-gray-700 font-medium">Weight {'(kg)'}</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={values.weight}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="weight"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>                                
                                <div className="flex flex-col space-y-2 w-1/2 px-1">
                                    <label className="text-gray-700 font-medium">Price</label>

                                    <div className="flex space-x-2">
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
                                            style={{ flex: 1 }}
                                            type="number"
                                            placeholder="0"
                                            value={values.price_value}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="price_value"
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <ErrorMessage name="stock">
                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                            </ErrorMessage>

                            <ErrorMessage name="price_currency">
                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                            </ErrorMessage>

                            <ErrorMessage name="price_value">
                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                            </ErrorMessage>

                            <ErrorMessage name="weight">
                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                            </ErrorMessage>
                        </div>

                        <div className="flex items-center justify-between mb-5">
                            <div className="flex flex-col space-y-2 w-1/2 px-1">
                                <label className="text-gray-700 font-medium">Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={variantTypeId}
                                    onChange={e => setVariantTypeId(e.target.value)}
                                >
                                    <option value={''}>---Variant type ?</option>
                                    {
                                        (types || [])?.map((t, i) => {

                                            const { id, name } = t

                                            return (
                                                <option value={id} key={i}>{name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            {
                                variantTypeId
                                &&
                                <div className="flex flex-col space-y-2 w-1/2 px-1">
                                    <label className="text-gray-700 font-medium">Value</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={variantValue}
                                        onChange={e => setVariantValue(e.target.value)}
                                    >
                                        <option value={''}>---Variant value ?</option>
                                        {
                                            variantValues?.map((vV, i) => {

                                                const { value } = vV

                                                return (
                                                    <option value={value} key={i}>
                                                        {
                                                            // isColor
                                                            // ?
                                                            //     <span 
                                                            //         style={{
                                                            //             width: '50px', height: '50px', backgroundColor: value
                                                            //         }}
                                                            //     />
                                                            // :
                                                            //     value 
                                                            value
                                                        }
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            }
                        </div>

                        <button
                            className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition mb-10"
                            onClick={handleAddOption}
                        >
                            Add Variant
                        </button>

                        {
                            optionsArray?.length > 0
                            &&
                            <div>
                                <p className="text-gray-700 font-medium mb-2">Combined variants</p>

                                <table className="w-full border-collapse rounded-lg overflow-hidden mb-10">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Types</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Values</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            optionsArray?.map((optKey, i) => {
                                                const opt = options[optKey]

                                                if (!opt) return;

                                                const variantTypeName = optKey
                                                const variantValue = opt

                                                const isColor = variantTypeName === 'color' ? true : false

                                                const handleRemoveOption = () => {
                                                    const optionsClone = { ...options }
                                                    delete optionsClone?.[optKey]

                                                    setOptions(optionsClone)
                                                }

                                                return (
                                                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                                                        <td className="py-3 px-4">{variantTypeName}</td>
                                                        <td className="py-3 px-4">
                                                            {
                                                                isColor
                                                                    ?
                                                                    <ColorCircle color={variantValue} />
                                                                    :
                                                                    variantValue
                                                            }
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <MdDelete onClick={handleRemoveOption} color="red" size={20} className="cursor-pointer" />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                <div className="flex items-center justify-end">
                                    <button
                                        className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition"
                                        onClick={handleSubmit}
                                    >
                                        Save Combination
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                )}
            </Formik>
        </Modal>
    )
}