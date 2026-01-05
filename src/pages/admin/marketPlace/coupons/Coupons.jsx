import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaVideo } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { CgCheck } from 'react-icons/cg';
import { ImCancelCircle } from 'react-icons/im';

import { formatNumberWithCommas, formatNiceTime, formatReadableDate } from '../../../../lib/utils';
import ZeroItems from '../../components/ZeroItems';
import CustomToolTip from '../../components/ui/CustomToolTip';
import useApiReqs from '../../../../hooks/useApiReqs';
import CouponAnalysis from './CouponAnalysis';
import PathHeader from '../../components/PathHeader';
import { BsSearch } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';

const tabFilters = [
    { key: "stats", label: "Analytics" },
    { key: "all", label: "List" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "InActive" },
];

export default function Coupons() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { fetchCoupons, fetchCouponsUsages } = useApiReqs();

    const [searchQuery, setSearchQuery] = useState('');
    const [tab, setTab] = useState('all');
    const [coupons, setCoupons] = useState([]);
    const [usage, setUsage] = useState([]);

    useEffect(() => {
        fetchCoupons({ callBack: ({ coupons }) => setCoupons(coupons) });
        fetchCouponsUsages({ callBack: ({ usage }) => setUsage(usage) });
    }, []);

    const filteredCoupons = coupons?.filter((p) => {
        const matchesSearch =
            p.code?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            searchQuery?.toLowerCase().includes(p.code?.toLowerCase());

        const matchesTab =
            tab === 'all' ? true : tab === 'active' ? p.is_active : !p.is_active;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="pt-6 w-full flex">
            <div className="flex-1 w-full flex flex-col">

                <PathHeader
                    paths={[
                        { type: 'text', text: 'Coupons' },
                    ]}
                />

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center">
                    <h2 className="text-2xl font-semibold">Manage Coupons</h2>

                    <div className="flex flex-wrap gap-2 items-center mt-3 lg:mt-0">
                        <button
                            onClick={() => navigate("/admin/marketplace/coupons/create")}
                            className="bg-(--primary-500) cursor-pointer w-full text-white rounded-lg px-4 py-2 font-semibold transition"
                        >
                            <i className="bi bi-plus-circle"></i>
                            Add Coupon
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-3 mb-3">
                    {/* Tabs */}
                    <div className="bg-white shadow-sm rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            {tabFilters.map((item) => {
                                const isActive = tab === item.key;

                                return (
                                    <div
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`cursor-pointer p-2 rounded-lg shadow text-center transition-all duration-200 ${isActive ? 'bg-primary-600 text-white' : 'bg-transparent text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className="font-semibold text-sm">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats or List */}
                    {tab === 'stats' ? (
                        <div className="bg-white shadow-sm rounded-lg py-4">
                            <CouponAnalysis coupons={coupons} usage={usage} />
                        </div>
                    ) : (
                        <div className="bg-white shadow-sm rounded-lg p-4">
                            {/* Search */}
                            <div className="mb-4 flex flex-row gap-3 items-start md:items-center">
                                <input
                                    type="search"
                                    placeholder="Search coupons by code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Table */}
                            {filteredCoupons?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {['Code', 'Type', 'Discount value', 'Used count', 'Usage limit', 'Expires at', 'Active', 'Actions'].map((h, idx) => (
                                                    <th key={idx} className="px-3 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredCoupons.map((coupon) => (
                                                <tr key={coupon.id}>
                                                    <td className="px-3 py-3">{coupon?.code}</td>
                                                    <td className="px-3 py-3 font-semibold">{coupon?.type}</td>
                                                    <td className="px-3 py-3 font-semibold">
                                                        {formatNumberWithCommas(coupon?.discount_value)}
                                                        {coupon?.type === 'percentage' ? '%' : ' fixed'}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {coupon?.used_count ? formatNumberWithCommas(coupon?.used_count) : 0}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {coupon?.usage_limit ? formatNumberWithCommas(coupon?.usage_limit) : 'Not set'}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {coupon?.expires_at
                                                            ? `${formatReadableDate({ dateString: coupon?.expires_at })} ${formatNiceTime({ timeUTC: coupon?.expires_at })}`
                                                            : 'Not set'}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {coupon?.is_active ? <CgCheck className="text-primary-700" size={24} /> : <ImCancelCircle className="text-red-600" size={20} />}
                                                    </td>
                                                    <td className="px-3 py-3 text-right flex justify-end gap-3">
                                                        <button
                                                            className="text-primary-600 hover:text-primary-800"
                                                            onClick={() => navigate("/admin/marketplace/coupons/single-coupon-stats", { state: { couponId: coupon?.id } })}
                                                        >
                                                            <CustomToolTip title="See usage stats on this coupon">
                                                                <FaEye size={20} />
                                                            </CustomToolTip>
                                                        </button>

                                                        <button
                                                            className="text-gray-600 hover:text-gray-800"
                                                            onClick={() => navigate("/admin/marketplace/coupons/edit", { state: coupon })}
                                                        >
                                                            <CustomToolTip title="Edit this coupon">
                                                                <FaEdit size={20} />
                                                            </CustomToolTip>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className=''>
                                    <ZeroItems zeroText="No coupons found" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
