import { useEffect, useState } from "react";
import { isoToDateTime } from "../../../../lib/utils";
import { getRiskLevelBadge } from "../../../../lib/utils_Jsx";
import Modal from "../../components/ui/Modal";
import useApiReqs from "../../../../hooks/useApiReqs";
import ProductsModal from "../../components/ProductsModal";
import ProductCardSmall from "../../components/ui/ProductCardSmall";
import { toast } from "react-toastify";

export default function FeedBackModal({ modalProps }) {

    const { sendTestFeedBack } = useApiReqs()

    const [message, setMessage] = useState('')
    const [products, setProducts] = useState([])
    const [productsModal, setProductsModal] = useState({ visible: false, hide: null })

    // useEffect(() => {
    //     if (modalProps?.visible) {
    //         fetchProducts({
    //             callBack: ({ products }) => {
    //                 setProducts(products || [])
    //             }
    //         })
    //     }
    // }, [modalProps])

    if (!modalProps) return <></>

    const { data, visible, hide } = modalProps

    if (!data) return <></>

    const onHide = () => {
        setProducts([])
        setMessage('')

        hide && hide()
    }

    const openProductsModal = () => setProductsModal({ visible: true, hide: hideProductsModal })
    const hideProductsModal = () => setProductsModal({ visible: false, hide: null })

    const onProductSelected = (product) => {
        const existingProductIds = products?.map(p => p?.id)

        if (existingProductIds?.includes(product?.id)) return;

        const updatedProducts = [...products, product]

        setProducts(updatedProducts)
    }

    const sendFeedBack = () => {
        if(!message) return toast.info("Add a feedback message!");

        const requestInfo = {
            test_id: data?.id,
            message,
            product_ids: products?.map(p => p?.id),
        }

        sendTestFeedBack({
            callBack: ({}) => {},
            requestInfo,
            user_id: data?.user_profile?.id
        })
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Send feedback to: {data?.user_profile?.name}
                </h2>
            </div>

            {
                [
                    { title: 'Submission date', value: `${data?.created_at ? isoToDateTime({ isoString: data?.created_at }) : 'Not set'}` },
                    { title: 'Remark', value: data?.remark },
                    { title: 'Risk Level', value: getRiskLevelBadge(data?.risk_level) },
                ]
                    ?.map((info, i) => {
                        const { title, value } = info

                        return (
                            <div key={i} className="flex items-center justify-between gap-2 mb-4">
                                <h3 className="">
                                    {title}
                                </h3>

                                <div className="w-3/5 flex items-center justify-end text-end">
                                    {value}
                                </div>
                            </div>
                        )
                    })
            }

            <div className="py-1" />

            <div className="flex flex-col space-y-2 w-full mb-10">
                <label className="text-gray-700 font-medium">Message <sup className="text-red-600 text-lg font-bold px-1">*</sup></label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="A message for the mother"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                        minWidth: '100%',
                        minHeight: '150px'
                    }}
                />
            </div>

            <h2 className="mb-3 text-lg">
                Recommendations
            </h2>

            <div className="">
                <p className="text-md">
                    Products
                </p>

                <button
                    onClick={openProductsModal}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                {
                    products?.length > 0
                    &&
                    <div className="flex items-center flex-wrap">
                        {
                            products?.map((p, i) => {

                                const removeProduct = (product) => {
                                    const updatedProducts = products?.filter(p => p?.id !== product?.id)
                                    setProducts(updatedProducts)
                                }

                                return (
                                    <div key={i} className="lg:w-1/3 w-full px-0 mb-4">
                                        <ProductCardSmall 
                                            product={p} 
                                            onDelete={removeProduct}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>


            <div className="mt-10" />

            <button
                onClick={sendFeedBack}
                className="my-4 px-3 py-1 text-white rounded-lg w-full"
                style={{
                    backgroundColor: '#703DCB', borderColor: '#703DCB',
                    borderRadius: '10px'
                }}
            >
                Send!
            </button>

            <ProductsModal
                modalProps={productsModal}
                onProductSelected={onProductSelected}
                selectedProductIds={products?.map(p => p?.id)}
            />
        </Modal>
    )
}