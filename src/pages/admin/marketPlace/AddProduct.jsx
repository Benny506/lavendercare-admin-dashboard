import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PathHeader from '../components/PathHeader';
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup'
import ErrorMsg1 from '../components/ErrorMsg1';
import { currencies } from '../../../lib/currencies';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { appLoadStart, appLoadStop } from '../../../redux/slices/appLoadingSlice';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Carousel from '../components/ui/Carousel';
import { getMultiplePublicUrls, getPublicImageUrl, getPublicUrl, uploadAsset } from '../../../lib/requestApi';
import supabase from '../../../database/dbInit';
import { formatNumberWithCommas } from '../../../lib/utils';
import ProductVariants from './AddVariantValueModal';
import { getAdminState, setAdminState } from '../../../redux/slices/adminState';
import useApiReqs from '../../../hooks/useApiReqs';
import { BsTrash } from 'react-icons/bs';
import ProductImage from './ProductImage';
import { v4 as uuidv4 } from 'uuid';


const validationSchema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  product_description: yup.string().required("Product description is required"),
})

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = [
  /^image\//,
  // 'application/pdf',
  // 'application/msword',
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

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

function AddProduct() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const { state } = useLocation()

  const product = state?.product
  const product_id = state?.product_id

  const {
    fetchSingleProduct, fetchProductCategories, addProductCategory, deleteProductCategory, updateProductVisibility,
    updateProduct
  } = useApiReqs()

  const productCategories = useSelector(state => getAdminState(state).productCategories)
  const products = useSelector(state => getAdminState(state).products)

  const productImgRef = useRef(null)

  const [categoryInput, setCategoryInput] = useState('')
  const [productPreviews, setProductPreviews] = useState()
  const [categories, setCategories] = useState([])
  const [productInfo, setProductInfo] = useState(null)
  const [apiReqs, setApiReqs] = useState({
    isLoading: false, errorMsg: null, data: null
  })

  useEffect(() => {
    fetchProductCategories({})

    if (product_id) {
      fetchSingleProduct({
        callBack: ({ product }) => {
          if (product) {
            loadImages({ product })

          } else {
            toast.error("Error loading product information! Try again.")
            navigate('/admin/marketplace/manage-product')
          }
        },
        product_id
      })
    }
  }, [product_id])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    // if (isLoading) dispatch(appLoadStart());
    // else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'createProducts') {
        createProducts({ requestInfo })
      }
    }
  }, [apiReqs])

  const loadImages = ({ product }) => {
    if (!product) return;

    const urls = product?.product_images?.map(pImg => {
      const url = getPublicImageUrl({ path: pImg, bucket_name: 'admin_products' })
      return url
    })

    setProductInfo({
      ...product,
      productPreviews: urls
    })

    setCategories(product?.categories)
  }

  const createProducts = async ({ requestInfo }) => {
    try {

      dispatch(appLoadStart())

      const { product_images } = requestInfo

      const id = product_id || uuidv4()

      const { filePaths } = await uploadAsset({
        file: (product_images || [])?.map(img => img?.file).filter(img => img instanceof File),
        ext: 'png',
        id,
        bucket_name: 'admin_products'
      })

      const allExisting = productInfo?.product_images || []

      const images = [...allExisting, ...(filePaths || [])]

      const requestBody = {
        ...requestInfo,
        id,
        product_images: images
      }

      const { data, error } =
        product_id
          ?
          await supabase
            .from("products")
            .update(requestBody)
            .eq("id", product_id)
            .select()
            .single()
          :
          await supabase
            .from("products")
            .insert({
              ...requestBody,
              uploaded_by: 'admin'
            })
            .select()
            .single()

      if (error) {
        console.log("Error here", error)
        throw new Error()
      }

      if (product_id) {
        const updatedProduct = {
          ...data,
          image_urls: (data?.product_images || [])?.map(imgPath => getPublicImageUrl({ path: imgPath, bucket_name: 'admin_products' }))
        }

        const updatedProducts = (products || [])?.map(p => {
          if(p?.id === product_id){
            return {
              ...p,
              ...updatedProduct              
            }
          }

          return p
        })

        dispatch(setAdminState({
          products: updatedProducts
        }))
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })
      toast.success(product_id ? 'Product updated' : 'Product created')

      navigate('/admin/marketplace/manage-product')

      return;

    } catch (error) {
      console.log(error)
      return createProductsFailure({ errorMsg: 'Something went wrong! Try again.' })

    } finally {
      dispatch(appLoadStop())
    }
  }
  const createProductsFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
      <PathHeader
        paths={[
          { text: 'MarketPlace' },
          ...(
            productInfo
              ?
              [
                { text: 'Edit Product' },
                { text: productInfo?.product_name },
              ]
              :
              [
                { text: 'Add Product' },
              ]
          )
        ]}
      />

      <h2 className="text-xl md:text-2xl font-bold mb-2">{productInfo ? 'Edit' : 'Add New'} Product</h2>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          product_name: product?.product_name || '',
          product_description: product?.product_description || '',
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
        {({ values, handleBlur, handleChange, handleSubmit, isValid, dirty, setTouched, validateForm }) => (
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Product Name {'('}Cannot be changed{')'} </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Enter Product name"
                  type='text'
                  disabled={productInfo?.product_name ? true : false}
                  name='product_name'
                  value={values.product_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name='product_name'>
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block font-semibold mb-1">Product Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Enter Product description"
                  type='text'
                  name='product_description'
                  value={values.product_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name='product_description'>
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                {
                  productInfo?.product_images?.length > 0
                  &&
                  <div>
                    <label className="block font-semibold mb-1">Existing Images</label>
                    <div className='flex items-center gap-2 flex-wrap mb-7'>
                      {
                        productInfo?.product_images?.map((img, i) => {

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

                          const image_url = getPublicImageUrl({ path: img, bucket_name: 'admin_products' })

                          return (
                            <ProductImage
                              key={i}
                              img={image_url}
                              handleImgDelete={handleImgDelete}
                            />
                          )
                        })
                      }
                    </div>
                  </div>
                }
                <label className="block font-semibold mb-1">Upload Image</label>
                <div onClick={() => productImgRef?.current?.click()} className="w-full border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer text-center text-gray-400">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="#8B8B8A" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h4m-4 0H8" /><rect width="20" height="20" x="2" y="2" stroke="#8B8B8A" strokeWidth="2" rx="4" /></svg>
                  <span>Click to upload <span className="text-(--primary-500)">or drag and drop</span></span>
                  <span className="text-xs mt-1">PNG, JPG or JPEG</span>
                </div>
                <input
                  ref={productImgRef}
                  type="file"
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
                  }}
                />
                {
                  productPreviews?.length > 0
                  &&
                  <div className='mt-10'>
                    <label className="block font-semibold mb-1">New Images</label>
                    <div className='flex items-center gap-2 flex-wrap mb-7'>
                      {
                        productPreviews?.map((img, i) => {

                          const handleImgDelete = () => {
                            const updatedPreviews = productPreviews?.filter((p, _i) => _i !== i)
                            setProductPreviews(updatedPreviews)
                          }

                          const image_url = img?.preview

                          return (
                            <ProductImage
                              key={i}
                              img={image_url}
                              handleImgDelete={handleImgDelete}
                            />
                          )
                        })
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className="w-full md:w-64 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <span className="font-semibold mb-2">Publish</span>
                <div className="flex gap-2 mb-2">
                  {
                    product_id
                    &&
                    <button
                      onClick={() => {
                        const product_visibility = productInfo?.product_visibility ? false : true

                        if (product_visibility === true) {
                          if (productInfo?.product_variants_combinations?.length > 0) {
                            updateProductVisibility({
                              callback: ({ }) => {
                                const updatedProductInfo = {
                                  ...(productInfo || {}),
                                  product_visibility
                                }

                                setProductInfo(updatedProductInfo)
                              },
                              product_id: productInfo?.id,
                              product_visibility: product_visibility
                            })

                          } else {
                            toast.info("You need to setup variants for this product first before you can make it visible")
                          }
                        }
                      }}
                      className={`${productInfo?.product_visibility ? 'text-gray-700' : 'bg-[#703dcb] text-white'} border cursor-pointer border-gray-300 rounded-lg px-3 py-1`}
                    >
                      {
                        productInfo?.product_visibility ? 'Hide' : 'Make Visible'
                      }
                    </button>
                  }
                </div>
                <button
                  type='submit'
                  // disabled={!(isValid && dirty)}
                  onClick={handleSubmit}
                  style={{
                    // opacity: !(isValid && dirty) ? 0.5 : 1
                  }}
                  className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition"
                >
                  Publish
                </button>
                {
                  product_id
                  &&
                  <button
                    // disabled={!(isValid && dirty)}
                    onClick={() => navigate("/admin/marketplace/manage-product/product-variants", { state: { product_id } })}
                    style={{
                      // opacity: !(isValid && dirty) ? 0.5 : 1
                      border: '1px solid purple',
                      color: 'purple'
                    }}
                    className="cursor-pointer rounded-lg px-4 py-2 font-semibold transition"
                  >
                    Variants
                  </button>
                }
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <span className="font-semibold mb-2">Product categories</span>
                <div className="flex flex-col gap-1">
                  {
                    productCategories.map((pCategory, i) => {

                      const { category: cat } = pCategory

                      const isSelected = categories?.map(c => c?.toLowerCase())?.includes(cat?.toLowerCase())

                      const handleCatClick = () => {
                        if (isSelected) {
                          const updated = categories.filter(c => c !== cat)
                          setCategories(updated)

                        } else {
                          setCategories([
                            ...categories, cat
                          ])
                        }
                      }

                      return (
                        <div
                          key={i}
                          className='flex items-center justify-between gap-2'
                        >
                          <div
                            onClick={handleCatClick}
                            className="flex items-center gap-2 cursor-pointer capitalize">
                            {
                              isSelected
                                ?
                                <MdCheckBox size={20} color={"#703dcb"} />
                                :
                                <MdCheckBoxOutlineBlank size={20} color={"#000"} />
                            }

                            {cat}
                          </div>

                          <BsTrash
                            onClick={() => {
                              if (productCategories?.length > 1) {

                                deleteProductCategory({
                                  category: pCategory?.category
                                })

                              } else {
                                toast.info("At least 1 product category must exist!")
                              }
                            }}
                            className='cursor-pointer'
                          />
                        </div>
                      )
                    })
                  }
                </div>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e?.target?.value)}
                  placeholder="New category..."
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none"
                />

                <button
                  onClick={() => {
                    if (!categoryInput) return;

                    const cats = productCategories?.map(c => c?.category?.toLowerCase())

                    if (cats?.includes(categoryInput?.toLowerCase())) {
                      return toast.info("Category already exists")
                    }

                    addProductCategory({
                      category: categoryInput,
                      callBack: ({ }) => {
                        setCategoryInput('')
                      }
                    })
                  }}
                  className="text-(--primary-500) text-sm text-left mt-2 cursor-pointer"
                >
                  + Add new category
                </button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default AddProduct;
