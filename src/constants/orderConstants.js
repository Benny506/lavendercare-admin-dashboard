export const getOrderStatusColor = (status) => {
    switch (status) {
        case 'delivered': return '#10b981';
        case 'shipped': return '#3b82f6';
        case 'placed': return '#f59e0b';
        case 'cancelled': return '#ef4444';
        default: return '#6b7280';
    }
};

export const getOrderStatusText = (status) => {
    switch (status) {
        case 'delivered': return 'Delivered';
        case 'shipped': return 'Shipped';
        case 'placed': return 'Placed';
        case 'cancelled': return 'Cancelled';
        default: return status;
    }
};