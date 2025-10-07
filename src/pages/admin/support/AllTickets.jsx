import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import { usePagination } from "../../../hooks/usePagination";
import { isoToDateTime } from "../../../lib/utils";
import { getTicketPriorityBadge, getTicketStatusBadge } from "../../../lib/utils_Jsx";
import PathHeader from "../components/PathHeader";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from 'yup'


// COME BACK TO TICKET ASSIGNMENT LOGIC


function AllTickets() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [showAssign, setShowAssign] = useState(false);
  const [tickets, setTickets] = useState([])
  const [tab, setTab] = useState('All')
  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageListIndex, setPageListIndex] = useState(0)
  const [admins, setAdmins] = useState([])


  useEffect(() => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'fetchTickets'
      }
    })
  }, [])

  useEffect(() => {
    if(showAssign){
      setApiReqs({
        isLoading: true,
        errorMsg: null,
        data: {
          type: 'fetchAdmins'
        }
      })
    }
  }, [showAssign])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type } = data

      if (type == 'fetchTickets') {
        fetchTickets()
      }

      if(type === 'fetchAdmins'){
        fetchAdmins()
      }
    }
  }, [apiReqs])

  const fetchAdmins = async () => {
    try {

      const { data, error } = await supabase
        .from("admins")
        .select("*")

      if(error) {
        console.warn(error)
        throw new Error()
      }

      setAdmins(data)

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      toast.info("Admins retrieved")
      
      return;
      
    } catch (error) {
      console.log(error)
      return fetchAdminsFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const fetchAdminsFailure = ({ errorMsg }) => {s
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return
  }

  const fetchTickets = async () => {
    try {

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        throw new Error()
      }

      setTickets(data)

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

    } catch (error) {
      console.error(error)
      return fetchTicketsFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const fetchTicketsFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const handleAssign = (ticket, e) => {
    e.stopPropagation();
    setShowAssign(true);
  };

  const handleDetails = (ticket, e) => {
    if (e) e.stopPropagation();
    navigate(`/admin/support/ticket-details/${ticket.id.replace("#", "")}`);
  };

  // ✅ Filter & Search
  const filteredData = tickets.filter(
    (item) => {

      const { id, subject } = item

      const matchSearch =
        (searchTerm.toLowerCase().includes(subject?.toLowerCase())
          ||
          subject.toLowerCase().includes(searchTerm?.toLowerCase()))

        ||

        (searchTerm.toLowerCase().includes(id?.toLowerCase())
          ||
          id.toLowerCase().includes(searchTerm?.toLowerCase()))

      const matchesFilter = (tab?.toLowerCase() === "all" || item.status === tab?.toLowerCase())

      return matchesFilter && matchSearch
    }
  );

  const { pageItems, pageList, totalPageListIndex } = usePagination({
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

  const columns = [
    { key: "id", label: "Ticket ID" },
    { key: "subject", label: "Subject" },
    {
      key: "created_at",
      label: "Created On",
      render: (row) => (
        <span>
          {isoToDateTime({ isoString: row?.created_at })}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => (
        getTicketPriorityBadge({ status: row?.priority })
      ),
    },
    {
      key: "field",
      label: "Field",
      // render: (row) => (
      //     getTicketPriorityBadge({ status: row?.priority })
      // ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        getTicketStatusBadge({ status: row?.status })
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            // onClick={() => setActiveTicket(row)}
            className="cursor-pointer px-4 py-1 text-white text-sm bg-purple-500 text-grey-50 rounded-4xl"
          >
            View
          </button>

          <button
            onClick={() => setShowAssign(row?.id)}
            className="cursor-pointer px-4 py-1 text-white text-sm bg-gray-500 text-grey-50 rounded-4xl"
          >
            Assign
          </button>          
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
      {/* Breadcrumb */}
      <PathHeader 
        paths={[
          { text: 'Support Tickets' },
          { text: 'All Tickets' },
        ]}
      />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">All Tickets</h2>

        <div className="flex items-center gap-7">
            {
                ['All', 'Open', 'Closed']
                .map((t, i) => {

                    const isActive = tab === t ? true : false

                    return (
                        <p
                            key={i}
                            onClick={() => setTab(t)}
                            className={`m-0 p-0 pb-1 font-bold cursor-pointer ${isActive ? 'border-b-4 px-4 border-purple-600 text-purple-600' : 'text-gray-600'}`}
                        >
                            { t }
                        </p>
                    )
                })
            }
        </div>
      </div>

      <div className="bg-white rounded-xl p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e?.target?.value)}
            type="text"
            placeholder="Search by ticket ID, subject, or user"
            className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple"
          />
        </div>
        <div className="overflow-x-auto">
          {/* Table */}
          <Table
            columns={columns}
            data={filteredData}
            styles={{
              wrapper: "md:p-3 overflow-x-auto max-w-xs md:max-w-full",
              table: "w-full border-collapse -mt-3",
              headerRow: "bg-grey-50 text-left text-gray-700 text-sm border-b border-grey-100",
              headerCell: "p-4 font-semibold",
              row: "border-b hover:bg-gray-50",
              cell: "p-4 text-sm",
              emptyWrapper: "flex flex-col items-center justify-center py-20 text-center",
              icon: "w-20 h-20 mb-6 text-purple-500",
              emptyTitleText: "No tickets created",
              emptySubText: "Support tickets will appear here",
              emptyIcon: "uil:schedule"
            }}
            pagination={
              <>
                {
                  pageItems.length > 0
                  &&
                  <div className="mt-6 w-full flex-1 flex items-center justify-center">
                    {/* <button 
                                      disabled={pageListIndex > 0 ? false : true}
                                      onClick={decrementPageListIndex} 
                                      style={{
                                          opacity: pageListIndex > 0 ? 1 : 0.5
                                      }}
                                      className="cursor-not-allowed flex items-center text-gray-600 hover:text-gray-800 font-bold"
                                  >
                                      <Icon icon="mdi:arrow-left" className="mr-2" /> 
                                      <span className="hidden md:inline">Previous</span>
                                  </button>                         */}

                    <div className="flex flex-wrap justify-center gap-2">
                      {pageList?.map((p, i) => {

                        const isActivePAge = p - 1 === currentPage

                        const handlePClick = () => {
                          if (p === '...') {

                            if (i == 0) {
                              decrementPageListIndex()

                            } else {
                              incrementPageListIndex()
                            }

                            return;
                          }

                          setCurrentPage(p - 1)

                          return;
                        }

                        return (
                          <button
                            key={i}
                            onClick={handlePClick}
                            className={`w-8 h-8 cursor-pointer rounded-full ${isActivePAge ? "bg-purple-100 text-purple-600" : "text-gray-600"} flex items-center justify-center`}
                          >
                            {p}
                          </button>
                        )
                      }
                      )}
                    </div>
                    {/* <button 
                                      disabled={pageListIndex < totalPageListIndex ? false : true}
                                      onClick={incrementPageListIndex} 
                                      style={{
                                          opacity: pageListIndex < totalPageListIndex ? 1 : 0.5
                                      }}
                                      className="cursor-pointer flex items-center text-gray-600 hover:text-gray-800 font-bold"
                                  >
                                      <span className="hidden md:inline">Next</span> <Icon icon="mdi:arrow-right" className="ml-2" />
                                  </button>                         */}
                  </div>
                }
              </>
              // <Pagination
              //     currentPage={currentPage}
              //     totalPages={totalPages}
              //     onPageChange={handlePageChange}
              // />
            }
          />
        </div>
      </div>

      {/* Assign Admin Modal */}
      {showAssign && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 bg-opacity-30">
          <div className="bg-white w-[90%] rounded-xl shadow-lg p-6 max-w-md relative animate-fadeIn">
            <button
              className="absolute cursor-pointer flex items-center gap-1 text-(--purple-500) left-4 top-4 text-purple font-semibold"
              onClick={() => setShowAssign(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2298_41842)">
                  <path
                    d="M16.6668 9.16683H6.52516L11.1835 4.5085L10.0002 3.3335L3.3335 10.0002L10.0002 16.6668L11.1752 15.4918L6.52516 10.8335H16.6668V9.16683Z"
                    fill="#6F3DCB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2298_41842">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </button>
            <h3 className="text-[24px] font-bold pt-8 mb-4">Assign Admin</h3>
            {/* <Formik
              validationSchema={yup.object().shape({
                assigned_to: yup.string().required("No admin selected")
              })}

              initialValues={{
                assigned_to: ''
              }}
            > */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Choose Admin
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
                  <option value={''} selected>
                    Select Admin
                  </option>

                  {
                    admins?.length > 0
                    ?
                      admins.map((a, i) => {
                        const { role, username, id } = a

                        return(
                          <option
                            key={i}
                            value={id}
                          >
                            { username } ~ { role }
                          </option>
                        )
                      })
                    : 
                      <div>
                        Loading admins...
                      </div>
                  }
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                  onClick={() => setShowAssign(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAssign(false)}
                  className="flex-1 cursor-pointer py-2 rounded-lg bg-purple-500 text-white font-medium"
                >
                  Assign
                </button>
              </div>
            {/* </Formik> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTickets;
