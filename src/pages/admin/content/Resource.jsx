import React from "react";

const resources = [
  {
    name: "The Benefits of Regular Exercise",
    type: "PDF",
    status: "Published",
  },
  { name: "Understanding Mental Wellness", type: "PDF", status: "Published" },
  {
    name: "Healthy Eating Habits for a Balanced Life",
    type: "Video",
    status: "Published",
  },
  { name: "Managing Stress in Daily Life", type: "DOC", status: "Published" },
  { name: "The Importance of Sleep", type: "PDF", status: "Draft" },
];

function Resource() {
  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
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
        <span className="text-xs text-gray-400">Blog Management</span>
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
          Educational Resources
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-2 pb-3">
        Manage Resources
      </h2>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-lg">All Resources</h3>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
            <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option>Filter by: All</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left font-medium">Name</th>
                <th className="py-2 px-2 text-left font-medium">Type</th>
                <th className="py-2 px-2 text-left font-medium">Status</th>
                <th className="py-2 px-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r, idx) => (
                <tr
                  key={r.name}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-2">{r.name}</td>
                  <td className="py-2 px-2">{r.type}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "Published"
                          ? "bg-(--success) text-(--success_text)"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button
                      title="View"
                      className="text-(--primary-500) cursor-pointer hover:underline"
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
                    <button
                      title="Delete"
                      className="text-red-500 cursor-pointer hover:underline"
                    >
                      <svg
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.7837 6.5L10.4952 14M6.50481 14L6.21635 6.5M14.523 3.82547C14.808 3.86851 15.092 3.91456 15.375 3.96358M14.523 3.82547L13.6332 15.3938C13.558 16.3707 12.7434 17.125 11.7637 17.125H5.23631C4.25655 17.125 3.44198 16.3707 3.36683 15.3938L2.47696 3.82547M14.523 3.82547C13.5677 3.6812 12.6013 3.57071 11.625 3.49527M1.625 3.96358C1.90798 3.91456 2.19198 3.86851 2.47696 3.82547M2.47696 3.82547C3.43231 3.6812 4.39874 3.57071 5.375 3.49527M11.625 3.49527V2.73182C11.625 1.74902 10.8661 0.928526 9.88382 0.897103C9.42435 0.882405 8.96304 0.875 8.5 0.875C8.03696 0.875 7.57565 0.882405 7.11618 0.897103C6.13388 0.928526 5.375 1.74902 5.375 2.73182V3.49527M11.625 3.49527C10.5938 3.41558 9.55164 3.375 8.5 3.375C7.44836 3.375 6.4062 3.41558 5.375 3.49527"
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
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button className="text-(--primary-500) font-semibold">
            &larr; Previous
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 10].map((n, i) => (
              <button
                key={i}
                className={`px-2 py-1 rounded ${
                  n === 1
                    ? "bg-(--primary-100) text-(--primary-500)"
                    : "text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button className="text-(--primary-500) font-semibold">
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Resource;
