import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const ProductCardSmall = ({ product, showDelete = true, onDelete }) => {
  if (!product) return <></>;

  const product_images = product?.product_images?.map((imgPath) =>
    getPublicImageUrl({ path: imgPath, bucket_name: "admin_products" })
  );

  const { product_name, categories } = product;

  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product_images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product_images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-500 ease-in-out">
      
      {/* DELETE BUTTON */}
      {showDelete && (
        <button
          onClick={() => onDelete?.(product)}
          className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          <FaTrash className="text-xs" />
        </button>
      )}

      <div className="relative">
        <img
          src={product_images[currentImage]}
          alt={product_name}
          className="w-full h-50 object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />

        {product_images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 transition"
            >
              <FaArrowLeft className="text-xs" />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 transition"
            >
              <FaArrowRight className="text-xs" />
            </button>
          </>
        )}
      </div>

      <div className="p-2 text-center">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {product_name}
        </h3>

        {categories?.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full transition-colors duration-300 hover:bg-blue-200"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardSmall;
