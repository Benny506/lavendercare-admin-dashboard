import Modal from "./ui/Modal";

export default function ConfirmModal({ modalProps, children }){

    if(!modalProps) return <></>

    const { visible, hide, data } = modalProps

    const handleYes = () => {
        if(data?.yesFunc){
            data?.yesFunc(data)
        }

        return hide && hide()
    }

    const handleCancel = () => {
        if(data?.noFunc){
            data?.noFunc(data)
        }

        return hide && hide()
    }

    return(
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-lg">{ data?.title || 'Delete' }</div>
            </div>

            <div className="text-sm text-gray-600 mb-6">
                { data?.msg || 'Are you sure. This action cannot be undone' }
            </div>

            {
                children
                &&
                    <div className="mb-6">
                        { children }
                    </div>
            }

            <div className="flex justify-end gap-2">
                <button
                    className="bg-gray-100 cursor-pointer px-4 py-2 rounded"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded"
                    onClick={handleYes}
                >
                    Yes
                </button>
            </div>           
        </Modal>
    )
}