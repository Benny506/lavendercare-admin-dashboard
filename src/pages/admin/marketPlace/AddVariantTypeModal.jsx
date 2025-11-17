import { useState } from "react";
import Modal from "../components/ui/Modal";
import ZeroItems from "../components/ZeroItems";
import useApiReqs from "../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

export default function AddVariantTypeModal({ modalProps, product, setProduct }) {

    const { addVariantType, deleteVariantType } = useApiReqs()

    const [variantName, setVariantName] = useState('')

    if (!modalProps || !product || !setProduct) return <></>

    const { visible, hide } = modalProps
    const { product_variant_types } = product

    const onHide = () => {
        setVariantName('')
        hide && hide()
    }

    const handleAddVariant = () => {

        const name = variantName?.trim().toLowerCase()

        if (product_variant_types?.includes(name)) {
            return toast.info("Variant name already exists!")
        }

        addVariantType({
            callBack: ({ newVariant }) => {
                const updatedVariantTypes = [...product_variant_types, newVariant]
                setProduct({
                    ...product,
                    product_variant_types: updatedVariantTypes
                })
                setVariantName('')
            },
            product_id: product?.id,
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
                    "{product?.product_name}" variant types
                </h2>
            </div>

            <div className="flex flex-col space-y-2 w-full mb-5">
                <label className="text-gray-700 font-medium">Variant type name</label>
                <input
                    type="text"
                    placeholder="..."
                    value={variantName}
                    onChange={e => setVariantName(e.target.value)}
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
                Existing variants
            </h2>

            {
                product_variant_types?.length > 0
                    ?
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Variant type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Values</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                product_variant_types?.map((variant_type, i) => {
                                    const { name, product_variant_values, id } = variant_type

                                    const values = (product_variant_values || [])?.map(vV => vV?.value)?.join(", ")

                                    const handleDeleteVariantType = () => {
                                        if(product_variant_values?.length === 0){
                                            return deleteVariantType({
                                                callBack: ({ deleted_type_id }) => {
                                                    const updatedProductVariantTypes = (product?.product_variant_types || [])?.filter(vT => vT?.id !== deleted_type_id)

                                                    const updatedProduct = {
                                                        ...product,
                                                        product_variant_types: updatedProductVariantTypes
                                                    }

                                                    setProduct(updatedProduct)
                                                },
                                                type_id: id
                                            })
                                        }

                                        return toast.info("Delete all variant values first!")
                                    }

                                    return (
                                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{name}</td>
                                            <td className="py-3 px-4">{values}</td>
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