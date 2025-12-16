export default function DisplayMedia({
    item = null,
    index = null,
    removeItem = () => {}
}) {

    if(!item) return <></>

    return (
        <div
            className="relative border rounded-lg p-2 bg-gray-50"
        >
            {/* Remove */}
            <button
                onClick={() => removeItem(index)}
                className="mb-3 text-xs bg-red-500 text-white px-2 py-1 rounded"
            >
                ✕
            </button>

            {/* Preview */}
            {item.type === 'image' && (
                <img
                    src={item.preview}
                    alt=""
                    className="w-full h-32 object-cover rounded"
                />
            )}

            {item.type === 'video' && (
                <video
                    src={item.preview}
                    controls
                    className="w-full h-32 rounded"
                />
            )}

            {item.type === 'audio' && (
                <audio
                    src={item.preview}
                    controls
                    className="w-full"
                />
            )}

            {item.type === 'pdf' && (
                <div className="h-32 flex items-center justify-center text-sm text-gray-600 bg-white rounded">
                    📄 PDF available
                </div>
            )}

            <p className="mt-2 text-xs text-gray-500 capitalize">
                {item.type}
            </p>
        </div>
    )
}