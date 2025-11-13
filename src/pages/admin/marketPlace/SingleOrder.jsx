import { useState } from "react";
import { formatNumberWithCommas } from "../../../lib/utils";
import Carousel from "../components/ui/Carousel";
import { getPublicImageUrl } from "../../../lib/requestApi";
import { ProductVariantsDisplay } from "./ProductsVariantsDisplay";
// import ProductPreview from "../products/ProductPreview";

export default function SingleOrder({ visible, order = [] }) {
    const [previewedProduct, setPreviewedProduct] = useState(null);

    if (!order?.order_items) return null;

    return (
        <>
            {/* Collapse wrapper */}
            <div className={`${visible ? "block" : "hidden"} transition-all`}>
                <div className="flex flex-wrap -mx-1">
                    {order.order_items.map((item, idx) => {

                        const image_urls =
                            item?.product_info?.product_images?.map((imgPath) =>
                                getPublicImageUrl({ path: imgPath, bucket_name: "admin_products" })
                            );

                        const variants = item?.variant_info;
                        const selectedVariants = {};

                        return (
                            <div key={idx} className="w-full lg:w-1/2 px-1 mb-3">
                                <div className="bg-white shadow-lg rounded-lg p-3">
                                    <div className="flex flex-wrap items-center gap-5 mb-3">
                                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Carousel
                                                slides={image_urls?.map((url, i) => {
                                                    return {
                                                        src: url,
                                                        alt: `product-img-${i}`
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-2 font-bold text-gray-900">
                                                {item?.product_info?.product_name}
                                            </h4>
                                            <p className="mb-2 text-gray-500">Quantity: {item.quantity}</p>
                                            <div className="text-gray-900 font-semibold">
                                                {order?.currency}{" "}
                                                {formatNumberWithCommas({ value: item?.unit_price * item.quantity })}
                                            </div>
                                            <hr className="my-2 border-gray-200" />
                                            <div className="flex items-start justify-start flex-col">
                                                <ProductVariantsDisplay
                                                    variants={variants}
                                                    selectedVariants={selectedVariants}
                                                    showInfo={false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {/* <button
                                        onClick={() =>
                                            setPreviewedProduct({
                                                ...item?.product_info,
                                                image_urls: item?.product_info?.product_images?.map((imgPath) =>
                                                    getPublicImageUrl({ path: imgPath, bucket_name: "admin_products" })
                                                ),
                                            })
                                        }
                                        className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition"
                                        data-testid={`button-review-${order?.id}`}
                                    >
                                        Product Info
                                    </button> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/*
      <Modal show={previewedProduct} onHide={() => setPreviewedProduct(null)} size="xl" backdrop="static">
          <Modal.Body>
              <Modal.Header closeButton>
                  <Modal.Title className="fw-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      "{previewedProduct?.product_name}" Preview
                  </Modal.Title>
              </Modal.Header>

              <ProductPreview
                  _product={previewedProduct}
              />
          </Modal.Body>
      </Modal>
      */}
        </>
    );
}
