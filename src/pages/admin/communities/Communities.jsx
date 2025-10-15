import React, { useEffect, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import PathHeader from "../components/PathHeader";
import ZeroItems from "../components/ZeroItems";
import supabase from "../../../database/dbInit";
import ProfileImg from "../components/ProfileImg";
import { sendNotifications } from "../../../lib/notifications";

function Communities() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [view, setView] = useState("list");
  const [showDelete, setShowDelete] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communities, setCommunities] = useState([])
  const [memberRequests, setMemberRequests] = useState([])
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'fetchCommunities'
      }
    })
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'fetchCommunities') {
        fetchCommunities()
      }

      if (type === 'fetchMemberRequests') {
        fetchMemberRequests()
      }

      if (type === 'handleRequestResponse') {
        handleRequestResponse({ requestInfo })
      }

      if (type === 'deleteCommunity') {
        deleteCommunity()
      }
    }
  }, [apiReqs])

  const deleteCommunity = async () => {
    try {

      if (!selectedCommunity) throw new Error()

      const { error } = await supabase.from('community')
        .delete()
        .eq("id", selectedCommunity?.id)

      if (error) {
        console.warn(error)
        throw new Error()
      }

      const updatedCommunities = communities?.filter(c => c?.id !== selectedCommunity?.id)

      setCommunities(updatedCommunities)
      setApiReqs({ isLoading: false, errorMsg: null, data: null })
      setShowDrawer(false)
      setMemberRequests([])

    } catch (error) {
      console.warn(error)
      return deleteCommunityFailure({ errorMsg: 'Something went wrong! Try again' })
    }
  }
  const deleteCommunityFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const handleRequestResponse = async ({ requestInfo }) => {
    try {

      const { type, user_id, notification_token } = requestInfo

      if (!type || !selectedCommunity || !user_id) throw new Error();

      if (type === 'accept') {
        const { data, error } = await supabase
          .from('community_members')
          .insert({
            user_id,
            role: 'member',
            community_id: selectedCommunity?.id
          })

        if (error) {
          console.warn(error)
          throw new Error()
        }
      }

      const { data, error } = await supabase
        .from("community_requests")
        .delete()
        .eq("community_id", selectedCommunity?.id)
        .eq("user_id", user_id)

      if (error) {
        console.warn(error)
        throw new Error()
      }

      const updatedCommunities = communities.map(c => {
        if (c?.id === selectedCommunity?.id) {

          const updatedMembers = type === 'accept' ? [...c?.members, user_id] : c?.members

          return {
            ...c,
            members: updatedMembers,
            requests: (c?.requests || []).filter(r => r?.user_id != user_id)
          }
        }

        return c
      })

      await sendNotifications({
        tokens: [notification_token],
        title: 'Community response',
        body: type === 'accept' ? `Your request to join ${selectedCommunity?.name} was accepted! Welcome` : `Your request to join ${selectedCommunity?.name} was rejected!`,
        data: {}
      })

      toast.success(`Request ${type}ed`)

      setCommunities(updatedCommunities)
      setShowDrawer(false)
      setMemberRequests([])
      setApiReqs({ isLoading: false, errorMsg: null, data: null })

    } catch (error) {
      console.warn(error)
      handleRequestResponseFailure({ errorMsg: 'Something went wrong! Try again!' })
    }
  }
  const handleRequestResponseFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const fetchMemberRequests = async () => {
    try {

      const { data, error } = await supabase
        .from('community_requests')
        .select(`
          *,
          user_profile: user_profiles ( * )  
        `)

      if (!data || error) {
        console.log(error)
        throw new Error()
      }

      setMemberRequests(data)

      if (data.length === 0) {
        toast.info("No new requests")
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      return;

    } catch (error) {
      console.log(error)
      fetchMemberRequestsFailure({ errorMsg: 'Error retrieving member requests' })
    }
  }
  const fetchMemberRequestsFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return
  }

  const fetchCommunities = async () => {
    try {

      const { data, error } = await supabase
        .from('community')
        .select(`
          *,
          members: community_members ( user_id ),
          requests: community_requests ( user_id )
        `)

      if (!data || error) {
        console.log(error)
        throw new Error()
      }

      setCommunities(data)

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      return;

    } catch (error) {
      console.log(error)
      fetchCommunitiesFailure({ errorMsg: 'Error fetching communities' })
    }
  }
  const fetchCommunitiesFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, data: null, errorMsg })
    toast.error(errorMsg)

    return;
  }

  const getMemberRequests = () => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'fetchMemberRequests'
      }
    })
  }

  const handleAcceptRequest = ({ user_id, notification_token }) => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'handleRequestResponse',
        requestInfo: { type: 'accept', user_id, notification_token }
      }
    })
  }

  const handleRejectRequest = ({ user_id, notification_token }) => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'handleRequestResponse',
        requestInfo: { type: 'reject', user_id, notification_token }
      }
    })
  }

  const initiateDelete = () => {
    setShowDelete(false)
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'deleteCommunity'
      }
    })
  }

  const handleDelete = (community, e) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setShowDelete(true);
  };

  const handleDrawer = (community, e) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setShowDrawer(true);
  };
  const handleCloseDrawer = () => setShowDrawer(false);

  const filtered = communities?.filter(c => {
    const { name } = c

    const matchSearch =
      name?.toLowerCase().includes(searchFilter?.toLowerCase())
      ||
      searchFilter?.toLowerCase().includes(name?.toLowerCase())

    const matchesSearch = searchFilter ? matchSearch : true

    return matchesSearch;
  })

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumb */}
      <PathHeader
        paths={[
          { text: 'Communities' },
          { text: 'All communities' },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Communities</h2>
        <button
          className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium"
          onClick={() => navigate("/admin/communities/create")}
        >
          + New Community
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e?.target?.value)}
          placeholder="Search communities..."
          className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2 items-center">
          {/* <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
            <option>Visibility: All</option>
            <option>public</option>
            <option>Private</option>
          </select> */}
          {/* <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
            <option>Sort: Activity</option>
            <option>Sort: Members</option>
          </select> */}
          <button
            className={`p-2 rounded cursor-pointer ${view === "list"
              ? "bg-(--primary-500) text-white"
              : "bg-white text-gray-700 border border-gray-200"
              }`}
            onClick={() => setView("list")}
          >
            <FiList />
          </button>
          <button
            className={`p-2 rounded cursor-pointer ${view === "grid"
              ? "bg-(--primary-500) text-white"
              : "bg-white text-gray-700 border border-gray-200"
              }`}
            onClick={() => setView("grid")}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Community Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Visibility
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Members
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Requests
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {
                filtered?.length > 0
                  ?
                  filtered.map((community, idx) => (
                    <tr key={idx}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {community.name}
                        <div className="text-xs text-gray-400">
                          {community.about}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${community.visibility === "public"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                            }`}
                        >
                          {community.visibility}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {community.members?.length}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {community.requests?.length}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                        <button
                          className="text-primary cursor-pointer"
                          onClick={(e) => handleDrawer(community, e)}
                        >
                          <svg
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1976_86059)">
                              <path
                                d="M6.06218 12.2322C6.00662 12.0826 6.00662 11.9179 6.06218 11.7682C6.60331 10.4561 7.52185 9.33427 8.70136 8.54484C9.88086 7.75541 11.2682 7.33398 12.6875 7.33398C14.1068 7.33398 15.4942 7.75541 16.6737 8.54484C17.8532 9.33427 18.7717 10.4561 19.3128 11.7682C19.3684 11.9179 19.3684 12.0826 19.3128 12.2322C18.7717 13.5443 17.8532 14.6662 16.6737 15.4556C15.4942 16.2451 14.1068 16.6665 12.6875 16.6665C11.2682 16.6665 9.88086 16.2451 8.70136 15.4556C7.52185 14.6662 6.60331 13.5443 6.06218 12.2322Z"
                                stroke="#6F3DCB"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M12.6875 14C13.7921 14 14.6875 13.1046 14.6875 12C14.6875 10.8954 13.7921 10 12.6875 10C11.5829 10 10.6875 10.8954 10.6875 12C10.6875 13.1046 11.5829 14 12.6875 14Z"
                                stroke="#6F3DCB"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1976_86059">
                                <rect
                                  width="16"
                                  height="16"
                                  fill="white"
                                  transform="translate(4.6875 4)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        <button 
                          onClick={() => navigate('/admin/communities/chat', { state: { community } })}
                          className="cursor-pointer text-white border bg-[#703dcb] rounded px-3 py-1 text-xs"
                        >
                          Enter chat
                        </button>
                        {/* <button
                          className="text-red-500"
                          onClick={(e) => handleDelete(community, e)}
                        >
                          <svg
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.6875 8H18.6875"
                              stroke="#E41C11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M17.3543 8V17.3333C17.3543 18 16.6877 18.6667 16.021 18.6667H9.35433C8.68766 18.6667 8.021 18 8.021 17.3333V8"
                              stroke="#E41C11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.021 7.99967V6.66634C10.021 5.99967 10.6877 5.33301 11.3543 5.33301H14.021C14.6877 5.33301 15.3543 5.99967 15.3543 6.66634V7.99967"
                              stroke="#E41C11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M11.354 11.333V15.333"
                              stroke="#E41C11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M14.021 11.333V15.333"
                              stroke="#E41C11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button> */}
                      </td>
                    </tr>
                  ))
                  :
                  <tr className="">
                    <td colSpan={'6'} className="py-5">
                      <ZeroItems
                        zeroText={'No communities found'}
                      />
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {
            filtered?.length > 0
              ?
              filtered.map((community, idx) => {

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex flex-col justify-between mb-2">
                      <span className="font-bold text-sm">{community.name}</span>
                      <span className="text-xs text-gray-400">
                        {community.about}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${community.visibility === "public"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                          }`}
                      >
                        {community.visibility}
                      </span>

                      <div className="text-xs mb-1">{community.members?.length} members</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600`}
                      >
                        Requests to join
                      </span>

                      <div className="text-xs mb-1">{community.requests?.length}</div>
                    </div>

                    <div className="text-xs text-gray-400 mb-2"></div>
                    {/* <div className="text-xs text-gray-300 flex flex-col mb-1">
                  Moderators:{" "}
                  <span className="text-sm text-black">
                    {community.moderators.join(", ")}
                  </span>
                </div> */}
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-primary border border-primary rounded px-3 py-1 text-xs"
                        onClick={(e) => handleDrawer(community, e)}
                      >
                        View
                      </button>
                      <button className="text-gray-500 border border-gray-300 rounded px-3 py-1 text-xs">
                        Edit
                      </button>
                      <button 
                        onClick={() => navigate('/admin/communities/chat', { state: { community } })}
                        className="cursor-pointer text-white border bg-[#703dcb] rounded px-3 py-1 text-xs"
                      >
                        Enter chat
                      </button>
                      {/* <button
                        className="text-red-500 border border-red-300 rounded px-3 py-1 text-xs"
                        onClick={(e) => handleDelete(community, e)}
                      >
                        Delete
                      </button> */}
                    </div>
                  </div>
                )
              })
              :
              <ZeroItems
                zeroText={'No communities found'}
              />
          }
        </div>
      )}

      {/* Pagination */}
      {/* <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 gap-2 mt-2">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
          Showing 1 to 5 of 12 communities
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm bg-(--primary-500) text-white text-xs sm:text-sm">
            1
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm text-gray-500 text-xs sm:text-sm">
            2
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm text-gray-500 text-xs sm:text-sm">
            3
          </button>
        </div>
      </div> */}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <h3 className="text-lg font-bold mb-2">Delete community?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action is irreversible. All community content will be
              permanently removed.
            </p>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                className="py-2 px-4 rounded-lg cursor-pointer bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button onClick={initiateDelete} className="py-2 px-4 rounded-lg cursor-pointer bg-red-500 text-white font-medium text-xs sm:text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer for Community Details */}
      {showDrawer && selectedCommunity && (
        <div
          className="fixed inset-0 z-[4000] flex items-end justify-end bg-black/80 bg-opacity-30"
        >
          <div className="w-full max-w-md bg-white h-screen shadow-lg p-6 relative animate-fadeIn">
            {/* modal title */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Community Details</h2>
              <button
                className=" text-gray-400 cursor-pointer text-2xl"
                onClick={handleCloseDrawer}
              >
                ×
              </button>
            </div>

            <h3 className="text-lg font-medium mb-1">
              {selectedCommunity.name}
            </h3>
            <div className="text-xs text-gray-400 mb-8">
              {selectedCommunity.description}
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm">Visibility:</p>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCommunity.visibility === "public"
                    ? "bg-green-100 text-green-600"
                    : "bg-purple-100 text-purple-600"
                    }`}
                >
                  {selectedCommunity.visibility}
                </span>
              </div>
            </div>
            <div className="mb-2 flex justify-between items-center text-xs">
              <span className="text-sm">Members:</span>
              {selectedCommunity.members?.length}
            </div>

            <div className="mb-2 flex justify-between items-center text-xs">
              <span className="text-sm">Requests:</span>
              {selectedCommunity.requests?.length}
            </div>

            {/* <div className="mt-8 text-sm">
              Moderators:
              <div className="pb-4">
                {selectedCommunity.moderators.join(", ")}{" "}
              </div>
              <span className="mt-4 text-(--primary-500) ml-2 cursor-pointer">
                + Add Moderator
              </span>
            </div> */}
            <div className="flex flex-col gap-2 mt-6">
              {
                selectedCommunity?.requests?.length > 0
                &&
                <button onClick={getMemberRequests} className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm">
                  View requests
                </button>
              }
              <button onClick={() => navigate("/admin/communities/create", { state: { community: selectedCommunity } })} className="py-2 px-4 rounded-lg text-(--primary-500) border-1 rounded-sm border-(--primary-500) font-medium text-xs sm:text-sm">
                Edit
              </button>
              <button onClick={initiateDelete} className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium text-xs sm:text-sm">
                Delete
              </button>
            </div>

            {
              memberRequests?.length > 0
              &&
              <div className="mt-5">
                <h5 className="m-0 p-0 font-bold text-black mb-3">
                  New requests
                </h5>

                {
                  memberRequests.map((mr, i) => {
                    const { user_profile } = mr

                    if (!user_profile) return;

                    const { name, profile_img, id, notification_token } = user_profile

                    const user_id = id

                    return (
                      <div
                        key={i}
                        className="flex flex-wrap gap-2 justify-between"
                      >
                        <div
                          className="flex items-center gap-2"
                        >
                          <ProfileImg
                            profile_img={profile_img}
                            name={name}
                          />

                          <p className="m-0 p-0 text-gray-800">
                            {name}
                          </p>
                        </div>

                        <div className="flex items-center justify-center flex-wrap gap-1">
                          <button onClick={() => handleAcceptRequest({ user_id, notification_token })} className="px-3 py-1 bg-purple-600 rounded-lg text-white text-xs cursor-pointer">
                            Approve
                          </button>

                          <button onClick={() => handleRejectRequest({ user_id, notification_token })} className="px-3 py-1 bg-red-600 rounded-lg text-white text-xs cursor-pointer">
                            Reject
                          </button>

                          <button onClick={() => navigate('/admin/mothers/single-mother', { state: { user: user_profile } })} className="px-3 py-1 bg-gray-600 rounded-lg text-white text-xs cursor-pointer">
                            View profile
                          </button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;
