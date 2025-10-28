import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { getAdminState } from "../../../redux/slices/adminState";
import useApiReqs from "../../../hooks/useApiReqs";
import { formatNumberWithCommas, sumArray } from "../../../lib/utils";
import Badge from "../components/ui/Badge";
import Pagination from "../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import ZeroItems from "../components/ZeroItems";

function Product() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const { fetchProducts } = useApiReqs()

  const products = useSelector(state => getAdminState(state).products)

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)


  useEffect(() => {
    if (products?.length === 0) {
      loadMoreProducts()
    }
  }, [])

  const loadMoreProducts = () => {
    fetchProducts({
      callBack: ({ canLoadMore }) => {
        setCanLoadMore(canLoadMore)
      }
    })
  }

  const filteredData = products

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredData,
    maxShow: 4,
    index: currentPage,
    maxPage: 5,
    pageListIndex
  });

  const incrementPageListIndex = () => {
    if (pageListIndex === totalPageListIndex) {
      setPageListIndex(0)

    } else {
      setPageListIndex(prev => prev + 1)
    }

    return
  }

  const decrementPageListIndex = () => {
    if (pageListIndex == 0) {
      setPageListIndex(totalPageListIndex)

    } else {
      setPageListIndex(prev => prev - 1)
    }

    return
  }

  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
      <PathHeader
        paths={[
          { text: 'MarketPlace' },
          { text: 'Manage Product' },
        ]}
      />

      {/* manage product tile */}
      <div className="flex md:flex-row flex-col justify-between mb-3 gap-4 items-center">
        <h2 className="text-2xl font-semibold">Manage Product</h2>

        <div className="flex flex-row md:items-center gap-2">
          <div className="flex gap-2">
            <button className="border border-gray-200 w-full rounded-lg px-3 py-1 text-gray-700">
              All
            </button>
          </div>
          <button
            className="bg-(--primary-500) cursor-pointer w-full text-white rounded-lg px-4 py-2 font-semibold transition"
            onClick={() => navigate("/admin/marketplace/add-product")}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* all products section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-lg">All Product</h3>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
            {/* <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option>Filter by: All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Out of Stock</option>
            </select> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {/* <th className="py-2 px-2 text-left font-medium">Image</th> */}
                <th className="py-2 px-2 text-left font-medium">
                  Product Name
                </th>
                {/* <th className="py-2 px-2 text-left font-medium">SKU</th> */}
                <th className="py-2 px-2 text-left font-medium">Category</th>
                <th className="py-2 px-2 text-left font-medium">Price</th>
                <th className="py-2 px-2 text-left font-medium">Stock</th>
                {/* <th className="py-2 px-2 text-left font-medium">Status</th> */}
                <th className="py-2 px-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData?.length > 0
                  ?
                  filteredData.map((p, idx) => {

                    const stock_count = 
                      p?.product_variants
                      ?
                        sumArray(p?.product_variants?.map(v => v?.stock))
                      :
                        0

                    return (
                      <tr
                        key={p?.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2">{p.product_name}</td>
                        {/* <td className="py-2 px-2">{p.sku}</td> */}
                        <td className="py-2 px-2 flex gap-2 flex-wrap">
                          {
                            p?.categories?.map((cat, i) => (
                              <Badge
                                key={i}
                                className='rounded-lg py-1 px-3'
                              >
                                {cat}
                              </Badge>
                            ))
                          }
                        </td>
                        <td className="py-2 px-2">{p?.price_currency} {formatNumberWithCommas(p?.price_value)}</td>
                        <td className="py-2 px-2">
                          {formatNumberWithCommas(stock_count)}
                          {
                            stock_count === 0
                            &&
                            <Badge
                              variant="danger"
                            >
                              Out of stock
                            </Badge>
                          }
                        </td>
                        <td className="py-2 px-2 items-center flex gap-2">
                          {/* view button */}
                          <button
                            title="View"
                            className="text-(--primary-500) cursor-pointer"
                            onClick={() => navigate("/admin/marketplace/edit-product", { state: { productInfo: p } })}
                          >
                            <svg
                              width="19"
                              height="12"
                              viewBox="0 0 19 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18.4483 5.757C18.422 5.69775 17.7868 4.2885 16.3745 2.87625C14.4928 0.9945 12.116 0 9.5 0C6.884 0 4.50725 0.9945 2.62549 2.87625C1.21324 4.2885 0.574993 5.7 0.551743 5.757C0.517628 5.83373 0.5 5.91677 0.5 6.00075C0.5 6.08473 0.517628 6.16777 0.551743 6.2445C0.577993 6.30375 1.21324 7.71225 2.62549 9.1245C4.50725 11.0055 6.884 12 9.5 12C12.116 12 14.4928 11.0055 16.3745 9.1245C17.7868 7.71225 18.422 6.30375 18.4483 6.2445C18.4824 6.16777 18.5 6.08473 18.5 6.00075C18.5 5.91677 18.4824 5.83373 18.4483 5.757ZM9.5 10.8C7.1915 10.8 5.17475 9.96075 3.50524 8.30625C2.82023 7.62502 2.23743 6.84822 1.77499 6C2.23731 5.1517 2.82012 4.37488 3.50524 3.69375C5.17475 2.03925 7.1915 1.2 9.5 1.2C11.8085 1.2 13.8253 2.03925 15.4948 3.69375C16.1811 4.37472 16.7652 5.15154 17.2288 6C16.688 7.0095 14.3323 10.8 9.5 10.8ZM9.5 2.4C8.78799 2.4 8.09196 2.61114 7.49995 3.00671C6.90793 3.40228 6.44651 3.96453 6.17403 4.62234C5.90156 5.28015 5.83026 6.00399 5.96917 6.70233C6.10808 7.40066 6.45094 8.04212 6.95441 8.54559C7.45788 9.04906 8.09934 9.39192 8.79767 9.53083C9.49601 9.66973 10.2198 9.59844 10.8777 9.32597C11.5355 9.05349 12.0977 8.59207 12.4933 8.00005C12.8889 7.40804 13.1 6.71201 13.1 6C13.099 5.04553 12.7194 4.13043 12.0445 3.45551C11.3696 2.7806 10.4545 2.40099 9.5 2.4ZM9.5 8.4C9.02532 8.4 8.56131 8.25924 8.16663 7.99553C7.77195 7.73181 7.46434 7.35698 7.28269 6.91844C7.10104 6.4799 7.05351 5.99734 7.14611 5.53178C7.23872 5.06623 7.4673 4.63859 7.80294 4.30294C8.13859 3.9673 8.56623 3.73872 9.03178 3.64612C9.49734 3.55351 9.9799 3.60104 10.4184 3.78269C10.857 3.96434 11.2318 4.27195 11.4955 4.66663C11.7592 5.06131 11.9 5.52532 11.9 6C11.9 6.63652 11.6471 7.24697 11.1971 7.69706C10.747 8.14714 10.1365 8.4 9.5 8.4Z"
                                fill="#6F3DCB"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr className="border-t border-gray-100">
                    <td colSpan={'6'} className="pt-5">
                      <ZeroItems zeroText={'No provider found'} />
                    </td>
                  </tr>
              }
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            pageItems={pageItems}
            pageListIndex={pageListIndex}
            pageList={pageList}
            totalPageListIndex={totalPageListIndex}
            decrementPageListIndex={decrementPageListIndex}
            incrementPageListIndex={incrementPageListIndex}
            setCurrentPage={setCurrentPage}
          />

          <div className="pb-2" />
        </div>

        {
          canLoadMore
          &&
          <div className="w-full flex items-center justify-center my-5">
            <button
              onClick={loadMoreProducts}
              className={'bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer'}
            >
              Load more
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default Product;
