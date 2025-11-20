import { useEffect, useState } from "react"
import useApiReqs from "../../../hooks/useApiReqs"
import Modal from "./ui/Modal"
import ZeroItems from "./ZeroItems"
import ProductCard from "./ui/ProductCard"

export default function ProductsModal({ modalProps, onProductSelected = () => { }, selectedProductIds=[] }) {

    const { fetchProducts } = useApiReqs()

    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {
        if (modalProps?.visible) {
            fetchProducts({
                callBack: ({ products }) => {
                    setAllProducts(products || [])
                }
            })
        }
    }, [modalProps])

    const handleSelectProduct = (product) => {
        onProductSelected(product)
        
        modalProps?.hide && modalProps?.hide()
    }

    if (!modalProps) return <></>

    const { visible, hide } = modalProps

    const filteredProducts = allProducts?.map(p => {
        if(selectedProductIds?.includes(p?.id)){
            return {
                ...p,
                isSelected: true
            }
        }

        return p
    })?.filter(p => p?.product_visibility === true)

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    All VISIBLE Products
                </h2>
            </div>

            {
                filteredProducts?.length > 0
                    ?
                    <div className="flex items-stretch justify-between gap-0 flex-wrap">
                        {
                            filteredProducts?.map((p, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="lg:w-1/3 w-full px-0 mb-7"
                                    >
                                        <ProductCard
                                            product={p}
                                            handleSelectProduct={handleSelectProduct}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="flex items-center justify-center flex-1">
                        <ZeroItems zeroText={"No products found"} />
                    </div>
            }
        </Modal>
    )
}