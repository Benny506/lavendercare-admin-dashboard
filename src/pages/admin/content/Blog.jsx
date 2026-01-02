import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import PathHeader from "../components/PathHeader";
import { formatDate1 } from "../../../lib/utils";
import ZeroItems from "../components/ZeroItems";
import Pagination from "../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";

function Blog() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [articles, setArticles] = useState([])
  const [searchFilter, setSearchFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)

  useEffect(() => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'fetchArticles'
      }
    })
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type } = data

      if (type === 'fetchArticles') {
        fetchArticles()
      }
    }
  }, [apiReqs])

  const fetchArticles = async () => {
    try {

      const { data, error } = await supabase
        .from('articles')
        .select('*')

      if (!data || error) {
        console.warn(error)
        throw new Error()
      }

      setArticles(data)

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      return;

    } catch (error) {
      console.warn(error)
      return fetchArticlesFailure({ errorMsg: 'Something went wrong! Try again' })
    }
  }
  const fetchArticlesFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const filtered = articles?.filter(a => {
    const { title } = a

    const matchSearch =
      title?.toLowerCase().includes(searchFilter?.toLowerCase())
      ||
      searchFilter?.toLowerCase().includes(title?.toLowerCase())

    const matchesSearch = searchFilter ? matchSearch : true

    return matchesSearch
  })

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: (filtered || []),
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
    <div className="pt-6 w-full min-h-screen">
      {/* breadcrumb */}
      <PathHeader
        paths={[
          { text: 'Content' },
          { text: 'Blog Management' }
        ]}
      />

      {/* blog title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Blog Management</h2>
        <button
          className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium"
          onClick={() => navigate("/admin/content/new-blog")}
        >
          + New Article
        </button>
      </div>

      {/* blog wrapper */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-1 justify-between pt-2 pb-6">
          <h3 className="text-[20px] font-semibold">All Blog</h3>

          <div className="flex flex-col w-full sm:w-max sm:flex-row gap-2 items-center justify-between">
            <input
              value={searchFilter}
              onChange={e => setSearchFilter(e?.target?.value)}
              type="text"
              placeholder="Search by name"
              className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* table content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Title
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Date Posted
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                pageItems?.length === 0
                  ?
                  <tr className="">
                    <td colSpan={6} className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <ZeroItems
                        zeroText={'No articles found!'}
                      />
                    </td>
                  </tr>
                  :
                  pageItems.map((blog, idx) => (
                    <tr key={idx}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {blog.title}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {blog.category}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {formatDate1({ dateISO: blog?.created_at })}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                        <button
                          className="cursor-pointer"
                          onClick={() => navigate("/admin/content/blog-detail", { state: { article: blog } })}
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
                        <button className="cursor-pointer">
                          <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.7837 7.5L12.4952 15M8.50481 15L8.21635 7.5M16.523 4.82547C16.808 4.86851 17.092 4.91456 17.375 4.96358M16.523 4.82547L15.6332 16.3938C15.558 17.3707 14.7434 18.125 13.7637 18.125H7.23631C6.25655 18.125 5.44198 17.3707 5.36683 16.3938L4.47696 4.82547M16.523 4.82547C15.5677 4.6812 14.6013 4.57071 13.625 4.49527M3.625 4.96358C3.90798 4.91456 4.19198 4.86851 4.47696 4.82547M4.47696 4.82547C5.43231 4.6812 6.39874 4.57071 7.375 4.49527M13.625 4.49527V3.73182C13.625 2.74902 12.8661 1.92853 11.8838 1.8971C11.4244 1.8824 10.963 1.875 10.5 1.875C10.037 1.875 9.57565 1.8824 9.11618 1.8971C8.13388 1.92853 7.375 2.74902 7.375 3.73182V4.49527M13.625 4.49527C12.5938 4.41558 11.5516 4.375 10.5 4.375C9.44836 4.375 8.4062 4.41558 7.375 4.49527"
                              stroke="#E41C11"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
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

          <div className="mb-2" />
        </div>
      </div>
    </div>
  );
}

export default Blog;
