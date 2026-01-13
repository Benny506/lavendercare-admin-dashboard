import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdClose } from "react-icons/md";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { sendEmail } from "../../../../lib/email";
import useApiReqs from "../../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";

const DeliveryAddrIssueModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch()

  const { fetchUserEmail } = useApiReqs()

  if (!isOpen) return null;

  const validationSchema = Yup.object({
    message: Yup.string()
      .required("Message is required"),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg w-full p-6 relative border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Address Issue Detected. Order-{order?.order_number}
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          You've noticed a potential issue with the delivery address for this order.
          Send the customer an message saying:. 💡
        </p>

        <Formik
          initialValues={{ message: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await fetchUserEmail({
              callBack: async ({ email }) => {
                dispatch(appLoadStart())

                const sent = await sendEmail({
                  // from_email: ought to be support email,
                  to_email: email,
                  subject: 'Order Address Issue',
                  data: {
                    message: values.message,
                    order_number: order?.order_number
                  },
                  template_id: 'zr6ke4n62y9lon12'
                })

                if(!sent.sent){
                  toast.error("Error sending email. Try again in a few minutes!")
                
                } else{
                  toast.success("Mail sent to customer")
                  onClose()
                }            

                dispatch(appLoadStop())
              },
              user_id: order?.user_id
            })
          }}
        >
          {({ handleSubmit, handleBlur, handleChange }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <textarea
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your message"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                  style={{ focusRingColor: "#703DCB", minHeight: '100px', minWidth: '100%' }}
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                onClick={handleSubmit}
              // className="w-full py-2 rounded-md text-white font-medium transition"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default DeliveryAddrIssueModal;
