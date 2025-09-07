import React from "react";
import { useNavigate } from "react-router-dom";

const blogData = [
  {
    title: "The Benefits of Regular Exercise",
    author: "Dr. Eniola Obi",
    category: "Medical",
    date: "2025-07-06",
    status: "Published",
  },
  {
    title: "Understanding Mental Wellness",
    author: "Dr. Eniola Obi",
    category: "Mental",
    date: "2025-07-05",
    status: "Published",
  },
  {
    title: "Healthy Eating Habits for a Balanced Life",
    author: "Nurse Lilian James",
    category: "Physical",
    date: "2025-07-04",
    status: "Published",
  },
  {
    title: "Managing Stress in Daily Life",
    author: "Dada Funke Adegemi",
    category: "Medical",
    date: "2025-07-03",
    status: "Published",
  },
  {
    title: "The Importance of Sleep",
    author: "Dr. Eniola Obi",
    category: "Mental",
    date: "2025-07-02",
    status: "Draft",
  },
];

function Blog() {
  const navigate = useNavigate();
  return (
    <div className="pt-6 w-full min-h-screen">
      {/* breadcrumb */}
      <div className="flex items-center gap-1 mb-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.66667 14.1663H13.3333M9.18141 2.30297L3.52949 6.6989C3.15168 6.99276 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99276 16.4705 6.69891L10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297Z"
            stroke="#8B8B8A"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1918_35894)">
            <path
              d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
              fill="#8B8B8A"
            />
          </g>
          <defs>
            <clipPath id="clip0_1918_35894">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <span className="text-xs text-gray-400">Content</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1918_35894)">
            <path
              d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
              fill="#8B8B8A"
            />
          </g>
          <defs>
            <clipPath id="clip0_1918_35894">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="text-xs text-(--primary-500) font-semibold">
          Blog Management
        </span>
      </div>

      {/* blog title */}
      <h2 className="text-lg sm:text-xl font-bold mb-4">Blog Management</h2>

      {/* blog wrapper */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-1 justify-between pt-2 pb-6">
          <h3 className="text-[20px] font-semibold">All Blog</h3>

          <div className="flex flex-col w-full sm:w-max sm:flex-row gap-2 items-center justify-between">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select className="border border-gray-200 w-full rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
              <option>Filter by: All</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
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
                  Author
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Date Posted
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogData.map((blog, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {blog.title}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {blog.author}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {blog.category}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {blog.date}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === "Published"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => navigate("/admin/content/blog-detail")}
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
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 gap-2 mt-2">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
            Previous
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">
              1
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              2
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              3
            </button>
            <span className="text-xs text-gray-500">... 10</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
