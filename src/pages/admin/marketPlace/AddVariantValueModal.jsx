import { ErrorMessage, Formik } from "formik"
import { increaseByOptions, productVariants, sizeVariants } from "../../../lib/productConstants"
import ColorPicker, { ColorCircle } from "../components/ColorPicker"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import ErrorMsg1 from "../components/ErrorMsg1"
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice"
import supabase from "../../../database/dbInit"
import { getAdminState, setAdminState } from "../../../redux/slices/adminState"
import { formatNumberWithCommas } from "../../../lib/utils"
import Modal from "../components/ui/Modal"
import { MdDelete, MdOutlineEdit } from "react-icons/md"
import { BsTrash } from "react-icons/bs"
import { v4 as uuidv4 } from 'uuid';
import useApiReqs from "../../../hooks/useApiReqs"

export default function AddVariantValueModal({ modalProps, values=[], setValues, types=[], setTypes }) {
    const dispatch = useDispatch()

    const { addVariantValue, deleteVariantValue } = useApiReqs()

    const [variantTypeId, setVariantTypeId] = useState('')
    const [variantValue, setVariantValue] = useState('')
    const [variantValues, setVariantValues] = useState([])

    useEffect(() => {
        if (!modalProps?.hide) {
            resetState()

            return;
        };
    }, [modalProps])

    useEffect(() => {
        const variantValues = (values || [])?.filter(v => v?.variant_type_id === variantTypeId)
        setVariantValues(variantValues)
        setVariantValue('')
    }, [variantTypeId, types, values])

    const resetState = () => {
        setVariantTypeId('')
        setVariantValue('')
        setVariantValues([])
    }

    if (!modalProps) return <></>

    const { hide, visible } = modalProps

    if (!types || !values || !setValues || !setTypes) return <></>

    const handleAddVariantValue = () => {

        if (!variantTypeId || !variantValue) return toast.error('Select a variant type and value');

        addVariantValue({
            callBack: ({ newVariantValue }) => {

                const type = (types || [])?.filter(t => t?.id === newVariantValue?.variant_type_id)?.[0]

                const updatedTypes = (types || [])?.map(t => {
                    if(t?.id === newVariantValue?.variant_type_id){
                        const updatedValues = [{...newVariantValue, type}, ...(t?.values || [])]

                        return {
                            ...t,
                            values: updatedValues
                        }
                    }

                    return t
                })

                
                const updatedValues = [{...newVariantValue, type}, ...(values || [])]

                setTypes(updatedTypes)
                setValues(updatedValues)

                setVariantValue('')
            },
            variant_type_id: variantTypeId,
            value: variantValue
        })
    }

    const isColor = (types || [])?.filter(t => t?.id === variantTypeId)?.[0]?.name === 'color'

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            {/* {
                apiReqs?.isLoading
                &&
                    <AppLoading tempLoading={tempLoading} />
            } */}

            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    All variant values
                </h2>
            </div>

            <div className="">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full px-2 mb-4">
                        <div className="flex flex-col">
                            <label
                                htmlFor="variantTypeId"
                                className="text-base font-medium text-gray-700 mb-1"
                            >
                                Variant type
                            </label>

                            <select
                                id="variantTypeId"
                                value={variantTypeId}
                                onChange={(e) => setVariantTypeId(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="">-- What type of variant is this? --</option>
                                {(types || [])?.map((t, i) => {
                                    return (
                                        <option key={i} value={t?.id}>
                                            {t?.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>


                    {
                        variantTypeId
                        &&
                        <div className="w-full flex flex-wrap px-2">
                            <div className="w-full mb-3">
                                {
                                    isColor
                                        ?
                                        <div>
                                            <ColorPicker
                                                onChange={color => setVariantValue(color)}
                                            />
                                        </div>
                                        :
                                        <div className="flex flex-col space-y-2 w-full">
                                            <label className="text-gray-700 font-medium">Value</label>
                                            <input
                                                value={variantValue}
                                                onChange={e => setVariantValue(e.target.value)}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                            </input>
                                        </div>
                                }
                            </div>
                        </div>
                    }
                    {/* </Collapse> */}
                </div>

                <button
                    onClick={handleAddVariantValue}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                {
                    variantValues?.length > 0
                    &&
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {variantValues?.map((v, i) => {
                                const { id, value, variant_type_id } = v;

                                const name = (types || [])?.filter(type => type?.id === variant_type_id)?.[0]?.name

                                const handleDeleteVariantValue = () => {
                                    deleteVariantValue({
                                        callBack: ({ deleted_value_id }) => {

                                            const updatedTypes = (types || [])?.map(t => {
                                                const values = t?.values || []

                                                const value_ids_in_t = values?.map(v => v?.id)

                                                if(value_ids_in_t?.includes(deleted_value_id)){
                                                    const updatedValues = values?.filter(v => v?.id != deleted_value_id)

                                                    return {
                                                        ...t,
                                                        values: updatedValues
                                                    }
                                                }

                                                return t
                                            })

                                            const updatedValues = (values || [])?.filter(v => v?.id !== deleted_value_id)

                                            setTypes(updatedTypes)
                                            setValues(updatedValues)
                                        },
                                        value_id: id
                                    })
                                }

                                return (
                                    <>
                                        <tr className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{name}</td>
                                            <td className="py-3 px-4">
                                                {name === "color" ? (
                                                    <ColorCircle color={value} />
                                                ) : (
                                                    value
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <MdDelete onClick={handleDeleteVariantValue} color="red" size={20} className="cursor-pointer" />
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>

                }
            </div>
        </Modal>
    )
}