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
import { FaEdit } from "react-icons/fa";
import { BsCheck } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { getPublicImageUrl } from "../../../lib/requestApi";
import ProfileImg from "../components/ProfileImg";
import Button from "../components/ui/button";

function Product() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const { fetchProducts } = useApiReqs()

  const products = useSelector(state => getAdminState(state).products)

  const [searchFilter, setSearchFilter] = useState('')
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

  const filteredData = (products || [])?.filter(p => {
    const { product_name } = p

    const byName =
      searchFilter?.toLowerCase().includes(product_name?.toLowerCase())
      ||
      product_name?.toLowerCase().includes(searchFilter?.toLowerCase())

    return byName
  })

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredData,
    maxShow: 7,
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
              placeholder="Search by name"
              className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
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
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="py-4 px-3 text-left font-medium">Image</th> */}
                <th className="py-4 px-3 text-left font-medium">Image</th>
                <th className="py-4 px-3 text-left font-medium">Product Name</th>
                <th className="py-4 px-3 text-left font-medium">Visible</th>
                {/* <th className="py-4 px-3 text-left font-medium">Variants</th> */}
                {/* <th className="py-4 px-3 text-left font-medium">Stock</th> */}
                {/* <th className="py-4 px-3 text-left font-medium">Status</th> */}
                <th className="py-4 px-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                pageItems?.length > 0
                  ?
                  pageItems.map((p, idx) => {

                    const image_url = getPublicImageUrl({ path: p?.product_images?.[0], bucket_name: 'admin_products' })

                    return (
                      <tr
                        key={p?.id}
                      >
                        <td className="py-4 px-3">
                          <ProfileImg
                            profile_img={image_url}
                            name={p?.product_name}
                          />
                        </td>
                        <td className="py-4 px-3">{p.product_name}</td>
                        <td className="py-4 px-3">{p?.product_visibility ? <BsCheck size={16} color="#703DCB" /> : <MdOutlineCancel size={16} color="red" />}</td>
                        {/* <td className="py-4 px-3">{variants_count}</td> */}
                        <td className="py-4 px-3 items-center">
                          <div className="flex flex-col sm:flex-row w-max gap-2 items-center">
                            <button
                              onClick={() => navigate("/admin/marketplace/manage-product/product-variants", { state: { product_id: p?.id } })}
                              className="bg-purple-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-purple-700"
                            >
                              Variants
                            </button>
                            <button
                              onClick={() => navigate("/admin/marketplace/edit-product", { state: { product_id: p?.id, product: p } })}
                              className="bg-purple-100 cursor-pointer text-purple-600 hover:bg-purple-200 px-3 py-1 rounded text-xs w-full sm:w-auto transition"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr className="border-t border-gray-100">
                    <td colSpan={'6'} className="pt-5">
                      <ZeroItems zeroText={'No products found'} />
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
