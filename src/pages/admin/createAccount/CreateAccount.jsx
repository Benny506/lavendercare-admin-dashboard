import React, { useEffect, useState } from "react";
import banner from "../components/ui/authBanner.svg";
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { onRequestApi } from "../../../lib/requestApi";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";

function CreateAccount() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })

  useEffect(() => {
    const { data, isLoading } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if(isLoading && data){
      const { type, requestInfo } = data

      if(type === 'createAdmin'){
        onRequestApi({
          requestInfo,
          successCallBack: createAdminSuccess,
          failureCallback: createAdminFailure
        })
      }
    }
  }, [apiReqs])

  const createAdminSuccess = ({ result }) => {
    try {

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      navigate("/", { replace: true })

      toast.info("Account created. Login to access your dashboard")

      return;
      
    } catch (error) {
      console.log(error)
      return createAdminFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const createAdminFailure = ({ realErrorMsg }) => {
    const errorMsg = realErrorMsg || 'Either email is already an admin, or is not invited or an unexpected error occured'

    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

  return (
    <div className="w-full h-screen lg:flex lg:items-center">
      <img
        src={banner}
        className="hidden lg:block h-full object-cover lg:w-[50%]"
        alt=""
      />

      <div className="flex  flex-col h-screen lg:h-auto justify-center gap-6 mx-auto">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl lg:text-4xl font-bold">Create Admin Account</h2>
          <p className="text-(--gray-500) w-[382px] mx-auto text-sm sm:text-base px-3">
            INVITES ONLY
          </p>
        </div>

        <Formik
          validationSchema={yup.object().shape({
            email: yup.string().email("Must be a valid email address").required("Email is required"),
            username: yup.string().required("Username is required"),
            password: yup
              .string()
              .required('Password is required')
              .min(8, 'Password must be at least 8 characters')
              .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
              .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
              .matches(/\d/, 'Password must contain at least one number')
              .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol'),
          })}
          initialValues={{
            email: '', password: '', username: ''
          }}
          onSubmit={values => {
            setApiReqs({
              isLoading: true,
              errorMsg: null,
              data: {
                type: 'createAdmin',
                requestInfo: {
                  url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/register-admin',
                  method: 'POST',
                  data: values
                }
              }
            })
          }}
        >
          {({ isValid, dirty, handleBlur, handleChange, handleSubmit, values }) => (
            <div className="lg:px-0 px-5">
              <div className="flex justify-center flex-col gap-6">
                <div htmlFor="email_address" className="flex flex-col gap-1">
                  <p>Email Address</p>
                  <input
                    className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                    type="email"
                    required
                    id="email_address"
                    placeholder="The email which you received the invite"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="email">
                    { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                  </ErrorMessage>
                </div>

                <div htmlFor="email_address" className="flex flex-col gap-1">
                  <p>Username</p>
                  <input
                    className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                    required
                    placeholder="Your desired username (Cannot be changed)"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="username">
                    { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                  </ErrorMessage>
                </div>                

                <div htmlFor="password" className="flex flex-col gap-1">
                  <p>Password</p>
                  <div className="flex items-center gap-4 px-[14px] border border-(--grey-200) rounded-md">
                    <input
                      className="py-[10px] w-full"
                      type={passwordVisible ? "text" : "password"}
                      required
                      id="password"
                      placeholder="Type your password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}                    
                    />
                    {
                      passwordVisible
                        ?
                        <FiEyeOff className="cursor-pointer text-grey-800" size={16} onClick={togglePasswordVisibility} />
                        :
                        <FiEye className="cursor-pointer text-grey-800" size={16} onClick={togglePasswordVisibility} />
                    }                  
                  </div>
                  <ErrorMessage name="password">
                    { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                  </ErrorMessage>
                </div>
              </div>

              <div className="py-8 w-full">
                <button
                  type="submit"
                  className="py-4 w-full hover:cursor-pointer text-white rounded-full bg-(--primary-500)"
                  onClick={handleSubmit}
                  style={{
                    opacity: !(isValid && dirty) ? 0.5 : 1
                  }}
                  disabled={!(isValid && dirty) ? true : false}
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateAccount;
