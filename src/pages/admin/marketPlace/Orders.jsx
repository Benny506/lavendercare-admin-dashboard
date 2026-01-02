import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ZeroItems from '../components/ZeroItems';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import StatCard from '../components/StatsCard';
import { formatNumberWithCommas, formatDate1 } from '../../../lib/utils';
import CustomToolTip from '../components/ui/CustomToolTip';
import SingleOrder from './SingleOrder';
import { getOrderStatusColor } from '../../../constants/orderConstants';
import useApiReqs from '../../../hooks/useApiReqs';
import PathHeader from '../components/PathHeader';
import { FaEdit } from 'react-icons/fa';
import { usePagination } from '../../../hooks/usePagination';
import Pagination from '../components/Pagination';

export default function Orders() {
    const navigate = useNavigate();
    const { fetchOrders } = useApiReqs();

    const [statusFilter, setStatusFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [visibleOrderId, setVisibleOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(0)
    const [pageListIndex, setPageListIndex] = useState(0)

    useEffect(() => {
        fetchOrders({
            callBack: ({ orders }) => setOrders(orders),
        });
    }, []);

    const filteredOrders =
        statusFilter === 'All'
            ? orders
            : orders.filter((order) => order.status === statusFilter);

    const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
        arr: filteredOrders,
        maxShow: 7,
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

    return (
        <div className="w-full py-6">
            {/* Breadcrumbs */}
            <PathHeader
                paths={[
                    { text: 'MarketPlace' },
                    { text: 'Orders' },
                ]}
            />
            <div className="flex-1">
                <div className="space-y-8">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Orders"
                            value={orders.length}
                            icon="bi-receipt"
                            bg="bg-emerald-50"
                            color="text-emerald-700"
                        />
                        <StatCard
                            title="Pending"
                            value={orders.filter((o) => o.status === 'Pending').length}
                            icon="bi-clock-history"
                            bg="bg-yellow-50"
                            color="text-amber-700"
                        />
                        <StatCard
                            title="Shipped"
                            value={orders.filter((o) => o.status === 'Shipped').length}
                            icon="bi-truck"
                            bg="bg-blue-50"
                            color="text-blue-800"
                        />
                        <StatCard
                            title="Delivered"
                            value={orders.filter((o) => o.status === 'Delivered').length}
                            icon="bi-check-circle"
                            bg="bg-green-50"
                            color="text-green-800"
                        />
                    </div>

                    {/* Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        >
                            <option value="All">All Orders</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    {/* Orders Table */}
                    {pageItems.length <= 0 ? (
                        <ZeroItems zeroText="No orders found" />
                    ) : (
                        <div className="bg-white shadow-sm rounded-xl shadow overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Order ID', 'Date', 'Items', 'Total', 'Status', 'Actions'].map(
                                            (header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pageItems.map((order) => {
                                        const orderVisible = order.id === visibleOrderId;
                                        const statusColor = getOrderStatusColor(order.status);

                                        return (
                                            <>
                                                <tr key={order.id} className="">
                                                    <td className="px-6 py-4 font-semibold text-[#703DCB]">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {formatDate1({ dateISO: order.created_at })}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {formatNumberWithCommas(order.total_items)}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {order.currency}{' '}
                                                        {formatNumberWithCommas(order.total_price)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 text-sm font-medium rounded-full`}
                                                            style={{
                                                                backgroundColor: statusColor.bg,
                                                                color: statusColor.text,
                                                            }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <CustomToolTip
                                                                title={orderVisible ? 'Hide order' : 'View order'}
                                                            >
                                                                {orderVisible ? (
                                                                    <FaEyeSlash
                                                                        onClick={() =>
                                                                            setVisibleOrderId(orderVisible ? '' : order.id)
                                                                        }
                                                                        size={18}
                                                                        color="#703DCB"
                                                                        className="cursor-pointer"
                                                                    />
                                                                ) : (
                                                                    <FaEye
                                                                        onClick={() =>
                                                                            setVisibleOrderId(orderVisible ? '' : order.id)
                                                                        }
                                                                        size={18}
                                                                        color="#703DCB"
                                                                        className="cursor-pointer"
                                                                    />
                                                                )}
                                                            </CustomToolTip>

                                                            <CustomToolTip title="Status">
                                                                <FaEdit color='#703DCB' size={18} className='cursor-pointer' />
                                                            </CustomToolTip>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colSpan="6" className="px-6 py-0">
                                                        <SingleOrder
                                                            visible={orderVisible}
                                                            order={order}
                                                            setOrders={setOrders}
                                                            orders={orders}
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                        );
                                    })}
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

                            <div className="pb-2" />
                        </div>
                    )}

                    <p className="text-sm text-gray-500">
                        Showing {pageItems.length} of {orders.length} orders
                    </p>
                </div>
            </div>
        </div>
    );
}