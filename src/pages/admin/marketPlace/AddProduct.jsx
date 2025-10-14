import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PathHeader from '../components/PathHeader';
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup'
import ErrorMsg1 from '../components/ErrorMsg1';
import { currencies } from '../../../lib/currencies';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from 'react-icons/md';
import { productCategories } from '../../../lib/utils_Jsx';
import { useDispatch } from 'react-redux';
import { appLoadStart, appLoadStop } from '../../../redux/slices/appLoadingSlice';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Carousel from '../components/ui/Carousel';
import { getMultiplePublicUrls, getPublicUrl, uploadAsset } from '../../../lib/requestApi';
import supabase from '../../../database/dbInit';
import { formatNumberWithCommas } from '../../../lib/utils';

const validationSchema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  product_description: yup.string().required("Product description is required"),
  price_currency: yup.string().required("Currency is required"),
  price_value: yup
    .number()
    .typeError('Price must be a valid number')
    .required('Price is required')
    .positive('Price must be greater than zero'),
  stock_count: yup
    .number()
    .typeError('Stock count must be a valid number')
    .required('Stock count is required')
    .positive('Stock count must be greater than zero')
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
  const product = state?.productInfo

  const productImgRef = useRef(null)

  const [productPreviews, setProductPreviews] = useState()
  const [categories, setCategories] = useState([])
  const [productInfo, setProductInfo] = useState(null)
  const [qty, setQty] = useState(1);
  const [apiReqs, setApiReqs] = useState({
    isLoading: false, errorMsg: null, data: null
  })

  useEffect(() => {
    if (product) {
      loadImages()
    }
  }, [product])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'createProducts') {
        createProducts({ requestInfo })
      }
    }
  }, [apiReqs])

  const loadImages = async () => {
    if (!product) return;

    dispatch(appLoadStart());

    const { urls } = await getMultiplePublicUrls({
      filePaths: product?.product_images,
      bucket_name: 'admin_products'
    })

    const previews = urls.map((u, i) => ({
      preview: u,
      file: null,
      path: product?.product_images[i]
    }))

    setProductPreviews(previews)

    setProductInfo({
      ...product,
      productPreviews: previews
    })

    setCategories(product?.categories)

    dispatch(appLoadStop())
  }

  const createProducts = async ({ requestInfo }) => {
    try {

      const { product_images, product_name } = requestInfo


      const { filePaths } = await uploadAsset({
        file: product_images?.map(img => img?.file).filter(img => img instanceof File),
        ext: 'png',
        id: `${product_name}-img`,
        bucket_name: 'admin_products'
      })

      const allExisting = product_images?.map(img => img?.path).filter(Boolean)

      const images = [...allExisting, ...filePaths]

      const requestBody = {
        ...requestInfo,
        stock_count: Math.floor(requestInfo?.stock_count),
        product_images: images
      }

      const { error } =
        product && product?.id
          ?
          await supabase
            .from("products")
            .update(requestBody)
            .eq("id", product?.id)
          :
          await supabase
            .from("products")
            .insert({
              ...requestBody,
              by: 'admin'
            })

      if (error) {
        console.log("Error here", error)
        throw new Error()
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })
      toast.success(product ? 'Product updated' : 'Product created')

      navigate(-1)

      return;

    } catch (error) {
      console.log(error)
      return createProductsFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const createProductsFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  return (
    <div className="w-full px-2 md:px-8 py-6">
      {/* Breadcrumbs */}
      <PathHeader
        paths={[
          { text: 'MarketPlace' },
          ...(
            product
              ?
              [
                { text: 'Edit Product' },
                { text: product?.product_name },
              ]
              :
              [
                { text: 'Add Product' },
              ]
          )
        ]}
      />

      <h2 className="text-xl md:text-2xl font-bold mb-2">Add New Product</h2>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          product_name: product?.product_name || '',
          product_description: product?.product_description || '',
          price_currency: product?.price_currency || '',
          price_value: product?.price_value || '',
          stock_count: product?.stock_count || ''
        }}
        onSubmit={(values) => {
          if (!productPreviews || productPreviews?.length === 0) {
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
                  disabled={product?.product_name ? true : false}
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
                  productPreviews?.length > 0
                  &&
                  <div className='flex items-center gap-2 flex-wrap mb-2'>
                    {
                      productPreviews?.map((p, i) => {
                        const { file, preview } = p

                        const removeSinglePreview = () => {
                          const updated = productPreviews?.filter((_, _i) => _i !== i)
                          setProductPreviews(updated)
                        }

                        return (
                          <div key={i} className='relative w-2/5'>
                            <img
                              src={preview}
                              className='w-full'
                            />

                            <div onClick={removeSinglePreview} className='bg-[#703DCB] p-3 absolute cursor-pointer top-0 right-0'>
                              <MdDelete size={20} color='#FFF' />
                            </div>
                          </div>
                        )
                      })
                    }
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
              </div>
              <div>
                <label className="block font-semibold mb-1">Product Price</label>
                <div className="flex gap-2">
                  <select
                    className="border border-gray-200 rounded-lg px-2 py-2 bg-white text-gray-700"
                    value={values.price_currency}
                    name='price_currency'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option selected value='' disabled>Currency</option>
                    {
                      currencies.map((c, i) => {
                        const { title, value } = c

                        return (
                          <option key={i} value={value}> {title} </option>
                        )
                      })
                    }
                  </select>
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Price"
                    type='number'
                    value={values.price_value}
                    name='price_value'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <ErrorMessage name='price_value'>
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
                <ErrorMessage name='price_currency'>
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block font-semibold mb-1">No of Stock</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Number of stock"
                  type='number'
                  value={values.stock_count}
                  name='stock_count'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name='stock_count'>
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
            </div>
            <div className="w-full md:w-64 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <span className="font-semibold mb-2">Publish</span>
                <div className="flex gap-2 mb-2">
                  {/* <button className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700">Save Draft</button> */}
                  <button
                    className="border cursor-pointer border-gray-300 rounded-lg px-3 py-1 text-gray-700"
                    onClick={async () => {
                      dispatch(appLoadStart())

                      const validationErrors = await validateForm();

                      // Mark all fields as touched so errors show
                      setTouched(
                        Object.keys(validationSchema.fields).reduce((acc, key) => {
                          acc[key] = true;
                          return acc;
                        }, {})
                      );

                      if (Object.keys(validationErrors).length === 0) {

                        if (!productPreviews || productPreviews?.length === 0) {
                          toast.info("Select at least one image preview of your product")
                          dispatch(appLoadStop())
                          return
                        }

                        if (categories?.length === 0) {
                          toast.info("Select at least one category which your product belongs to")
                          dispatch(appLoadStop())
                          return
                        }

                        setProductInfo({
                          ...values, productPreviews, categories
                        })

                      } else {
                        console.log('Validation failed:', validationErrors);
                        toast.info("Not all fields are valid")
                      }

                      dispatch(appLoadStop())
                    }}>
                    Preview
                  </button>
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
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <span className="font-semibold mb-2">Product categories</span>
                <div className="flex flex-col gap-1">
                  {
                    productCategories.map((cat, i) => {

                      const isSelected = categories?.includes(cat)

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
                          onClick={handleCatClick}
                          className="flex items-center gap-2 cursor-pointer">
                          {
                            isSelected
                              ?
                              <MdCheckBox size={20} color={"#703dcb"} />
                              :
                              <MdCheckBoxOutlineBlank size={20} color={"#000"} />
                          }

                          {cat}
                        </div>
                      )
                    })
                  }
                </div>
                <button className="text-(--primary-500) text-xs text-left mt-2">+ Add new category</button>
              </div>
            </div>
          </div>
        )}
      </Formik>

      <Modal
        isOpen={productInfo}
        onClose={() => setProductInfo(null)}
      >
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center max-w-3xl mx-auto">
          <div className="w-full flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 flex justify-center items-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Carousel
                  slides={productInfo?.productPreviews?.map((p, i) => ({ src: p?.preview, alt: `${productInfo?.product_name} image ${i + 1}` }))}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{productInfo?.product_name}</h2>
              <div className="text-lg font-semibold mb-2">{productInfo?.price_currency} {formatNumberWithCommas(productInfo?.price_value)}</div>
              <div className="text-gray-500 mb-4">{productInfo?.product_description}</div>
              <div className="flex items-center gap-2 mb-4">
                <button className="border border-gray-300 rounded px-2" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                <span className="px-2">{qty}</span>
                <button className="border border-gray-300 rounded px-2" onClick={() => {
                  if (qty === productInfo?.stock_count) {
                    toast.info("No more in stock")
                    return
                  }
                  setQty(qty + 1)
                }}>+</button>
                <button className="ml-4 bg-gray-200 rounded px-4 py-2 font-semibold">Add to cart</button>
              </div>
              <div className="text-xs text-gray-600">
                <div className='flex items-center gap-1 flex-wrap'>
                  {productInfo?.categories?.map((c, i) => {
                    return (
                      <Badge
                        key={i}
                        variant='default'
                        className='rounded-lg py-2 px-5'
                      >
                        {c}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddProduct;
