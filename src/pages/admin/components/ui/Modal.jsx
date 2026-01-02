import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-11/12 lg:min-w-3/5 min-w-4/5 overflow-y-auto max-h-4/5 mx-auto p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
