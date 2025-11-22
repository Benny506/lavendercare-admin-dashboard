import { useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import useApiReqs from "../../../../hooks/useApiReqs";
import ZeroItems from "../../components/ZeroItems";
import Modal from "../../components/ui/Modal";

export default function BlogCategoryMdal({ modalProps, categories=[], setCategories }) {

    const { addBlogCategory, deleteBlogCategory } = useApiReqs()

    const [categoryName, setCategoryName] = useState('')

    if (!modalProps || !categories || !setCategories) return <></>

    const { visible, hide } = modalProps

    const onHide = () => {
        setCategoryName('')
        hide && hide()
    }

    const handleAddCategory = () => {
        const cat = categoryName?.toLowerCase().trim()

        const existingNames = categories?.map(c => c?.name?.toLowerCase())

        if(existingNames?.includes(cat)) return toast.info("Category name already exists");

        addBlogCategory({
            callBack: ({ newCategory }) => {
                setCategories([newCategory, ...(categories || [])])
                setCategoryName('')
            },
            name: cat
        })
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Blog Categories
                </h2>
            </div>

            <div className="flex flex-col space-y-2 w-full mb-5">
                <label className="text-gray-700 font-medium">Category name</label>
                <input
                    type="text"
                    placeholder="..."
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex">
                <button
                    className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 font-semibold transition"
                    onClick={handleAddCategory}
                >  
                    Add
                </button>
            </div>

            <div className="mb-7" />
            <hr />
            <div className="mb-7" />

            <h2 className="text-md font-semibold text-gray-800 mb-4">
                Existing categories
            </h2>

            {
                (categories || [])?.length > 0
                    ?
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">S/N</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                (categories)?.map((cat, i) => {
                                    const { name, id } = cat                                    

                                    const handleDeleteCategory = () => {
                                        deleteBlogCategory({
                                            callBack: ({ deleted_category_id }) => {
                                                const updatedCategories = (categories || [])?.filter(c => c?.id !== deleted_category_id)
                                                setCategories(updatedCategories)
                                            },
                                            category_id: id
                                        })
                                    }

                                    return (
                                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{i+1}</td>
                                            <td className="py-3 px-4">{name}</td>
                                            <td className="py-3 px-4 text-center">
                                                <MdDelete onClick={handleDeleteCategory} color="red" size={20} className="cursor-pointer" />
                                            </td>                                            
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <div className="flex items-center justify-center">
                        <ZeroItems
                            zeroText={"No blog categories added!"}
                        />
                    </div>
            }
        </Modal>
    )
}