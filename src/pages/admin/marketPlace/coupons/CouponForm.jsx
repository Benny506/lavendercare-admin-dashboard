import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import useApiReqs from "../../../../hooks/useApiReqs";
import PathHeader from "../../components/PathHeader";

const BRAND = "#703DCB"; // Updated brand color

const couponSchema = Yup.object().shape({
    code: Yup.string().required("Coupon code is required"),
    coupon_for: Yup.string().required("This Coupon code applies to?"),
    type: Yup.string()
        .oneOf(["percentage", "fixed"])
        .required("Type is required"),
    discount_value: Yup.number()
        .positive("Must be positive")
        .required("Discount value is required"),
    max_discount_amount: Yup.number().positive("Must be positive").nullable(),
    min_order_amount: Yup.number().min(0).nullable(),
    usage_limit: Yup.number().min(1).nullable(),
    expires_at: Yup.date().nullable(),
});

export default function CouponForm() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { createCoupon, editCoupon } = useApiReqs();

    const defaultValues = {
        code: state?.code || "",
        type: state?.type || "fixed",
        discount_value: state?.discount_value || "",
        usage_limit: state?.usage_limit || "",
        expires_at: state?.expires_at || "",
        is_active: state?.is_active || true,
        coupon_for: state?.coupon_for || ""
    };

    const isEdit = !!(state?.id && state?.code && state?.type);

    return (
        <div className="pt-6 w-full flex">
            <div className="flex-1 w-full flex flex-col">
                <PathHeader
                    paths={[
                        { type: 'text', text: 'Coupons' },
                        { type: 'text', text: isEdit ? `Edit: ${state?.code}` : "Add" },
                    ]}
                />

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        {isEdit ? `Edit Coupon: ${state.code}` : "Create Coupon"}
                    </h2>
                </div>

                {/* Form */}
                <div className="bg-white shadow-sm rounded-lg p-4 mt-2">
                    <Formik
                        enableReinitialize
                        initialValues={defaultValues}
                        validationSchema={couponSchema}
                        onSubmit={(values) => {
                            const payload = {
                                ...values,
                                expires_at: values?.expires_at || null,
                                usage_limit: values?.usage_limit || null,
                            };

                            if (isEdit) {
                                editCoupon({
                                    callBack: () => navigate("/admin/marketplace/coupons"),
                                    requestInfo: payload,
                                    coupon_id: state?.id,
                                });
                                return;
                            }

                            createCoupon({ callBack: () => { }, requestInfo: payload });
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="space-y-6">
                                {/* Row 1: Code & Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon Code
                                        </label>
                                        <Field
                                            name="code"
                                            placeholder="Enter unique coupon code"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                        <ErrorMessage
                                            name="code"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type
                                        </label>
                                        <Field
                                            as="select"
                                            name="type"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        >
                                            <option value="fixed">Fixed Amount</option>
                                            <option value="percentage">Percentage</option>
                                        </Field>
                                        <ErrorMessage
                                            name="type"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Discount Value & Usage Limit */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Value
                                        </label>
                                        <Field
                                            type="number"
                                            name="discount_value"
                                            placeholder="Enter discount amount or percentage"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                        <ErrorMessage
                                            name="discount_value"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Usage Limit
                                        </label>
                                        <Field
                                            type="number"
                                            name="usage_limit"
                                            placeholder="Optional"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                        <ErrorMessage
                                            name="usage_limit"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Expiry Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Applies for
                                        </label>
                                        <Field
                                            as="select"
                                            name="coupon_for"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        >
                                            <option value="">Select one</option>
                                            <option value="products">Products</option>
                                            <option value="bookings">Bookings</option>
                                        </Field>
                                        <ErrorMessage
                                            name="coupon_for"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Date
                                        </label>
                                        <Field
                                            type="date"
                                            name="expires_at"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                        <ErrorMessage
                                            name="expires_at"
                                            component="div"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Active Checkbox */}
                                <div className="flex items-center gap-2">
                                    <Field
                                        type="checkbox"
                                        name="is_active"
                                        className="w-4 h-4 text-purple-700 border-gray-300 rounded focus:ring-2 focus:ring-purple-600"
                                    />
                                    <label className="text-gray-700 text-sm font-medium">
                                        Active
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    style={{ backgroundColor: BRAND }}
                                    className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
                                >
                                    Save Coupon
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
