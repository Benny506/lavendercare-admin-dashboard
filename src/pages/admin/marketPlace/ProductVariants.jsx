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
import { MdOutlineEdit } from "react-icons/md"
import { BsTrash } from "react-icons/bs"
import { v4 as uuidv4 } from 'uuid';

export default function ProductVariantModal({ modalProps, apiReqs, setApiReqs, productInfo, setProductInfo }) {
    const dispatch = useDispatch()

    const products = useSelector(state => getAdminState(state).products)

    const [variantType, setVaraintType] = useState('')
    const [variantValue, setVariantValue] = useState('')
    const [stock, setStock] = useState(null)
    const [increment, setIncrement] = useState(null)
    const [variants, setVariants] = useState([])
    const [isEditting, setIsEditting] = useState({ type: null, value: null })
    // const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })

    useEffect(() => {
        if (!modalProps?.hide) {
            resetState()
            setVariants([])
            setApiReqs({ isLoading: false, errorMsg: null, data: null })

            return;
        };

        initiateProduct()
    }, [modalProps])

    useEffect(() => {
        if (variantType === 'default') {
            setVariantValue('default')
            setIncrement(0)

        } else {
        }
    }, [variantType])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if (isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if (data && isLoading) {
            const { type } = data

            if (type === 'addVariants') {
                addVariants()
            }
        }
    }, [apiReqs])

    const initiateProduct = () => {
        if(productInfo){
            const variants = productInfo?.product_variants || []            
            setVariants(variants)            
        }        
    }

    const addVariants = async () => {
        try {

            const product = productInfo

            const _variants = variants?.map(v => {
                return {
                    ...v,
                    id: v?.id || uuidv4(),
                    created_at: v?.created_at || new Date().toISOString(),
                    product_id: product?.id
                }
            })

            const { data, error } = await supabase
                .from('product_variants')
                .upsert(_variants, {
                    onConflict: ['product_id', 'variant_type', 'variant_value']
                })
                .select('*')
                .eq("product_variants")

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedProduct = {
                ...product,
                product_variants: data
            }

            const updatedProducts = products?.map(p => {
                if (p?.id === product?.id) {
                    return {
                        ...p,
                        product_variants: data
                    }
                }

                return p
            })

            setProductInfo(updatedProduct)

            dispatch(setAdminState({
                products: updatedProducts
            }))

            setApiReqs({ isLoading: false, errorMsg: null, data: null })

            dispatch(appLoadStart())

            modalProps?.hide && modalProps?.hide()

            toast.success("Product variants saved")

        } catch (error) {
            console.log(error)
            return apiReqError({ errorMsg: 'Error adding product variants' })
        }
    }

    const resetState = () => {
        setVaraintType('')
        setVariantValue('')
        setStock(0)
        setIncrement(0)
    }

    if (!modalProps) return <></>

    const { hide, visible } = modalProps

    if (!productInfo) return <></>

    const { product_name } = productInfo

    const handleSaveVariants = () => {
        if (variants?.length === 0) {
            return apiReqError({ errorMsg: 'Add at least one variant!' })
        }

        setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'addVariants'
            }
        })
    }

    const handleAddVariant = () => {

        if (!variantType || !variantValue) return apiReqError({ errorMsg: 'Select a variant type and value' });

        if (stock === null || increment === null) return apiReqError({ errorMsg: 'Select the stock count and the price increment' });

        if (stock <= 0 || isNaN(stock)) return apiReqError({ errorMsg: "Stock count has to be more than 1" });

        const exists = variants?.filter(v => v?.variant_type === variantType && v?.variant_value === variantValue)[0]

        if (exists) return apiReqError({ errorMsg: 'You have already added this variant' });

        const newVariant = {
            variant_type: variantType,
            variant_value: variantValue,
            stock,
            increment
        }

        setVariants(prev => [...prev, newVariant])

        resetState()
    }

    const apiReqError = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, errorMsg, data: null })
        toast.error(errorMsg)

        return;
    }

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
                <h2 className="text-lg font-semibold text-gray-800 font-[Poppins]">
                    “{product_name}” variants
                </h2>
            </div>

            <div className="">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full px-2 mb-4">
                        <div className="flex flex-col">
                            <label
                                htmlFor="variantType"
                                className="text-base font-medium text-gray-700 mb-1"
                            >
                                Variant type
                            </label>

                            <select
                                id="variantType"
                                value={variantType}
                                onChange={(e) => setVaraintType(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="">-- What kind of variant is this? --</option>
                                {productVariants?.map((v, i) => (
                                    <option key={i} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* <Collapse
                        in={variantType}
                    > */}
                    {
                        variantType
                        &&
                        <div className="w-full flex flex-wrap px-2">
                            <div className="w-full mb-3">
                                {
                                    variantType === 'color'
                                        ?
                                        <div>
                                            <ColorPicker
                                                onChange={color => setVariantValue(color)}
                                            />
                                        </div>
                                        :
                                        variantType === 'size'
                                            ?
                                            <div className="flex flex-col space-y-2 w-full">
                                                <label className="text-gray-700 font-medium">Select size</label>
                                                <select
                                                    value={variantValue}
                                                    onChange={e => setVariantValue(e.target.value)}
                                                    required
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">-- Product size? --</option>
                                                    {sizeVariants?.map((v, i) => (
                                                        <option key={i} value={v}>
                                                            {v}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            :
                                            <div className="flex flex-col space-y-2 w-full">
                                                <label className="text-gray-700 font-medium">Default selected</label>
                                                <input
                                                    type="text"
                                                    placeholder="0"
                                                    value="default"
                                                    disabled
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                                                />
                                            </div>


                                }
                            </div>

                            <div className="w-1/2 pr-2">
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="text-gray-700 font-medium">Stock Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={stock}
                                        onChange={e => setStock(Number(e.target.value))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                            </div>

                            <div className="w-1/2 pl-2">
                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="text-gray-700 font-medium">Price increment</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={increment}
                                        onChange={e => setIncrement(Number(e.target.value))}
                                        disabled={variantType === 'default'}
                                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    {/* </Collapse> */}
                </div>

                <button
                    onClick={handleAddVariant}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                <h1 className="font-bold text-[#737373] text-2xl my-2">
                    Base price: <span className="text-black">{formatNumberWithCommas(productInfo?.price_value)}</span>
                </h1>

                {
                    variants?.length > 0
                    &&
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Increment</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Final Price</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {variants?.map((v, i) => {
                                const { stock, increment, variant_value, variant_type } = v;

                                const currentlyEditting =
                                    isEditting?.type === variant_type && isEditting?.value === variant_value;

                                const removeVariant = () => {
                                    const filtered = variants?.filter(
                                        (_v) =>
                                            !(
                                                _v?.variant_value === variant_value &&
                                                _v?.variant_type === variant_type
                                            )
                                    );
                                    setVariants(filtered);
                                };

                                const editVariant = () => {
                                    if (currentlyEditting)
                                        return setIsEditting({ type: null, value: null });

                                    setIsEditting({
                                        type: v?.variant_type,
                                        value: v?.variant_value,
                                    });
                                };

                                const alterCount = ({ value, type }) => {
                                    const updated = variants?.map((_v) => {
                                        if (
                                            _v?.variant_value === variant_value &&
                                            _v?.variant_type === variant_type
                                        ) {
                                            const numValue = Number(value);
                                            const val = isNaN(numValue) || numValue < 0 ? 0 : numValue;
                                            return {
                                                ..._v,
                                                [type]: val,
                                            };
                                        }
                                        return _v;
                                    });

                                    setVariants(updated);
                                };

                                return (
                                    <>
                                        <tr className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{variant_type}</td>
                                            <td className="py-3 px-4">
                                                {variant_type === "color" ? (
                                                    <ColorCircle color={variant_value} />
                                                ) : (
                                                    variant_value
                                                )}
                                            </td>
                                            <td className="py-3 px-4">{formatNumberWithCommas(stock)}</td>
                                            <td className="py-3 px-4">
                                                {formatNumberWithCommas(increment)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {formatNumberWithCommas(increment + productInfo?.price_value)}
                                            </td>
                                            <td className="py-3 px-4 text-right space-x-3">
                                                <button
                                                    onClick={editVariant}
                                                    className="text-green-600 hover:text-green-700 transition"
                                                >
                                                    <MdOutlineEdit color="#703dcb" size={20} />
                                                </button>
                                                {/* <button
                                                    onClick={removeVariant}
                                                    className="text-red-600 hover:text-red-700 transition"
                                                >
                                                    <BsTrash color="red" />
                                                </button> */}
                                            </td>
                                        </tr>

                                        {isEditting && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className={`transition-all duration-300 overflow-hidden ${currentlyEditting ? "bg-gray-100" : "max-h-0 opacity-0"
                                                        }`}
                                                >
                                                    <div
                                                        className={`transition-all duration-300 ease-in-out ${currentlyEditting
                                                            ? "max-h-screen opacity-100"
                                                            : "max-h-0 opacity-0"
                                                            }`}
                                                    >
                                                        <div className="flex flex-wrap -mx-2 p-4">
                                                            <div className="w-full md:w-1/2 px-2 mb-4">
                                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                                    Stock Quantity
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={stock}
                                                                    onChange={(e) =>
                                                                        alterCount({
                                                                            value: e.target.value,
                                                                            type: "stock",
                                                                        })
                                                                    }
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>

                                                            <div className="w-full md:w-1/2 px-2 mb-4">
                                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                                    Price Increment
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={increment}
                                                                    onChange={(e) =>
                                                                        alterCount({
                                                                            value: e.target.value,
                                                                            type: "increment",
                                                                        })
                                                                    }
                                                                    disabled={variant_type === "default"}
                                                                    className={`w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none ${variant_type === "default"
                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>

                }

                {
                    apiReqs.errorMsg
                    &&
                    <ErrorMsg1
                        errorMsg={apiReqs.errorMsg}
                    />
                }
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
                <button className="bg-gray-500 text-white px-3 py-2" onClick={hide} data-testid="button-cancel-product" style={{ borderRadius: 5 }}>
                    Cancel
                </button>
                <button
                    className="px-3 py-2 text-white"
                    onClick={handleSaveVariants}
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: 5
                    }}
                >
                    Save Product Variant
                </button>
            </div>
        </Modal>
    )
}