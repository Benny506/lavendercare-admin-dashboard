import React, { useEffect, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuRotateCw } from "react-icons/lu";
import PathHeader from "../components/PathHeader";
import ZeroItems from "../components/ZeroItems";
import ProfileImg from "../components/ProfileImg";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import { getPublicImageUrl } from "../../../lib/requestApi";
import useApiReqs from "../../../hooks/useApiReqs";
import { getAdminState } from "../../../redux/slices/adminState";
import { subtleLoadStart, subtleLoadStop } from "../../../redux/slices/subtleLoaderSlice";
import CommunityDrawer from "./CommunityDrawer";
import { useAdminCommunityChat } from "../../../contexts/AdminCommunityChatContext";

function Communities() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiReqs = useApiReqs();
  const { getCommunityUnreadCount, refreshUnreadCounts } = useAdminCommunityChat();

  const communities = useSelector(state => getAdminState(state).communities);

  const [view, setView] = useState("list");
  const [showDelete, setShowDelete] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [memberRequests, setMemberRequests] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageListIndex, setPageListIndex] = useState(0);

  const handleRefresh = async () => {
    try {
      dispatch(subtleLoadStart("Refreshing communities..."));
      await Promise.all([
        apiReqs.fetchCommunities({}),
        refreshUnreadCounts()
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(subtleLoadStop());
    }
  };

  useEffect(() => {
    apiReqs.fetchCommunities({});
  }, []);

  const handleDelete = (community, e) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    apiReqs.deleteCommunity({
      community_id: selectedCommunity.id,
      callBack: () => {
        setShowDelete(false);
        setShowDrawer(false);
      }
    });
  };

  const handleDrawer = (community, e) => {
    e?.stopPropagation();
    setSelectedCommunity(community);
    setShowDrawer(true);
    setMemberRequests([]); // Clear previous requests
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setMemberRequests([]);
  };

  const getMemberRequests = () => {
    apiReqs.fetchCommunityRequests({
      community_id: selectedCommunity.id,
      callBack: ({ requests }) => setMemberRequests(requests)
    });
  };

  const handleRequest = ({ user_id, notification_token, type }) => {
    apiReqs.handleCommunityRequest({
      community: selectedCommunity,
      user_id,
      notification_token,
      type,
      callBack: () => {
        // The hook updates the global communities state, 
        // we just need to update local memberRequests if needed
        setMemberRequests(prev => prev.filter(r => r.user_id !== user_id));
      }
    });
  };

  const filtered = communities?.filter(c => {
    const name = c.name?.toLowerCase() || "";
    const filter = searchFilter.toLowerCase();
    return name.includes(filter);
  });

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filtered,
    maxShow: 7,
    index: currentPage,
    maxPage: 5,
    pageListIndex
  });

  const incrementPageListIndex = () => {
    if (pageListIndex === totalPageListIndex) setPageListIndex(0);
    else setPageListIndex(prev => prev + 1);
  };

  const decrementPageListIndex = () => {
    if (pageListIndex === 0) setPageListIndex(totalPageListIndex);
    else setPageListIndex(prev => prev - 1);
  };

  return (
    <div className="pt-6 w-full min-h-screen">
      <PathHeader
        paths={[
          { text: "Communities" },
          { text: "All communities" },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Communities</h2>
        <button
          className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium hover:bg-opacity-90 transition-all"
          onClick={() => navigate("/admin/communities/create")}
        >
          + New Community
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Search communities..."
          className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2 items-center">
          <button
            onClick={handleRefresh}
            className="p-2 rounded cursor-pointer transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            title="Refresh"
          >
            <LuRotateCw />
          </button>
          <button
            className={`p-2 rounded cursor-pointer transition-colors ${view === "list" ? "bg-(--primary-500) text-white" : "bg-white text-gray-700 border border-gray-200"
              }`}
            onClick={() => setView("list")}
          >
            <FiList />
          </button>
          <button
            className={`p-2 rounded cursor-pointer transition-colors ${view === "grid" ? "bg-(--primary-500) text-white" : "bg-white text-gray-700 border border-gray-200"
              }`}
            onClick={() => setView("grid")}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Visibility</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-center">Unread</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Requests</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pageItems?.length > 0 ? (
                pageItems.map((community, idx) => {
                  const profile_img = community?.profile_img
                    ? getPublicImageUrl({ path: community.profile_img, bucket_name: "user_profiles" })
                    : null;

                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProfileImg profile_img={profile_img} name={community.name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{community.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${community.visibility === "public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                            }`}
                        >
                          {community.visibility}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getCommunityUnreadCount(community.id) > 0 ? (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            {getCommunityUnreadCount(community.id)} New
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{community.members?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{community.requests?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            className="text-primary hover:text-primary-dark transition-colors cursor-pointer"
                            onClick={(e) => handleDrawer(community, e)}
                            title="View Details"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate("/admin/communities/chat", { state: { community } })}
                            className="bg-primary text-black text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                          >
                            Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <ZeroItems zeroText="No communities found matching your search." />
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.length > 0 ? (
            filtered.map((community, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{community.name}</h3>
                      {getCommunityUnreadCount(community.id) > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {getCommunityUnreadCount(community.id)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{community.description || community.about}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${community.visibility === "public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {community.visibility}
                  </span>
                </div>

                <div className="flex gap-4 border-y border-gray-50 py-3">
                  <div className="flex-1 text-center">
                    <p className="text-sm font-bold text-gray-800">{community.members?.length || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Members</p>
                  </div>
                  <div className="flex-1 text-center border-l border-gray-50">
                    <p className="text-sm font-bold text-gray-800">{community.requests?.length || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Requests</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-lg border border-primary text-primary text-xs font-bold uppercase hover:bg-primary hover:text-white transition-all cursor-pointer"
                    onClick={(e) => handleDrawer(community, e)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate("/admin/communities/chat", { state: { community } })}
                    className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12">
              <ZeroItems zeroText="No communities found." />
            </div>
          )}
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm transform animate-scaleUp">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Community?</h3>
            <p className="text-sm text-gray-500 text-center mb-8">
              Are you sure you want to delete <strong>{selectedCommunity?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <CommunityDrawer
        show={showDrawer}
        community={selectedCommunity}
        onClose={handleCloseDrawer}
        onEdit={(c) => navigate("/admin/communities/create", { state: { community: c } })}
        onDelete={handleDelete}
        onViewRequests={getMemberRequests}
        memberRequests={memberRequests}
        onAcceptRequest={(info) => handleRequest({ ...info, type: "accept" })}
        onRejectRequest={(info) => handleRequest({ ...info, type: "reject" })}
        onViewProfile={(profile) => navigate("/admin/mothers/single-mother", { state: { user: profile } })}
      />
    </div>
  );
}

export default Communities;
