import { useState } from "react";
import Modal from "../components/ui/Modal";
import ZeroItems from "../components/ZeroItems";
import useApiReqs from "../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { formatNumberWithCommas } from "../../../lib/utils";

export default function AddVariantTypeModal({ modalProps, types=[], setTypes }) {

    const { addVariantType, deleteVariantType } = useApiReqs()

    const [typeName, setTypeName] = useState('')

    if (!modalProps || !types || !setTypes) return <></>

    const { visible, hide } = modalProps

    const onHide = () => {
        setTypeName('')
        hide && hide()
    }

    const handleAddVariant = () => {

        const name = typeName?.trim().toLowerCase()

        if(!name) return toast.info("Enter a type name!");

        const _types = types?.map(t => t?.name?.toLowerCase())

        if(_types?.includes(name)) return toast.info("Type name already exists!");

        addVariantType({
            callBack: ({ newVariantType }) => {
                const updatedTypes = [{...newVariantType, values: []}, ...(types || [])]
                setTypes(updatedTypes)
                setTypeName('')
            },
            name
        })
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    All variant types
                </h2>
            </div>

            <div className="flex flex-col space-y-2 w-full mb-5">
                <label className="text-gray-700 font-medium">Variant type name</label>
                <input
                    type="text"
                    placeholder="..."
                    value={typeName}
                    onChange={e => setTypeName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex">
                <button
                    className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition"
                    onClick={handleAddVariant}
                >
                    Add Variant
                </button>
            </div>

            <div className="mb-7" />
            <hr />
            <div className="mb-7" />

            <h2 className="text-md font-semibold text-gray-800 mb-4">
                Existing types
            </h2>

            {
                types?.length > 0
                    ?
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Number of values</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Values</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                types?.map((variant_type, i) => {
                                    const { name, id, values } = variant_type
                                    
                                    const valuesCount = values?.length || 0

                                    const valuesText = (values || [])?.map(v => v?.value)

                                    const valuesTextGrouped = valuesText?.join(", ");

                                    const handleDeleteVariantType = () => {
                                        if(valuesCount === 0){
                                            return deleteVariantType({
                                                callBack: ({ deleted_type_id }) => {
                                                    const updatedTypes = (types || [])?.filter(t => t?.id !== deleted_type_id)

                                                    setTypes(updatedTypes)
                                                },
                                                type_id: id
                                            })
                                        }

                                        return toast.info("Delete all variant values first!")
                                    }

                                    return (
                                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{name}</td>
                                            <td className="py-3 px-4">{formatNumberWithCommas(valuesCount)}</td>
                                            <td className="py-3 px-4">{valuesTextGrouped}</td>
                                            <td className="py-3 px-4 text-center">
                                                <MdDelete onClick={handleDeleteVariantType} color="red" size={20} className="cursor-pointer" />
                                            </td>                                            
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <div className="flex items-center justify-center">
                        <ZeroItems
                            zeroText={"No variant types added for this product!"}
                        />
                    </div>
            }
        </Modal>
    )
}