import React from "react";
import ProfileImg from "../components/ProfileImg";
import { getPublicImageUrl } from "../../../lib/requestApi";

const CommunityDrawer = ({
  show,
  community,
  onClose,
  onEdit,
  onDelete,
  onViewRequests,
  memberRequests,
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
}) => {
  if (!show || !community) return null;

  return (
    <div className="fixed inset-0 z-[4000] flex items-end justify-end bg-black/80 bg-opacity-30">
      <div className="w-full max-w-md bg-white h-screen shadow-lg p-6 relative animate-fadeIn overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Community Details</h2>
          <button
            className="text-gray-400 cursor-pointer text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-medium mb-1">{community.name}</h3>
        <div className="text-xs text-gray-400 mb-8">{community.description}</div>

        <div className="mb-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm">Visibility:</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${community.visibility === "public"
                  ? "bg-green-100 text-green-600"
                  : "bg-purple-100 text-purple-600"
                }`}
            >
              {community.visibility}
            </span>
          </div>
        </div>

        <div className="mb-2 flex justify-between items-center text-xs">
          <span className="text-sm">Members:</span>
          {community.members?.length}
        </div>

        <div className="mb-2 flex justify-between items-center text-xs">
          <span className="text-sm">Requests:</span>
          {community.requests?.length}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-6">
          {community?.requests?.length > 0 && (
            <button
              onClick={onViewRequests}
              className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm cursor-pointer"
            >
              View requests
            </button>
          )}
          <button
            onClick={() => onEdit(community)}
            className="py-2 px-4 rounded-lg text-(--primary-500) border-1 border-(--primary-500) font-medium text-xs sm:text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(community)}
            className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium text-xs sm:text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>

        {/* Member Requests List */}
        {memberRequests?.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h5 className="m-0 p-0 font-bold text-black mb-4">New requests</h5>
            <div className="flex flex-col gap-4">
              {memberRequests.map((mr, i) => {
                const { user_profile } = mr;
                if (!user_profile) return null;

                const { name, profile_img, id, notification_token } = user_profile;

                return (
                  <div key={i} className="flex flex-col gap-3 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <ProfileImg profile_img={getPublicImageUrl({ path: profile_img, bucket_name: 'user_profiles' })} name={name} />
                      <p className="m-0 p-0 font-medium text-gray-800">{name}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onAcceptRequest({ user_id: id, notification_token })}
                        className="flex-1 py-1.5 bg-purple-600 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-purple-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectRequest({ user_id: id, notification_token })}
                        className="flex-1 py-1.5 bg-red-600 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onViewProfile(user_profile)}
                        className="flex-1 py-1.5 bg-gray-600 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDrawer;
