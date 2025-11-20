import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const ProductCard = ({ product, handleSelectProduct = () => { } }) => {

    if (!product) return <></>

    const product_images = product?.product_images?.map(imgPath => getPublicImageUrl({ path: imgPath, bucket_name: 'admin_products' }))

    const { product_name, product_description, categories, isSelected } = product;

    const [currentImage, setCurrentImage] = useState(0);

    const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? product_images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImage((prev) => (prev === product_images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-500 ease-in-out">
            <div className="relative">
                <img
                    src={product_images[currentImage]}
                    alt={product_name}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                />
                {product_images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
                        >
                            <FaArrowRight />
                        </button>
                    </>
                )}
            </div>

            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product_name}</h2>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">{product_description}</p>

                <div className="p-4 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800">{product_name}</h2>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">{product_description}</p>

                    {categories?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {categories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full transition-colors duration-300 hover:bg-purple-200"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Select Button */}
                    {
                        isSelected
                            ?
                            <p className="text-gray-700 mt-4 text-center text-sm">
                                Already selected
                            </p>
                            :
                            <button
                                onClick={() => handleSelectProduct(product)}
                                className="cursor-pointer mt-4 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-300"
                            >
                                Select
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
