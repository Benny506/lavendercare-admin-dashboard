import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceTemplate from "./InvoiceTemplate";
import Modal from "./ui/Modal";

export default function InvoiceModal({ metadata, isOpen, onClose }) {
    const printRef = useRef();

    // const handlePrint = () => {
    //     console.log(printRef)
    // }

    const handlePrint = useReactToPrint({
        // onBeforePrint: () => {
        //     console.log(printRef.current)
        // },
        contentRef: printRef,
        documentTitle: `Invoice-${metadata?.invoice?.invoiceNumber}`,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* Action bar */}
            <div className="flex justify-center mb-4 no-print">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-[#703DCB] text-white rounded-md text-sm font-medium"
                >
                    Print
                </button>
            </div>

            {/* Printable Content */}
            <div ref={printRef}>
                <InvoiceTemplate
                    invoice={metadata?.invoice}
                    customer={metadata?.customer}
                    items={metadata?.items}
                    payments={metadata?.payments}
                    discount={metadata?.discount}
                />
            </div>
        </Modal>
    );
}
