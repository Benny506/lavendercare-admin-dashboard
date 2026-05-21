import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiAlertTriangle } from "react-icons/fi";
import { subtleLoadStart, subtleLoadStop } from "../../../../redux/slices/subtleLoaderSlice";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import { setChatNodes, setUnsavedChanges, selectChatNodes, selectUnsavedChanges } from "../../../../redux/slices/chatSupportSlice";
import ConfirmModal from "../../components/ConfirmModal";
import NodeFormModal from "./NodeFormModal";
import OptionFormModal from "./OptionFormModal";
import supabase from "../../../../database/dbInit";

export default function ChatSupportEditor() {
    const dispatch = useDispatch();
    const globalChatNodes = useSelector(selectChatNodes);
    const unsavedChanges = useSelector(selectUnsavedChanges);

    // Local state for editing before saving
    const [localNodes, setLocalNodes] = useState({});

    // Modals
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmData, setConfirmData] = useState({});

    const [showNodeModal, setShowNodeModal] = useState(false);
    const [editingNode, setEditingNode] = useState(null); // null if creating

    const [showOptionModal, setShowOptionModal] = useState(false);
    const [targetNodeId, setTargetNodeId] = useState(null); // ID of the node getting the option

    useEffect(() => {
        fetchChatNodes();
    }, []);

    const fetchChatNodes = async () => {
        dispatch(subtleLoadStart());
        try {
            const { data, error } = await supabase.from('chat_nodes').select('*');
            if (error) throw error;

            const nodesMap = {};
            data.forEach(node => {
                nodesMap[node.id] = { id: node.id, text: node.text, options: node.options };
            });

            dispatch(setChatNodes(nodesMap));
            setLocalNodes(JSON.parse(JSON.stringify(nodesMap)));
            dispatch(setUnsavedChanges(false));
        } catch (error) {
            console.error("Error fetching chat config:", error);
            toast.error("Failed to load chat configuration.");
        } finally {
            dispatch(subtleLoadStop());
        }
    };

    const markUnsaved = () => {
        if (!unsavedChanges) dispatch(setUnsavedChanges(true));
    };

    // Node Actions
    const handleSaveNode = (nodeData) => {
        setLocalNodes(prev => ({
            ...prev,
            [nodeData.id]: {
                id: nodeData.id,
                text: nodeData.text,
                options: prev[nodeData.id]?.options || []
            }
        }));
        markUnsaved();
    };

    const handleDeleteNodeRequest = (nodeId) => {
        setConfirmData({
            title: "Delete Chat Node",
            msg: `Are you sure you want to delete '${nodeId}'? This will also remove any options that link to it!`,
            yesFunc: () => executeDeleteNode(nodeId)
        });
        setShowConfirm(true);
    };

    const executeDeleteNode = (nodeId) => {
        setLocalNodes(prev => {
            const newNodes = { ...prev };
            delete newNodes[nodeId];

            // Clean up any options in other nodes that point to this deleted node
            Object.keys(newNodes).forEach(id => {
                const filteredOptions = newNodes[id].options.filter(opt => opt.nextNode !== nodeId);
                if (filteredOptions.length !== newNodes[id].options.length) {
                    newNodes[id] = {
                        ...newNodes[id],
                        options: filteredOptions
                    };
                }
            });
            return newNodes;
        });
        markUnsaved();
        setShowConfirm(false);
    };

    // Option Actions
    const handleSaveOption = (nodeId, optionData) => {
        setLocalNodes(prev => {
            const node = prev[nodeId];
            return {
                ...prev,
                [nodeId]: {
                    ...node,
                    options: [...node.options, optionData]
                }
            };
        });
        markUnsaved();
    };

    const handleDeleteOptionRequest = (nodeId, optionIndex) => {
        setConfirmData({
            title: "Delete Option",
            msg: "Are you sure you want to remove this option from the node?",
            yesFunc: () => executeDeleteOption(nodeId, optionIndex)
        });
        setShowConfirm(true);
    };

    const executeDeleteOption = (nodeId, optionIndex) => {
        setLocalNodes(prev => {
            const node = prev[nodeId];
            const newOptions = [...node.options];
            newOptions.splice(optionIndex, 1);
            return {
                ...prev,
                [nodeId]: {
                    ...node,
                    options: newOptions
                }
            };
        });
        markUnsaved();
        setShowConfirm(false);
    };

    // Global Save
    const handleBulkSave = async () => {
        dispatch(appLoadStart());
        try {
            // Because we are managing the whole tree, we can just clear existing and bulk insert
            // or upsert. But since some might be deleted, an upsert alone won't delete.
            // Safer way: clear table and bulk insert

            const { error: deleteError } = await supabase.from('chat_nodes').delete().neq('id', 'this-is-a-hack-to-delete-all'); // deletes all rows
            if (deleteError) {
                // If the hack fails, try deleting by finding all IDs
                const existingIds = Object.keys(globalChatNodes);
                if (existingIds.length > 0) {
                    await supabase.from('chat_nodes').delete().in('id', existingIds);
                }
            }

            const insertPayload = Object.values(localNodes).map(n => ({
                id: n.id,
                text: n.text,
                options: n.options
            }));

            if (insertPayload.length > 0) {
                const { error: insertError } = await supabase.from('chat_nodes').insert(insertPayload);
                if (insertError) throw insertError;
            }

            // Deep copy to prevent Redux from freezing our local state if we keep editing
            dispatch(setChatNodes(JSON.parse(JSON.stringify(localNodes))));
            dispatch(setUnsavedChanges(false));
            toast.success("Chat configuration saved successfully!");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save changes.");
        } finally {
            dispatch(appLoadStop());
        }
    };

    const nodeIds = Object.keys(localNodes);
    const sortedNodesArray = Object.values(localNodes).sort((a, b) => {
        if (a.id === 'root') return -1;
        if (b.id === 'root') return 1;
        return a.id.localeCompare(b.id);
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Chat Support Config</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the automated chat support node tree</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    {unsavedChanges && (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-sm font-medium animate-pulse">
                            <FiAlertTriangle /> Pending Save
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setEditingNode(null);
                            setShowNodeModal(true);
                        }}
                        className="bg-white border border-[#6F3DCB] text-[#6F3DCB] hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <FiPlus /> Add New Node
                    </button>
                    <button
                        onClick={handleBulkSave}
                        disabled={!unsavedChanges}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-white ${unsavedChanges ? "bg-[#6F3DCB] hover:bg-primary-700 shadow-md" : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <FiSave /> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNodesArray.map((node) => (
                    <div key={node.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                            <span className="bg-primary-50 text-[#6F3DCB] font-bold text-xs px-2 py-1 rounded">
                                ID: {node.id}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setEditingNode(node);
                                        setShowNodeModal(true);
                                    }}
                                    className="text-gray-400 hover:text-[#6F3DCB]"
                                >
                                    <FiEdit2 />
                                </button>
                                {node.id !== "root" && (
                                    <button
                                        onClick={() => handleDeleteNodeRequest(node.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg flex-1">
                            {node.text}
                        </p>

                        <div className="border-t border-gray-100 pt-4 mt-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Options ({node.options.length})</h4>
                                <button
                                    onClick={() => {
                                        setTargetNodeId(node.id);
                                        setShowOptionModal(true);
                                    }}
                                    className="text-[#6F3DCB] hover:text-primary-700 text-xs font-medium flex items-center"
                                >
                                    <FiPlus className="mr-1" /> Add Option
                                </button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {node.options.map((opt, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border border-gray-100 rounded p-2">
                                        <div className="truncate pr-2">
                                            <span className="font-medium text-gray-800">{opt.label}</span>
                                            <span className="text-xs text-gray-400 ml-2">→ {opt.nextNode}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteOptionRequest(node.id, idx)}
                                            className="text-red-400 hover:text-red-600 shrink-0"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {node.options.length === 0 && (
                                    <div className="text-xs text-gray-400 italic">No options. Conversation ends here.</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <ConfirmModal
                modalProps={{
                    visible: showConfirm,
                    hide: () => setShowConfirm(false),
                    data: confirmData
                }}
            />

            {showNodeModal && (
                <NodeFormModal
                    initialData={editingNode}
                    existingIds={nodeIds}
                    onClose={() => setShowNodeModal(false)}
                    onSave={handleSaveNode}
                />
            )}

            {showOptionModal && (
                <OptionFormModal
                    existingIds={nodeIds}
                    onClose={() => setShowOptionModal(false)}
                    onSave={(opt) => handleSaveOption(targetNodeId, opt)}
                />
            )}
        </div>
    );
}
