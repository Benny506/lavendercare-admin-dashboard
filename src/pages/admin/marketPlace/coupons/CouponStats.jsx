import { useEffect, useState } from "react";
import { FiUsers, FiTrendingDown, FiActivity } from "react-icons/fi";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import supabase from "../../../../database/dbInit";
import { formatNiceTime, formatNiceDate } from "../../../../lib/utils";
import PathHeader from "../../components/PathHeader";

const BRAND = "#703DCB";
const MUTED = "#6B7280";

export default function CouponStats() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const couponId = state?.couponId;

    const [coupon, setCoupon] = useState(null);
    const [overview, setOverview] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!couponId) {
            navigate(-1);
            toast.info("Coupon Id not found!");
            return;
        }
        fetchStats();
    }, [couponId]);

    async function fetchStats() {
        dispatch(appLoadStart());

        try {
            // 1. Coupon info
            const { data: couponData, error: couponErr } = await supabase
                .from("coupons")
                .select("*")
                .eq("id", couponId)
                .single();

            if (couponErr) throw couponErr;
            setCoupon(couponData);

            // 2. Overview stats
            const { data: usageData, error: usageErr } = await supabase
                .from("coupon_usage")
                .select("discount_applied, user_id, used_at")
                .eq("coupon_id", couponId);

            if (usageErr) throw usageErr;

            const totalUses = usageData.length;
            const uniqueUsers = new Set(usageData.map((u) => u.user_id)).size;
            const totalDiscount = usageData.reduce(
                (sum, u) => sum + Number(u.discount_applied),
                0
            );

            setOverview({
                totalUses,
                uniqueUsers,
                totalDiscount,
                avgDiscount: totalUses > 0 ? Math.round(totalDiscount / totalUses) : 0,
            });

            // 3. Timeline
            const timelineMap = {};
            usageData.forEach((u) => {
                const day = new Date(u.used_at).toISOString().slice(0, 10);
                if (!timelineMap[day]) {
                    timelineMap[day] = { date: day, uses: 0, discount: 0 };
                }
                timelineMap[day].uses += 1;
                timelineMap[day].discount += Number(u.discount_applied);
            });
            setTimeline(Object.values(timelineMap));

            // 4. Per-user aggregation
            const { data: userUsage, error: userErr } = await supabase
                .from("coupon_usage")
                .select(`
                    user_id,
                    discount_applied,
                    used_at,
                    user_profiles (
                        id,
                        username
                    )
                `)
                .eq("coupon_id", couponId);

            if (userErr) throw userErr;

            const userMap = {};
            userUsage.forEach((u) => {
                if (!userMap[u.user_id]) {
                    const ts = new Date(u.used_at).getTime();
                    userMap[u.user_id] = {
                        user: u.user_profiles,
                        usage_count: 0,
                        total_discount: 0,
                        first_used: ts,
                        last_used: ts,
                    };
                }

                const ref = userMap[u.user_id];
                const usedAt = new Date(u.used_at).getTime();

                ref.usage_count += 1;
                ref.total_discount += Number(u.discount_applied);
                ref.first_used = Math.min(ref.first_used, usedAt);
                ref.last_used = Math.max(ref.last_used, usedAt);
            });

            setUsers(Object.values(userMap));
        } catch (err) {
            console.error("Coupon stats error:", err);
            toast.error("Error loading coupon stats! Try refreshing the page!");
        } finally {
            dispatch(appLoadStop());
        }
    }

    if (!coupon) return null;

    return (
        <div className="pt-6 w-full flex">
            <div className="flex-1 w-full flex flex-col">

                <PathHeader
                    paths={[
                        { type: 'text', text: 'Coupons' },
                        { type: 'text', text: `Stats: ${coupon?.code}` },
                    ]}
                />

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        Coupon <span className="font-bold">{coupon?.code}</span> Statistics
                    </h2>
                </div>

                <div className="flex flex-col gap-4 bg-white shadow-sm rounded-lg p-4 mt-2">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<FiActivity />}
                            label="Total Uses"
                            value={overview?.totalUses}
                        />
                        <StatCard
                            icon={<FiUsers />}
                            label="Unique Users"
                            value={overview?.uniqueUsers}
                        />
                        <StatCard
                            icon={<FiTrendingDown />}
                            label="Total Discount"
                            value={`₦${overview?.totalDiscount.toLocaleString()}`}
                        />
                        <StatCard
                            label="Status"
                            value={
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${coupon.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {coupon.is_active ? "Active" : "Inactive"}
                                </span>
                            }
                        />
                    </div>

                    {/* Timeline Chart */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <h6 className="mb-3 font-medium text-gray-700">
                            Coupon Usage Over Time
                        </h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <ComposedChart data={timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="uses" fill={BRAND} radius={[4, 4, 0, 0]} />
                                <Line
                                    type="monotone"
                                    dataKey="discount"
                                    stroke={MUTED}
                                    strokeWidth={2}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                        <h6 className="mb-3 font-medium text-gray-700">
                            Users Who Used This Coupon
                        </h6>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Times Used</th>
                                    <th className="px-4 py-2">Total Discount</th>
                                    <th className="px-4 py-2">First Used</th>
                                    <th className="px-4 py-2">Last Used</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
                                {users.map((u) => (
                                    <tr key={u.user.id}>
                                        <td className="px-4 py-2">{u.user.username}</td>
                                        <td className="px-4 py-2">{u.usage_count}</td>
                                        <td className="px-4 py-2">
                                            ₦{u.total_discount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {formatNiceDate({ dateUTC: new Date(u.first_used).toISOString() })}{" "}
                                            {formatNiceTime({ timeUTC: new Date(u.first_used).toISOString() })}
                                        </td>
                                        <td className="px-4 py-2">
                                            {formatNiceDate({ dateUTC: new Date(u.last_used).toISOString() })}{" "}
                                            {formatNiceTime({ timeUTC: new Date(u.last_used).toISOString() })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Stat Card ---------------- */
function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
                {icon && <span style={{ color: BRAND }}>{icon}</span>}
                <small className="text-sm">{label}</small>
            </div>
            <h5 className="text-lg font-semibold">{value}</h5>
        </div>
    );
}
