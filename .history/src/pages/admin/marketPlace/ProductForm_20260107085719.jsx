import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiX, FiImage } from "react-icons/fi";
import { MdCheck, MdPermMedia, MdPublish } from "react-icons/md";
import { Formik, ErrorMessage } from "formik";
import PathHeader from "../components/PathHeader";
import { useDispatch } from "react-redux";
import { appLoadStop } from "../../../redux/slices/appLoadingSlice";
import ErrorMsg1 from "../components/ErrorMsg1";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'
import Card from "../components/ui/Card";
import { AiOutlineProduct } from "react-icons/ai";
import { BsStack, BsTrash } from "react-icons/bs";
import { getPublicImageUrl } from "../../../lib/requestApi";
import { useRef } from "react";
import useApiReqs from "../../../hooks/useApiReqs";




const MAX_FILE_SIZE = 2 * 1024 * 1024

const validationSchema = yup.object().shape({
    product_name: yup.string().required("Product name is required"),
    product_description: yup.string().required("Product description is required"),
    weight: yup.number().min(0, "Must not be less than 0").required("Weight is required")
})

function validateImageFile(file) {
    if (!(file instanceof File)) {
        return { valid: false, error: "You must select a file" };
    }

    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "Only image files are allowed" };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: "File must be smaller than 2 MB" };
    }

    return { valid: true, error: null };
}

export default function ProductForm({
    setProductInfo,
    productInfo,
    product,
    product_id,
    categories,
    setCategories,
    productCategories = [],
    categoryInput,
    setCategoryInput,
    productPreviews,
    setProductPreviews,
    setApiReqs
}) {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { updateProduct, updateProductVisibility, addProductCategory, deleteProductCategory } = useApiReqs()

    const productImgRef = useRef(null)

    return (
        <div className="w-full py-6 space-y-6">
            <PathHeader
                paths={[
                    { text: "Marketplace" },
                    productInfo
                        ? { text: productInfo.product_name }
                        : { text: "Add Product" },
                ]}
            />

            <h2 className="text-2xl font-bold">
                {productInfo ? "Edit Product" : "Add New Product"}
            </h2>

            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={{
                    product_name: product?.product_name || "",
                    product_description: product?.product_description || "",
                    weight: product?.weight?.toString() || ""
                }}
                onSubmit={(values) => {
                    if ((!productPreviews || productPreviews?.length === 0) && productInfo?.product_images?.length === 0) {
                        toast.info("Select at least one image preview of your product")
                        dispatch(appLoadStop())
                        return
                    }

                    if (categories?.length === 0) {
                        toast.info("Select at least one category which your product belongs to")
                        dispatch(appLoadStop())
                        return
                    }

                    // console.log(productPreviews)

                    setApiReqs({
                        isLoading: true,
                        errorMsg: null,
                        data: {
                            type: 'createProducts',
                            requestInfo: {
                                ...values,
                                categories,
                                product_images: productPreviews
                            }
                        }
                    })
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        {/* LEFT */}
                        <Card>
                            <div className="mb-5">
                                <Card
                                    title={'Product Info'}
                                    subtitle={"Basic product information"}
                                    icon={AiOutlineProduct}
                                >
                                    {/* Name */}
                                    <div className="mb-4 mt-3">
                                        <p className="mb-2 text-sm text-gray-500">Weight</p>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="weight"
                                                value={values.weight}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter product weight"
                                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-900 shadow-sm border border-gray-200 transition-all duration-200 focus:outline-none focus:border-[#703dcb] focus:ring-4 focus:ring-[#703dcb]/15 hover:shadow-md"
                                            />
                                        </div>

                                        <ErrorMessage name="weight">
                                            {(msg) => <ErrorMsg1 errorMsg={msg} />}
                                        </ErrorMessage>
                                    </div>
                                    
                                    {/* Name */}
                                    <div className="mb-4 mt-3">
                                        <p className="mb-2 text-sm text-gray-500">Product Name</p>
                                        <div className="relative">
                                            <input
                                                name="product_name"
                                                value={values.product_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter product name"
                                                className="w-full rounded-xl bg-white px-4 py-3 text-gray-900 shadow-sm border border-gray-200 transition-all duration-200 focus:outline-none focus:border-[#703dcb] focus:ring-4 focus:ring-[#703dcb]/15 hover:shadow-md"
                                            />
                                        </div>

                                        <ErrorMessage name="product_name">
                                            {(msg) => <ErrorMsg1 errorMsg={msg} />}
                                        </ErrorMessage>
                                    </div>

                                    {/* Description */}
                                    <div className="">
                                        <p className="mb-2 text-sm text-gray-500">Description</p>
                                        <textarea
                                            name="product_description"
                                            value={values.product_description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={4}
                                            className="w-full rounded-xl bg-white px-4 py-3 text-gray-900 shadow-sm border border-gray-200 transition-all duration-200 focus:outline-none focus:border-[#703dcb] focus:ring-4 focus:ring-[#703dcb]/15 hover:shadow-md"
                                        />
                                    </div>
                                </Card>
                            </div>

                            {/* Images */}
                            <div className="mb-5">
                                <Card
                                    title={'Images'}
                                    subtitle={"All possible images of this product"}
                                    icon={MdPermMedia}
                                >
                                    <input
                                        ref={productImgRef}
                                        type="file"
                                        accept="image/*"
                                        multiple // 👈 allow multiple file selection
                                        className="hidden"
                                        onChange={e => {
                                            const files = Array.from(e.currentTarget.files ?? []);
                                            if (files.length === 0) return;

                                            const validPreviews = [];

                                            files.forEach(file => {
                                                const { valid, error } = validateImageFile(file);

                                                if (!valid) {
                                                    toast.error(error || "Invalid file");
                                                    return;
                                                }

                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    validPreviews.push({ file, preview: reader.result });

                                                    // Once all readers are done, update preview state
                                                    if (validPreviews.length === files.filter(f => validateImageFile(f).valid).length) {
                                                        if (productPreviews?.length > 0) {
                                                            setProductPreviews(prev => [...prev, ...validPreviews]);

                                                        } else {
                                                            setProductPreviews(validPreviews);
                                                        }
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            });

                                            if (productImgRef.current) {
                                                productImgRef.current.value = "";
                                            }
                                        }}
                                    />

                                    <div className="flex flex-col items-center flex-wrap justify-between gap-5">
                                        <div className="w-full">
                                            <p className="mb-2 text-sm text-gray-500">New</p>
                                            <Card>
                                                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {productPreviews?.map((img, i) => {
                                                        return (
                                                            <motion.div
                                                                key={i}
                                                                whileHover={{ scale: 1.03 }}
                                                                className="relative aspect-square rounded-lg overflow-hidden border"
                                                            >
                                                                <img
                                                                    src={img.preview}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        setProductPreviews((p) =>
                                                                            p.filter((_, idx) => idx !== i)
                                                                        )
                                                                    }
                                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                                                >
                                                                    <FiX size={14} />
                                                                </button>
                                                            </motion.div>
                                                        )
                                                    })}

                                                    <button
                                                        onClick={() => productImgRef.current?.click()}
                                                        className="aspect-square rounded-lg border-dashed border flex items-center justify-center text-gray-400 hover:border-[#703dcb]"
                                                    >
                                                        <FiImage size={24} />
                                                    </button>
                                                </div>
                                            </Card>
                                        </div>

                                        <div className="w-full">
                                            <p className="mb-2 text-sm text-gray-500">Old</p>
                                            <Card>
                                                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {productInfo?.product_images?.map((img, i) => {

                                                        const handleImgDelete = () => {
                                                            if (productInfo?.product_images?.length === 1) {
                                                                return toast.info("Product MUST have at least 1 image")
                                                            }

                                                            const updatedProductImages = productInfo?.product_images?.filter(_img => img != _img)

                                                            updateProduct({
                                                                callBack: ({ update }) => {
                                                                    setProductInfo({
                                                                        ...productInfo,
                                                                        ...update
                                                                    })
                                                                },
                                                                update: {
                                                                    product_images: updatedProductImages
                                                                },
                                                                product_id: productInfo?.id
                                                            })
                                                        }

                                                        return (
                                                            <motion.div
                                                                key={i}
                                                                whileHover={{ scale: 1.03 }}
                                                                className="relative aspect-square rounded-lg overflow-hidden border"
                                                            >
                                                                <img
                                                                    src={getPublicImageUrl({ path: img, bucket_name: 'admin_products' })}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    onClick={handleImgDelete}
                                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                                                >
                                                                    <FiX size={14} />
                                                                </button>
                                                            </motion.div>
                                                        )
                                                    })}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <Card
                                    title="Categories"
                                    subtitle="All possible categories for ANY product"
                                    icon={BsStack}
                                >
                                    <div className="mt-4 space-y-2 max-h-[260px] overflow-y-auto pr-1">
                                        {productCategories.map(({ category }) => {
                                            const selected = categories.includes(category);

                                            return (
                                                <motion.div
                                                    key={category}
                                                    layout
                                                    whileHover={{ backgroundColor: "#F9FAFB" }}
                                                    className="group flex items-center justify-between rounded-lg px-3 py-2 border border-gray-100 transition"
                                                >
                                                    {/* Left: Select */}
                                                    <button
                                                        onClick={() =>
                                                            selected
                                                                ? setCategories((c) => c.filter((x) => x !== category))
                                                                : setCategories((c) => [...c, category])
                                                        }
                                                        className="flex items-center gap-3 text-sm"
                                                    >
                                                        <span
                                                            className={`w-5 h-5 rounded-md border flex items-center justify-center
                                                                    ${selected
                                                                    ? "bg-[#703dcb] border-[#703dcb] text-white"
                                                                    : "border-gray-300"
                                                                }`}
                                                        >
                                                            {selected && <MdCheck size={14} />}
                                                        </span>

                                                        <span className="capitalize text-gray-800">
                                                            {category}
                                                        </span>
                                                    </button>

                                                    {/* Right: Delete (hover only) */}
                                                    <button
                                                        onClick={() => {
                                                            if (productCategories?.length > 1) {

                                                                deleteProductCategory({
                                                                    category
                                                                })

                                                            } else {
                                                                toast.info("At least 1 product category must exist!")
                                                            }
                                                        }}
                                                        className="transition text-gray-400 hover:text-red-500"
                                                    >
                                                        <BsTrash size={14} />
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Add Category */}
                                    <div className="mt-5 flex gap-2">
                                        <input
                                            value={categoryInput}
                                            onChange={(e) => setCategoryInput(e.target.value)}
                                            placeholder="Add new category"
                                            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm border border-gray-200 shadow-sm focus:outline-none focus:border-[#703dcb] focus:ring-4 focus:ring-[#703dcb]/15"
                                        />

                                        <button
                                            onClick={() => {
                                                if (!categoryInput) return;

                                                const cats = productCategories.map(c =>
                                                    c.category.toLowerCase()
                                                );

                                                if (cats.includes(categoryInput.toLowerCase())) {
                                                    return toast.info("Category already exists");
                                                }

                                                addProductCategory({
                                                    category: categoryInput,
                                                    callBack: () => setCategoryInput("")
                                                });
                                            }}
                                            className="shrink-0 rounded-xl bg-[#703dcb] px-4 text-white hover:bg-[#5f33b3] transition flex items-center justify-center"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </Card>

                        {/* RIGHT */}
                        <div className="sticky top-6 h-fit">
                            <Card
                                title={'Publishing'}
                                subtitle={"Handle publishing and product variants"}
                                icon={MdPublish}
                            >
                                <div className="flex flex-col gap-3">
                                    {product_id && (
                                        <button
                                            onClick={() => {
                                                const visible = !productInfo.product_visibility;
                                                updateProductVisibility({
                                                    product_id: productInfo.id,
                                                    product_visibility: visible,
                                                });
                                            }}
                                            className={`w-full rounded-lg py-2 font-semibold ${productInfo?.product_visibility
                                                ? "bg-gray-200"
                                                : "bg-[#703dcb] text-white"
                                                }`}
                                        >
                                            {productInfo?.product_visibility
                                                ? "Hide Product"
                                                : "Make Visible"}
                                        </button>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-[#703dcb] text-white py-2 rounded-lg font-semibold"
                                    >
                                        {product_id ? "Save Changes" : "Create Product"}
                                    </button>

                                    {product_id && (
                                        <button
                                            onClick={() =>
                                                navigate("/admin/marketplace/manage-product/product-variants", {
                                                    state: { product_id },
                                                })
                                            }
                                            className="w-full border border-[#703dcb] text-[#703dcb] py-2 rounded-lg"
                                        >
                                            Manage Variants
                                        </button>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </Formik>
        </div>
    );
}
