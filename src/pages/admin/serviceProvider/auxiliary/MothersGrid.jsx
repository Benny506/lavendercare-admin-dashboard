import { FiArrowRight } from "react-icons/fi";
import { getPublicImageUrl } from "../../../../lib/requestApi";
import ProfileImg from "../../components/ProfileImg";
import Card from "../../components/ui/Card";
import { IoWoman } from "react-icons/io5";

export default function MothersGrid({ mothers = [], onSelect }) {
    return (
        <Card
            title={"Assigned Mothers"}
            subtitle={"Mothers assigned to this provider by admin"}
            icon={IoWoman}
        >
            {
                mothers?.length > 0
                    ?
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {
                            mothers.map((mother) => {

                                const profile_img = mother?.profile_img ? getPublicImageUrl({ path: mother?.profile_img, bucket_name: 'user_profiles' }) : null

                                return (
                                    <div
                                        key={mother.id}
                                        className="group bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition"
                                    >
                                        {/* avatar */}
                                        <ProfileImg
                                            size="10"
                                            profile_img={profile_img}
                                            name={mother?.name}
                                        />

                                        {/* info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {mother.name}
                                            </p>

                                            <button
                                                onClick={() => onSelect?.(mother)}
                                                className="mt-1 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                                            >
                                                View profile
                                                <FiArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                )

                            })
                        }
                    </div>
                    :
                    <div className="flex flex-col items-center justify-center py-12 w-full">
                        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                            <rect width="48" height="48" rx="12" fill="#F3F3F3" />
                            <path
                                d="M24 14V24L30 28"
                                stroke="#BDBDBD"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <rect
                                x="12"
                                y="12"
                                width="24"
                                height="24"
                                rx="6"
                                stroke="#BDBDBD"
                                strokeWidth="2"
                            />
                        </svg>
                        <div className="text-gray-400 mt-2 font-medium">
                            No data to display
                        </div>
                        <div className="text-xs text-gray-400">
                            Assigned mothers will appear here
                        </div>
                    </div>
            }
        </Card>
    );
}
