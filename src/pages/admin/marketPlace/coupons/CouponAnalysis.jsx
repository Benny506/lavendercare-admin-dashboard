import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import { FiActivity, FiPercent, FiTrendingDown, FiTag } from "react-icons/fi";

const BRAND = "#703DCB"; // Updated brand color
const MUTED = "#6B9080"; // Soft muted color

export default function CouponAnalysis({ coupons = [], usage = [] }) {
    const [loading, setLoading] = useState(true);

    const [overview, setOverview] = useState(null);
    const [usageTrend, setUsageTrend] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [statusBreakdown, setStatusBreakdown] = useState([]);
    const [typeBreakdown, setTypeBreakdown] = useState([]);

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        try {
            const now = Date.now();

            const totalCoupons = coupons.length;
            const activeCoupons = coupons.filter(
                c => c.is_active && (!c.expires_at || new Date(c.expires_at).getTime() > now)
            ).length;
            const expiredCoupons = coupons.filter(
                c => c.expires_at && new Date(c.expires_at).getTime() <= now
            ).length;
            const totalUses = usage.length;
            const totalDiscount = usage.reduce((sum, u) => sum + Number(u.discount_applied), 0);

            setOverview({
                totalCoupons,
                activeCoupons,
                expiredCoupons,
                totalUses,
                totalDiscount,
                avgDiscount: totalUses ? Math.round(totalDiscount / totalUses) : 0
            });

            // Usage Trend
            const trendMap = {};
            usage.forEach(u => {
                const day = new Date(u.used_at).toISOString().slice(0, 10);
                if (!trendMap[day]) trendMap[day] = { date: day, uses: 0, discount: 0 };
                trendMap[day].uses += 1;
                trendMap[day].discount += Number(u.discount_applied);
            });
            setUsageTrend(Object.values(trendMap));

            // Performance Ranking
            const rankingMap = {};
            coupons.forEach(c => {
                rankingMap[c.id] = { code: c.code, uses: 0, discount: 0 };
            });
            usage.forEach(u => {
                if (rankingMap[u.coupon_id]) {
                    rankingMap[u.coupon_id].uses += 1;
                    rankingMap[u.coupon_id].discount += Number(u.discount_applied);
                }
            });
            setRanking(Object.values(rankingMap).sort((a, b) => b.uses - a.uses).slice(0, 10));

            // Status Breakdown
            const statusCounts = { Active: 0, Inactive: 0, Expired: 0 };
            coupons.forEach(c => {
                if (!c.is_active) statusCounts.Inactive += 1;
                else if (c.expires_at && new Date(c.expires_at).getTime() <= now) statusCounts.Expired += 1;
                else statusCounts.Active += 1;
            });
            setStatusBreakdown(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

            // Type Breakdown
            const typeMap = {};
            coupons.forEach(c => {
                if (!typeMap[c.type]) typeMap[c.type] = { type: c.type, count: 0, discount: 0 };
                typeMap[c.type].count += 1;
            });
            usage.forEach(u => {
                const coupon = coupons.find(c => c.id === u.coupon_id);
                if (coupon) typeMap[coupon.type].discount += Number(u.discount_applied);
            });
            setTypeBreakdown(Object.values(typeMap));
        } catch (err) {
            console.error("Coupon analysis error:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
            {/* ========== GLOBAL METRICS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Total Coupons" value={overview.totalCoupons} icon={<FiTag />} />
                <MetricCard label="Active Coupons" value={overview.activeCoupons} icon={<FiActivity />} />
                <MetricCard label="Expired Coupons" value={overview.expiredCoupons} />
                <MetricCard label="Total Discount Given" value={`₦${overview.totalDiscount.toLocaleString()}`} icon={<FiTrendingDown />} />
            </div>

            {/* ========== USAGE TREND ========== */}
            <div className="bg-white shadow-sm rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-gray-700">Coupon Usage Over Time</h6>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={usageTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="uses" stroke={BRAND} strokeWidth={2} />
                        <Line type="monotone" dataKey="discount" stroke={MUTED} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ========== PERFORMANCE RANKING ========== */}
            <div className="bg-white shadow-sm rounded-lg p-4 overflow-x-auto">
                <h6 className="font-semibold mb-3 text-gray-700">Top Performing Coupons</h6>
                <table className="min-w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Code', 'Uses', 'Total Discount'].map((h, idx) => (
                                <th key={idx} className="px-3 py-2 text-left text-sm font-semibold text-gray-700">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ranking.map(r => (
                            <tr key={r.code}>
                                <td className="px-3 py-2">
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded">{r.code}</span>
                                </td>
                                <td className="px-3 py-2">{r.uses}</td>
                                <td className="px-3 py-2">₦{r.discount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ========== BREAKDOWNS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BreakdownCard title="Coupon Status" data={statusBreakdown} />
                <BreakdownCard
                    title="Coupon Types"
                    data={typeBreakdown.map(t => ({ name: t.type, value: t.count }))}
                />
            </div>
        </div>
    );
}

/* ================= SMALL COMPONENTS ================= */
function MetricCard({ label, value, icon }) {
    return (
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-1 h-full">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                {icon && <span className="text-purple-700">{icon}</span>}
                {label}
            </div>
            <h5 className="font-semibold text-gray-900 text-lg mt-1">{value}</h5>
        </div>
    );
}

function BreakdownCard({ title, data }) {
    const COLORS = [BRAND, MUTED, "#A4C3B2"];
    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
            <h6 className="font-semibold mb-3 text-gray-700">{title}</h6>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
