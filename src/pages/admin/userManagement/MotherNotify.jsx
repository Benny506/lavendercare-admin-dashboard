import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { setNotifications, addNotification } from "../../../redux/slices/notificationsSlice";
import supabase from "../../../database/dbInit";
import Modal from "../components/ui/Modal";
import { FaEye, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdNotifications } from "react-icons/md";
import { formatDate1 } from "../../../lib/utils";
import ProductsModal from "../components/ProductsModal";
import ServicesModal from "../components/ServicesModal";
import MothersModal from "../components/MothersModal";
import ProductCardSmall from "../components/ui/ProductCardSmall";
import ServiceCardSmall from "../components/ui/ServiceCardSmall";
import MotherCardSmall from "../components/ui/MotherCardSmall";
import Pagination from "../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";


function MotherNotify() {
    const dispatch = useDispatch();
    const { notifications, fetched } = useSelector((state) => state.notificationsSlice);
    const [viewModal, setViewModal] = useState({ open: false, data: null });
    const [createModal, setCreateModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageListIndex, setPageListIndex] = useState(0);

    const {
        pageItems,
        totalPages,
        pageList,
        totalPageListIndex
    } = usePagination({
        arr: notifications,
        maxShow: 10,
        index: currentPage,
        maxPage: 5,
        pageListIndex: pageListIndex
    });

    const incrementPageListIndex = () => setPageListIndex((prev) => prev + 1);
    const decrementPageListIndex = () => setPageListIndex((prev) => prev - 1);

    useEffect(() => {
        if (!fetched) {
            fetchNotifications();
        }
    }, [fetched]);

    const fetchNotifications = async () => {
        try {
            dispatch(appLoadStart());
            const { data, error } = await supabase
                .from("in_app_notifications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            dispatch(setNotifications(data));
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to fetch notifications");
        } finally {
            dispatch(appLoadStop());
        }
    };

    const handleView = (notification) => {
        setViewModal({ open: true, data: notification });
    };

    return (
        <div className="p-6 bg-[#F8F9FB] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500 text-sm">Manage in-app notifications sent to users</p>
                </div>
                <button
                    onClick={() => setCreateModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer"
                >
                    <FaPlus />
                    <span className="hidden sm:inline">Create Notification</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">Message</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Created At</th>
                                <th className="p-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <MdNotifications size={40} className="text-gray-300" />
                                            <p>No notifications found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pageItems?.map((notification) => (
                                    <tr key={notification.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 max-w-[200px] truncate">
                                            {notification.title || "No Title"}
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-[300px] truncate">
                                            {notification.message}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium uppercase">
                                                {notification.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{notification.type || "-"}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {formatDate1({ dateISO: notification.created_at })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleView(notification)}
                                                className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50 cursor-pointer"
                                                title="View Details"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center">
                        <Pagination
                            pageItems={pageItems}
                            pageListIndex={pageListIndex}
                            pageList={pageList}
                            totalPageListIndex={totalPageListIndex}
                            currentPage={currentPage}
                            decrementPageListIndex={decrementPageListIndex}
                            incrementPageListIndex={incrementPageListIndex}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* View Modal */}
            <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, data: null })}>
                {viewModal.data && (
                    <div className="p-2">
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{viewModal.data.title || "Notification Details"}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    ID: <span className="font-mono bg-gray-100 px-1 rounded">{viewModal.data.id}</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                                    <p className="font-medium text-gray-800 capitalize">{viewModal.data.category}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Type</label>
                                    <p className="font-medium text-gray-800">{viewModal.data.type || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Created At</label>
                                    <p className="font-medium text-gray-800">{formatDate1(viewModal.data.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Seen At</label>
                                    <p className="font-medium text-gray-800">
                                        {viewModal.data.seen_at ? formatDate1(viewModal.data.seen_at) : "Not seen yet"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Message</label>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed">
                                    {viewModal.data.message}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {viewModal.data.user_id && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Specific User ID</label>
                                        <p className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-100 text-gray-600 truncate">
                                            {viewModal.data.user_id}
                                        </p>
                                    </div>
                                )}
                                {viewModal.data.test_id && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Test ID</label>
                                        <p className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-100 text-gray-600 truncate">
                                            {viewModal.data.test_id}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {viewModal.data.service_ids && viewModal.data.service_ids.length > 0 && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Service IDs</label>
                                    <div className="flex flex-wrap gap-2">
                                        {viewModal.data.service_ids.map((id, idx) => (
                                            <span key={idx} className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                                                {id}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {viewModal.data.product_ids && viewModal.data.product_ids.length > 0 && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Product IDs</label>
                                    <div className="flex flex-wrap gap-2">
                                        {viewModal.data.product_ids.map((id, idx) => (
                                            <span key={idx} className="font-mono text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100">
                                                {id}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Modal */}
            <CreateNotificationModal 
                isOpen={createModal} 
                onClose={() => setCreateModal(false)} 
            />
        </div>
    );
}

function CreateNotificationModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        category: "general",
        type: "",
        user_id: "",
        test_id: "",
        service_ids: [],
        product_ids: []
    });

    const [selectedMother, setSelectedMother] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [selectedServices, setSelectedServices] = useState([])

    const [mothersModal, setMothersModal] = useState(false)
    const [productsModal, setProductsModal] = useState(false)
    const [servicesModal, setServicesModal] = useState(false)


    const resetForm = () => {
        setFormData({
            title: "",
            message: "",
            category: "general",
            type: "",
            user_id: "",
            test_id: "",
            service_ids: [],
            product_ids: []
        });
        setSelectedMother(null)
        setSelectedProducts([])
        setSelectedServices([])
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.message) {
            toast.warning("Message is required");
            return;
        }

        try {
            dispatch(appLoadStart());

            const payload = {
                title: formData.title || null,
                message: formData.message,
                category: formData.category,
                type: formData.type,
                user_id: selectedMother?.id || null,
                test_id: formData.test_id || null,
                service_ids: selectedServices?.length > 0 ? selectedServices.map(s => s.id) : null,
                product_ids: selectedProducts?.length > 0 ? selectedProducts.map(p => p.id) : null,
            };

            const { data, error } = await supabase
                .from("in_app_notifications")
                .insert([payload])
                .select()
                .single();

            if (error) throw error;

            dispatch(addNotification(data));
            toast.success("Notification created successfully");
            resetForm();
            onClose();

        } catch (error) {
            console.error("Error creating notification:", error);
            toast.error("Failed to create notification");
        } finally {
            dispatch(appLoadStop());
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="p-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Create Notification</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Notification Title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="general">General</option>
                                    <option value="alert">Alert</option>
                                    <option value="info">Info</option>
                                    <option value="promotion">Promotion</option>
                                    <option value="reminder">Reminder</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Enter notification message..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="">Select Type</option>
                                    <option value="broadcast">Broadcast</option>
                                    <option value="targeted">Targeted</option>
                                    <option value="system">System</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specific User</label>
                                {!selectedMother ? (
                                    <button
                                        type="button"
                                        onClick={() => setMothersModal(true)}
                                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaPlus /> Select User
                                    </button>
                                ) : (
                                    <MotherCardSmall
                                        mother={selectedMother}
                                        onDelete={() => setSelectedMother(null)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Array Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service IDs */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Services</label>
                                    <button
                                        type="button"
                                        onClick={() => setServicesModal(true)}
                                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        + Add Services
                                    </button>
                                </div>
                                <div className="border rounded-lg p-2 min-h-[100px] bg-gray-50 space-y-2">
                                    {selectedServices.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-4">No services selected</p>
                                    ) : (
                                        selectedServices.map((service, idx) => (
                                            <ServiceCardSmall
                                                key={idx}
                                                service={service}
                                                onDelete={(s) => {
                                                    setSelectedServices(prev => prev.filter(item => item.id !== s.id))
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Product IDs */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Products</label>
                                    <button
                                        type="button"
                                        onClick={() => setProductsModal(true)}
                                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        + Add Products
                                    </button>
                                </div>
                                <div className="border rounded-lg p-2 min-h-[100px] bg-gray-50 space-y-2">
                                    {selectedProducts.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-4">No products selected</p>
                                    ) : (
                                        selectedProducts.map((product, idx) => (
                                            <ProductCardSmall
                                                key={idx}
                                                product={product}
                                                onDelete={(p) => {
                                                    setSelectedProducts(prev => prev.filter(item => item.id !== p.id))
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-all font-medium"
                            >
                                Create Notification
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <MothersModal
                modalProps={{
                    visible: mothersModal,
                    hide: () => setMothersModal(false)
                }}
                onMotherSelected={(mother) => {
                    setSelectedMother(mother)
                    setMothersModal(false)
                }}
                selectedMotherId={selectedMother?.id}
            />

            <ProductsModal
                modalProps={{
                    visible: productsModal,
                    hide: () => setProductsModal(false)
                }}
                onProductSelected={(product) => {
                    // Check if already selected
                    if (!selectedProducts.find(p => p.id === product.id)) {
                        setSelectedProducts(prev => [...prev, product])
                    }
                    // Keep modal open for multiple selection
                }}
            />

            <ServicesModal
                modalProps={{
                    visible: servicesModal,
                    hide: () => setServicesModal(false)
                }}
                onServiceSelected={(service) => {
                    // Check if already selected
                    if (!selectedServices.find(s => s.id === service.id)) {
                        setSelectedServices(prev => [...prev, service])
                    }
                }}
            />
        </>
    );
}

export default MotherNotify;
