import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { getAdminState, setAdminState } from "../../../redux/slices/adminState";
import { isoToDateTime } from "../../../lib/utils";
import ZeroItems from "../components/ZeroItems";
import { Select } from "../components/ui/Select";
import { userTypes } from "../../../lib/utils_Jsx";
import { onRequestApi } from "../../../lib/requestApi";
import Pagination from "../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import Modal from "../components/ui/Modal";
import PathHeader from "../components/PathHeader";
import useApiReqs from "../../../hooks/useApiReqs";


function UserManagement() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { loadMoreUsers } = useApiReqs() 

  const mothers = useSelector(state => getAdminState(state).mothers)
  const providers = useSelector(state => getAdminState(state).providers)
  const vendors = useSelector(state => getAdminState(state).vendors)

  const [users, setUsers] = useState([]);
  const [usertypeFilter, setUsertypeFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: { type: null, err: null } })  
  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)  
  const [canLoadMore, setCanLoadMore] = useState(true)

  useEffect(() => {
    const _u = [...mothers, ...providers, ...vendors]
    setUsers(_u)
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop())

    if(isLoading && data){
      const { type, requestInfo } = data

      if(type === 'loadMoreUsers'){
        loadMoreUsers({
          callBack: ({ canLoadMore }) => setCanLoadMore(canLoadMore)
        })
      }

      if(type === 'deleteUser'){
        onRequestApi({
          requestInfo,
          successCallBack: deleteUserSuccess,
          failureCallback: deleteUserFailure
        })
      }

      if(type === 'suspendUser'){
        onRequestApi({
          requestInfo,
          successCallBack: suspendUserSuccess,
          failureCallback: suspendUserFailure
        })
      }
    }
  }, [apiReqs])

  const deleteUserSuccess = ({ requestInfo }) => {
    try {

      const { role, user_id: id } = requestInfo?.data

      const existingGroupedUsers = role === 'mother' ? mothers : role === 'vendor' ? vendors : role === 'provider' ? providers : null
      const adminStateKey = role === 'mother' ? 'mothers' : role === 'vendor' ? 'vendors' : role === 'provider' ? 'providers' : null

      if(!existingGroupedUsers || !adminStateKey) throw new Error();

      setUsers(prev => prev?.filter(u => u?.id !== id))

      dispatch(setAdminState({
        [adminStateKey]: existingGroupedUsers.filter(u => u?.id !== id)
      }))

      setApiReqs({ isLoading: false, data: null, errorMsg: null })
      
      toast.success("User deleted")

      closeModal()

      return;
      
    } catch (error) {
      console.log(error)
      return deleteUserFailure({ errorMsg: 'Something went wrong! Try again' })
    }
  }
  const deleteUserFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, data: null, errorMsg })
    toast.error(errorMsg)

    return;
  }

  const suspendUserSuccess = async ({ requestInfo }) => {
    try {

      const { tableName, role, id, suspended, idColumnName } = requestInfo?.data

      const existingGroupedUsers = role === 'mother' ? mothers : role === 'vendor' ? vendors : role === 'provider' ? providers : null
      const adminStateKey = role === 'mother' ? 'mothers' : role === 'vendor' ? 'vendors' : role === 'provider' ? 'providers' : null      

      if(!existingGroupedUsers || !adminStateKey) throw new Error();

      setUsers(prev => prev?.map(u => {
        if(u?.id === id){
          return {
            ...u,
            suspended: !suspended
          }
        }

        return u
      }))

      dispatch(setAdminState({
        [adminStateKey]: existingGroupedUsers.filter(u => {
          if(u?.id === id){
            return {
              ...u,
              suspended: !suspended
            }
          }

          return u
        })
      }))

      setApiReqs({ isLoading: false, data: null, errorMsg: null })
      
      toast.success("Suspension status updated")

      closeModal()      
      
    } catch (error) {
      console.log(error)
      return suspendUserFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const suspendUserFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, data: null, errorMsg })
    toast.error(errorMsg)

    return;
  }

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuspend = (user) => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'suspendUser',
        requestInfo: {
          url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/suspend-user',
          method: 'POST',
          data: {
            tableName: user?.role === 'mother' ? 'user_profiles' : user?.role === 'provider' ? 'provider_profiles' : user?.role === 'vendor' ? 'vendor_profiles' : '',
            role: user?.role,
            id: user?.id,
            suspended: user?.suspended,
            idColumnName: user?.role === 'provider' ? 'provider_id' : 'id'
          }
        }
      }
    })
    
    return
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => {
      const name = user?.name || user?.business_name || user?.provider_name || ''

      const email = user?.email || ''

      const matchesUsertypeFilter = !usertypeFilter ? true : usertypeFilter?.toLowerCase() == 'all' ? true : usertypeFilter?.toLowerCase() === user?.role?.toLowerCase()

      const matchesFilter =
        name.toLowerCase().includes(searchTerm.toLowerCase()) 
        ||
        searchTerm.toLowerCase().includes(name.toLowerCase()) 
        ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) 
        ||
        searchTerm.toLowerCase().includes(email.toLowerCase())         

      return matchesFilter && matchesUsertypeFilter
    }
  );

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
      arr: filteredUsers,
      maxShow: 4,
      index: currentPage,
      maxPage: 5,
      pageListIndex
  });  

  const incrementPageListIndex = () => {
    alert(totalPageListIndex)
    alert(pageListIndex)
    if(pageListIndex === totalPageListIndex){
        setPageListIndex(0)
      
    } else{
        setPageListIndex(prev => prev+1)
    }

    return
  }

  const decrementPageListIndex = () => {
      if(pageListIndex == 0){
          setPageListIndex(totalPageListIndex)
      
      } else{
          setPageListIndex(prev => prev-1)
      }

      return
  }  

  const handleDelete = (user) => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'deleteUser',
        requestInfo: {
          url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/delete-user',
          method: 'POST',
          data: {
            user_id: user?.id, role: user?.role 
          }
        }
      }
    })

    return
  };

  const handleViewProfile = () => {
    if(!selectedUser) return <></>

    navigate(
      selectedUser?.role === 'mother'
      ? 
        '/admin/mothers/single-mother'
      :
      selectedUser?.role === 'provider'
      ?
        '/admin/healthcare-provider/single-provider'
      :
      selectedUser?.role === 'vendor'
      ?
        '/admin/service-provider/single-vendor'      
      :
      ''
      , 
      { state: { user: selectedUser } }
    )
  }

  return (
    <div className="pt-6 w-full pb-5">
      {/* breadcrumb  */}
      <PathHeader 
        paths={[
          { type: 'text', text: 'User Management' },
          { type: 'text', text: 'All Users' },
        ]}
      />

      <div className="flex items-center justify-between pb-5">
        <h2 className="text-[24px] font-semibold">All users</h2>

        {/* invite user button */}
        <Link to="/admin/user-management/invite-user" className="py-2 px-6 bg-(--primary-500) text-white rounded-full">
          Invite user
        </Link>
      </div>

      {/* user management container  */}
      <div className="bg-white px-[14px] md:px-[24px] pt-[20px] pb-[20px] rounded-[16px]">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-[24px] font-[800]">All users</h2>
            <p className="text-sm text-(--gray-500) pb-4 md:pb-0">
              See all your User below
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <svg
                className="absolute top-[12px] left-[14px]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1918_29784)">
                  <path
                    d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
                    fill="#020201"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1918_29784">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <input
                type="text"
                placeholder="Search users..."
                className="border py-[10px] h-[44px] focus:border-black md:w-[320px] w-full focus:outline-1 pr-[14px] pl-[40px] border-gray-300 rounded-sm text-(--gray-500)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* filter option button */}
            {/* <div className="py-[10px] rounded-sm px-[14px] border-gray-300 border w-max flex items-center gap-1">
              <span className="hidden md:block">Filter by:</span>
              All{""}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1918_29796)">
                  <path
                    d="M13.825 7.1582L10 10.9749L6.175 7.1582L5 8.3332L10 13.3332L15 8.3332L13.825 7.1582Z"
                    fill="#020201"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1918_29796">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div> */}

            <Select
              placeholder="Select usertype"
              options={[{ value: 'all', label: 'All' }, ...userTypes.map(u => {
                return {
                  value: u,
                  label: u
                }
              })]}
              value={usertypeFilter}
              onChange={setUsertypeFilter}
              searchable
              clearable
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 "
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 "
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 "
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 "
                >
                  Last Login
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 "
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.length > 0 ? (
                pageItems.map((user) => {
                  const name = user?.name || user?.business_name || user?.provider_name

                  const lastLogin = user?.last_sign_in_at ? isoToDateTime({ isoString: user?.last_sign_in_at }) : 'Null'

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 hover:cursor-pointer"
                      onClick={() => openUserModal(user)}
                    >
                      <td className=" py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <button className="text-sm font-medium text-gray-900 hover:text-primary-500">
                              { name }
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 w-[320px] whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 rounded-full">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex items-center text-center text-xs leading-5 font-[500] rounded-full ${
                            user?.suspended
                              ? "bg-(--success) text-(--success_text)"
                              : "bg-(--error) text-red-800"
                          }`}
                        >
                          { user?.suspended ? 'Suspended' : 'Active' }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* {new Date(user.lastLogin).toLocaleDateString()} */}
                        { lastLogin }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openUserModal(user)}
                          className="fill-indigo-600 hover:fill-indigo-900 mr-4 hover:cursor-pointer"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.0514 3.73889L15.4576 2.33265C16.0678 1.72245 17.0572 1.72245 17.6674 2.33265C18.2775 2.94284 18.2775 3.93216 17.6674 4.54235L8.81849 13.3912C8.37792 13.8318 7.83453 14.1556 7.23741 14.3335L5 15L5.66648 12.7626C5.84435 12.1655 6.1682 11.6221 6.60877 11.1815L14.0514 3.73889ZM14.0514 3.73889L16.25 5.93749M15 11.6667V15.625C15 16.6605 14.1605 17.5 13.125 17.5H4.375C3.33947 17.5 2.5 16.6605 2.5 15.625V6.87499C2.5 5.83946 3.33947 4.99999 4.375 4.99999H8.33333"
                              stroke="#6F3DCB"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>

                        {/* <button
                          onClick={() => handleDelete(user)}
                          className="fill-red-600 fill:text-red-900 hover:cursor-pointer"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                              stroke="#E41C11"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button> */}
                      </td>
                    </tr>
                )})
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <ZeroItems 
                      zeroText={'No users found'}
                    />
                  </td>
                </tr>
              )}
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
        </div>

        {
          canLoadMore
          &&
            <div className="w-full flex items-center justify-center my-5">
                <button
                    onClick={() => {
                        setApiReqs({
                            isLoading: true,
                            errorMsg: null,
                            data: {
                                type: 'loadMoreUsers'
                            }
                        })
                    }}
                    className={'bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer'}
                >
                    Load more
                </button>
            </div>            
        }      
      </div>

      {/* User Details Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen && selectedUser ? true : false}
          onClose={closeModal}
        >
          <>
            <p
              className="text-sm text-(--primary-500) z-10 font-medium leading-6 hover:cursor-pointer flex gap-2 items-center"
              onClick={closeModal}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1918_40368)">
                  <path
                    d="M16.6668 9.16732H6.52516L11.1835 4.50898L10.0002 3.33398L3.3335 10.0007L10.0002 16.6673L11.1752 15.4923L6.52516 10.834H16.6668V9.16732Z"
                    fill="#6F3DCB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1918_40368">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center mb-4">
                  <div className="h-[50px] w-[50px] rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                    {(selectedUser.name || selectedUser?.provider_name || selectedUser?.business_name).charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">
                      {selectedUser?.name || selectedUser?.business_name || selectedUser?.provider_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedUser.role}
                    </p>
                  </div>
                </div>

                <div className="text-sm">{selectedUser?.suspended ? 'Suspended' : 'Active'}</div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="text-sm font-medium">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500">
                    Phone Number:
                  </span>
                  <span>{selectedUser.phone_number || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Last Login:
                  </span>
                  <span className="text-sm">
                    {selectedUser.last_sign_in_at ? isoToDateTime({ isoString: selectedUser.last_sign_in_at }) : 'Null'}
                  </span>
                </div>

                {/* Role-specific information */}
                {selectedUser.role === "admin" && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800">
                      Admin Privileges
                    </h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Full system access and user management
                      permissions.
                    </p>
                  </div>
                )}

                {selectedUser.role === "mother" && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800">
                      Mother's Profile
                    </h5>
                    <p className="text-sm text-purple-700 mt-1">
                      Access to maternal health resources and
                      appointment scheduling.
                    </p>
                  </div>
                )}

                {selectedUser.role === "provider" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800">
                      Healthcare Provider
                    </h5>
                    <p className="text-sm text-green-700 mt-1">
                      Access to patient records and appointment
                      management.
                    </p>
                  </div>
                )}

                {selectedUser.role === "vendor" && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800">
                      Vendor service Provider
                    </h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      Access to patient service bookings and appointment
                      management.
                    </p>
                  </div>
                )}                
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 justify-center items-center space-x-3">
              <button
                type="button"
                className="cursor-pointer inline-flex justify-center border border-transparent bg-(--primary-500) px-10 rounded-full py-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
              <button
                type="button"
                className={`cursor-pointer inline-flex justify-center rounded-full border border-transparent px-10 py-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  selectedUser?.suspended
                    ? "bg-green-100 text-green-900 hover:bg-green-200 focus-visible:ring-green-500"
                    : "bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500"
                }`}
                onClick={() => handleSuspend(selectedUser)}
              >
                {selectedUser?.suspended
                  ? "Activate User"
                  : "Suspend User"}
              </button>
            </div>
          </>
        </Modal>
      )}
    </div>
  );
}

export default UserManagement;
