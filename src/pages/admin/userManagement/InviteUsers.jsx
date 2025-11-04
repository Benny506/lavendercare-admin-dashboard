import { ErrorMessage, Formik } from "formik";
import PathHeader from "../components/PathHeader";
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { adminRoles } from "../../../lib/roles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { requestApi } from "../../../lib/requestApi";
import { sendEmail } from "../../../lib/email";

function InviteUsers() {
  const dispatch = useDispatch()

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if(isLoading && data){
      const { type, requestInfo } = data

      if (type === 'inviteUser'){
        inviteUser({ requestInfo })
      }
    }
  }, [apiReqs])

  const inviteUser = async ({ requestInfo }) => {
    try {

      const { error } = await supabase
        .from('admin_invitations')
        .upsert(requestInfo, { onConflict: 'email' })

      if(error){
        console.log(error)
        throw new Error()
      }

      await sendEmail({
        to_email: requestInfo?.email,
        data: {
          receiving_email: requestInfo?.email
        },
        subject: 'Care-coordinator Invitation',
        template_id: '351ndgwy98qlzqx8'
      })

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      toast.success("Invitation sent!")

      return;
      
    } catch (error) {
      console.log(error)
      return inviteUserFailure({ errorMsg: 'Error sending user invite' })
    }
  }
  const inviteUserFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  return (
    // breadcrumb navigation
    <div className="pt-6 w-full pb-5">
      <PathHeader 
        paths={[
          { text: 'User Management' },
          { text: 'Invite Users' },
        ]}
      />

      <div className="bg-white p-4 rounded-[16px]">
        <div className="w-full max-w-[425px] mx-auto">
          <h2 className="text-[24px] font-semibold py-6">Invite Users</h2>
          <Formik
            validationSchema={yup.object().shape({
              email: yup.string().email("Must be a valid email address").required("Email address is required"),
              role: yup.string().required("Admin role is required")
            })}
            initialValues={{
              email: '', role: ''
            }}
            onSubmit={values => {
              setApiReqs({
                isLoading: true,
                errorMsg: null,
                data: {
                  type: 'inviteUser',
                  requestInfo: values
                }
              })
            }}
          >
            {({ values, isValid, dirty, handleBlur, handleChange, handleSubmit }) => (
              <div className="pb-10">
                <div className="flex flex-col gap-4">
                  <label>
                    <p className="text-sm text-gray-600 pb-1">Email Address</p>
                    <input
                      type="text"
                      className="placeholder:text-gray-600 py-[10px] px-4 rounded-md border-gray-300 w-full border"
                      placeholder="Type your email address"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="email">
                      { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                    </ErrorMessage>
                  </label>

                  <label className="relative">
                    <p className="text-sm text-gray-600 pb-1">Role</p>
                    <select
                      className="placeholder:text-gray-600 py-[10px] h-[44px] px-4 rounded-md border-gray-300 w-full border"
                      value={values.role}
                      name="role"
                      onChange={handleChange}
                      onBlur={handleBlur}                      
                    >
                      <option value={''} selected>Select one</option>
                      {
                        adminRoles.map((r, i) => {
                          return (
                            <option 
                              key={i}
                              value={r}
                            >
                              { r }                           
                            </option>
                          )
                        })
                      }
                    </select>
                    <ErrorMessage name="role">
                      { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                    </ErrorMessage>                    
                  </label>
                  <p className="text-[16px] leading-0 text-gray-400 text-right">+ Create Admin role</p>
                </div>

                {/* invite user buttons */}
                <div className="flex pt-8 flex-col md:flex-row gap-4 md:gap-6 items-center">
                    {/* <button className="w-full bg-(--primary-50) text-(--primary-500) font-semibold py-3 rounded-full">
                        Cancel
                    </button> */}
                    <button 
                      onClick={handleSubmit}
                      disabled={!(isValid && dirty) ? true : false}
                      style={{
                        opacity: !(isValid && dirty) ? 0.5 : 1
                      }}
                      className="w-full bg-(--primary-500) text-white py-3 font-semibold rounded-full"
                    >
                        Send Invite
                    </button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default InviteUsers;
