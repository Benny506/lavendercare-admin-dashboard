import {
    FiHome,
    FiMail,
    FiPhone,
    FiMapPin,
    FiFileText,
    FiCalendar,
    FiCreditCard,
    FiHash,
} from "react-icons/fi";
import Logo from '../../../assets/logos/logo.svg'
import { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceTemplate = ({ invoice, customer, items, payments, discount = 0 }) => {

    const company = {
        name: "LavenderCare",
        // address: "12 Blossom Avenue, Lagos, Nigeria",
        email: "hello@lavendercare.co",
        phone: "+234 800 000 0000",
        website: "www.lavendercare.co",
        logo: Logo,
        primaryColor: "#703DCB",
        // registrationNumber: "RC-123456",
        // taxId: "VAT-987654",
    };

    const notes = `Thank you for choosing LavenderCare. If you have any questions concerning this invoice, 
    please contact our support team at hello@lavendercare.co.`;

    const subtotal = items?.reduce(
        (sum, item) => sum + item?.quantity * item?.unitPrice,
        0
    );

    const taxRate = 0.075;
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    return (
        <div className="print-full max-w-5xl mx-auto bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Accent Bar */}
                <div
                    className="h-2"
                    style={{ backgroundColor: company.primaryColor }}
                />

                <div className="p-10 text-sm text-gray-800">
                    {/* HEADER */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-4">
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        className="h-12 w-auto object-contain"
                                    />
                                ) : (
                                    <div
                                        className="h-12 w-12 flex items-center justify-center rounded-lg text-white font-bold text-lg"
                                        style={{ backgroundColor: company.primaryColor }}
                                    >
                                        {company.name.charAt(0)}
                                    </div>
                                )}

                                <h1
                                    className="text-3xl font-bold tracking-tight"
                                    style={{ color: company.primaryColor }}
                                >
                                    {company.name}
                                </h1>
                            </div>


                            <div className="mt-4 space-y-1 text-gray-600">
                                {/* <p className="flex items-center gap-2">
                                    <FiHome size={15} /> {company.address}
                                </p> */}
                                <p className="flex items-center gap-2">
                                    <FiMail size={15} /> {company.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FiPhone size={15} /> {company.phone}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FiMapPin size={15} /> {company.website}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-2xl font-semibold tracking-wide">
                                INVOICE
                            </h2>

                            <div className="mt-3 space-y-1 text-gray-600">
                                <p className="flex items-center justify-end gap-2">
                                    <FiHash size={14} /> {invoice?.invoiceNumber}
                                </p>
                                <p className="flex items-center justify-end gap-2">
                                    <FiFileText size={14} /> {invoice?.orderId}
                                </p>
                                <p className="flex items-center justify-end gap-2">
                                    <FiCalendar size={14} /> {invoice?.orderDate}
                                </p>
                            </div>

                            <span
                                className={`inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-semibold
                                ${invoice?.status === "PAID"
                                        ? "bg-green-100 text-green-700"
                                        : invoice?.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {invoice?.status}
                            </span>
                        </div>
                    </div>

                    {/* BILLING INFO */}
                    <div className="mt-10 grid grid-cols-1 gap-6">
                        <div className="bg-gray-50 rounded-lg p-5">
                            <h3 className="text-xs font-semibold text-gray-500 mb-2">
                                BILL TO
                            </h3>
                            <p className="font-medium">{customer?.name}</p>
                            <p>{customer?.company}</p>
                            <p>{customer?.address}</p>
                            <p>{customer?.email}</p>
                            <p>{customer?.phone}</p>
                        </div>

                        {/* <div className="bg-gray-50 rounded-lg p-5 text-right">
                            <h3 className="text-xs font-semibold text-gray-500 mb-2">
                                COMPANY DETAILS
                            </h3>
                            <p>Registration No: {company.registrationNumber}</p>
                            <p>Tax ID: {company.taxId}</p>
                        </div> */}
                    </div>

                    {/* ITEMS */}
                    <div className="bg-white shadow-sm rounded-xl shadow overflow-x-auto mt-10">
                        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Item</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Qty</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Unit</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items?.map((item, idx) => (
                                    <tr key={idx} className="">
                                        <td className="py-4 px-6">
                                            <p className="font-medium">{item?.name}</p>
                                            {/* <p className="text-xs text-gray-500">
                                                {item?.description}
                                            </p> */}
                                        </td>
                                        <td className="py-4 px-6 text-center">{item?.quantity}</td>
                                        <td className="py-4 px-6 text-right">
                                            {invoice?.currency}
                                            {item?.unitPrice.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right font-medium">
                                            {invoice?.currency}
                                            {(item?.quantity * item?.unitPrice).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTALS */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-80 bg-gray-50 rounded-lg p-5 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    {invoice?.currency}
                                    {subtotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between text-red-600">
                                <span>Discount</span>
                                <span>
                                    -{invoice?.currency}
                                    {discount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax (7.5%)</span>
                                <span>
                                    {invoice?.currency}
                                    {taxAmount.toLocaleString()}
                                </span>
                            </div>

                            <div
                                className="flex justify-between pt-3 border-t text-lg font-bold"
                                style={{ color: company.primaryColor }}
                            >
                                <span>Total</span>
                                <span>
                                    {invoice?.currency}
                                    {total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="mt-10 bg-gray-50 rounded-lg p-5">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">
                            PAYMENT INFORMATION
                        </h3>
                        <p className="flex items-center gap-2">
                            <FiCreditCard size={16} /> {payments?.method}
                        </p>
                        <p>Transaction ID: {payments?.trxRef}</p>
                        {/* <p>Paid At: {payments?.paidAt}</p> */}
                    </div>

                    {/* NOTES */}
                    <div className="mt-8">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">
                            NOTES
                        </h3>
                        <p className="text-gray-600 whitespace-pre-line">
                            {notes}
                        </p>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-12 text-center text-xs text-gray-400">
                        <p>This invoice is computer-generated and does not require a signature.</p>
                        <p>
                            © {new Date().getFullYear()} {company.name}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceTemplate;