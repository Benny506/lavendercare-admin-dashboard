import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

export default function NodeFormModal({ initialData, existingIds, onClose, onSave }) {
    const [id, setId] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const isEdit = !!initialData;

    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setText(initialData.text);
        }
    }, [initialData]);

    const handleSave = () => {
        setError("");

        if (!id.trim() || !text.trim()) {
            setError("Both ID and Text are required.");
            return;
        }

        if (!isEdit && existingIds.includes(id)) {
            setError(`A node with the ID '${id}' already exists!`);
            return;
        }

        onSave({ id: id, text: text.trim() });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="w-full">
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isEdit ? "Edit Chat Node" : "Create New Chat Node"}
                    </h3>
                </div>

                <div className="mb-6">
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Node ID (System Name)
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => {
                                const formattedId = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                                setId(formattedId);
                                if (!isEdit && existingIds.includes(formattedId)) {
                                    setError(`The ID '${formattedId}' is already taken.`);
                                } else {
                                    setError("");
                                }
                            }}
                            disabled={isEdit}
                            placeholder="e.g. billing_inquiry"
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB] ${isEdit ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
                        />
                        {!isEdit && <p className="text-xs text-gray-400 mt-1">Used internally to link options to this node. Alphanumeric and underscores only.</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bot Response Text
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type the message the bot will say..."
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                        />
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
                        {isEdit ? "Update Node" : "Create Node"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
