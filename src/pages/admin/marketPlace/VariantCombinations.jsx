import { useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { useEffect, useState } from "react";
import useApiReqs from "../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import ZeroItems from "../components/ZeroItems";
import AddVariantValueModal from './AddVariantValueModal'
import AddVariantTypeModal from "./AddVariantTypeModal";
import AddVariantCombination from "./AddVariantCombination";
import { MdDelete } from "react-icons/md";
import { formatNumberWithCommas } from "../../../lib/utils";
import { ProductVariantsDisplay } from "./ProductsVariantsDisplay";

export default function VariantCombinations() {

    const navigate = useNavigate()

    const { fetchSingleProduct, fetchAllVariantTypesAndValues } = useApiReqs()

    const state = useLocation().state
    const product_id = state?.product_id

    const [product, setProduct] = useState(null)
    const [types, setTypes] = useState([])
    const [values, setValues] = useState([])
    const [addVariantValueModal, setAddVariantValueModal] = useState({ visible: false, hide: null })
    const [addVariantTypeModal, setAddVariantTypeModal] = useState({ visible: false, hide: null })
    const [addVariantCombination, setAddVariantCombination] = useState({ visible: false, hide: null })

    useEffect(() => {
        if (!product_id) {
            navigate('/admin/marketplace/manage-product')
            return;

        } else {
            fetchAllVariantTypesAndValues({
                callBack: ({ values, types }) => {
                    if(values && types){
                        setTypes(types)
                        setValues(values)
                    }
                }
            })

            fetchSingleProduct({
                callBack: ({ product }) => {
                    if (product) {
                        setProduct(product)

                    } else {
                        toast.info("Error loading product variants")
                        navigate('/admin/marketplace/manage-product')
                    }
                },
                product_id: product_id
            })
        }
    }, [state])

    const openAddVariantValueModal = () => setAddVariantValueModal({ visible: true, hide: hideAddVariantValueModal })
    const hideAddVariantValueModal = () => setAddVariantValueModal({ visible: false, hide: null })

    const openAddVariantTypeModal = () => setAddVariantTypeModal({ visible: true, hide: hideAddVariantTypeModal })
    const hideAddVariantTypeModal = () => setAddVariantTypeModal({ visible: false, hide: null })

    const openAddVariantCombination = () => setAddVariantCombination({ visible: true, hide: hideAddVariantCombination })
    const hideAddVariantCombination = () => setAddVariantCombination({ visible: false, hide: null })

    if (!product) return <></>

    const { product_variants_combinations } = product

    return (
        <div className="w-full py-6">
            {/* Breadcrumbs */}
            <PathHeader
                paths={[
                    { text: 'MarketPlace' },
                    { text: 'Manage Product' },
                    { text: product?.product_name },
                ]}
            />

            {/* manage product tile */}
            <div className="flex md:flex-row flex-col justify-between mb-3 gap-4 items-center">
                <h2 className="text-2xl font-semibold">Variants</h2>
                <div style={{ flex: 1 }} className="flex justify-end flex-row md:items-center gap-2">
                    <button
                        onClick={openAddVariantTypeModal}
                        className="cursor-pointer border border-gray-200 rounded-lg px-3 py-1 text-gray-700"
                    >
                        Types
                    </button>
                    <button
                        onClick={openAddVariantValueModal}
                        className="cursor-pointer border border-gray-200 rounded-lg px-3 py-1 text-gray-700"
                    >
                        Values
                    </button>
                    <button
                        className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition"
                        onClick={openAddVariantCombination}
                    >
                        Add Combination
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-5">Variants Combinations</h3>

                {
                    product_variants_combinations?.length > 0
                        ?
                        <table className="w-full border-collapse rounded-lg overflow-hidden mb-10">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Types</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    product_variants_combinations?.map((vCombo, i) => {
                                        const { stock, price_currency, price_value, options } = vCombo

                                        const handleDeleteCombo = () => {
                                            //should delete but this is what user's add to cart so well, proceed with caution!
                                        }

                                        return (
                                            <tr key={i} className="border-b hover:bg-gray-50 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <ProductVariantsDisplay 
                                                            variants={options}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">{formatNumberWithCommas(stock)}</td>
                                                <td className="py-3 px-4">{price_currency} {formatNumberWithCommas(price_value)}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <MdDelete onClick={handleDeleteCombo} color="red" size={20} className="cursor-pointer" />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <ZeroItems
                            zeroText={'No variant combinations found. Product cannot be marked as visible'}
                        />
                }
            </div>

            <AddVariantValueModal
                modalProps={addVariantValueModal}
                types={types}
                setTypes={setTypes}
                values={values}
                setValues={setValues}                  
            />

            <AddVariantTypeModal
                modalProps={addVariantTypeModal}
                types={types}
                setTypes={setTypes}
            />

            <AddVariantCombination
                modalProps={addVariantCombination}
                product={product}
                setProduct={setProduct}     
                types={types}
                values={values}         
            />
        </div >
    )
}