import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Modal from "../../components/ui/Modal";

export default function OptionFormModal({ existingIds, onClose, onSave }) {
    const [label, setLabel] = useState("");
    const [nextNode, setNextNode] = useState(existingIds.length > 0 ? existingIds[0] : "");
    const [error, setError] = useState("");

    const handleSave = () => {
        setError("");

        if (!label.trim()) {
            setError("Button label is required.");
            return;
        }

        if (!nextNode) {
            setError("Please select a target node.");
            return;
        }

        onSave({ label: label.trim(), nextNode });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="w-full">
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-800">Add User Option</h3>
                </div>

                <div className="mb-6">
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Option Label (Button Text)
                        </label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. 🏥 Hospital Management (HMS)"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link to Node
                        </label>
                        <select
                            value={nextNode}
                            onChange={(e) => setNextNode(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB] appearance-none bg-white"
                        >
                            {existingIds.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                        <FiChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#6F3DCB] text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                    >
                        Add Option
                    </button>
                </div>
            </div>
        </Modal>
    );
}
