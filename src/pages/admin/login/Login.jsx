import React, { useEffect, useState } from "react";
import banner from "../components/ui/authBanner.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import { adminLogin } from "../../../database/dbInit";
import { getUserDetailsState, setUserDetails } from "../../../redux/slices/userDetailsSlice";
import { setAdminState } from "../../../redux/slices/adminState";
import { onRequestApi } from "../../../lib/requestApi";

function Login() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const roles = useSelector(state => getUserDetailsState(state).roles)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop())

    if (isLoading && data) {
      const { requestInfo, type } = data

      if (type === 'login') {
        login({ requestInfo })
      }
    }
  }, [apiReqs])

  const login = async ({ requestInfo }) => {
    try {

      const { data, errorMsg } = await adminLogin(requestInfo)

      if (errorMsg) {
        setApiReqs({ isLoading: false, data: null, errorMsg })
        toast.error(errorMsg)

        return;
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      const { profile, mothers, vendors, providers, user, session, permissions, allPermissions, roles } = data

      dispatch(setUserDetails({ profile, user, session, permissions, roles, allPermissions }))
      dispatch(setAdminState({ mothers, vendors, providers }))

      const permKeys = permissions?.map(p => p?.permission_key)

      if (permKeys?.length === 0) return toast.info("Access Denied!");     

      navigate("/admin/settings/general")      

    } catch (error) {
      console.log(error)
      return loginFailure({ errorMsg: 'Something went wrong! Try again' })
    }
  }
  const loginFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, data: null, errorMsg })
    toast.error(errorMsg)
  }

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

  const validationSchema = yup.object().shape({
    email: yup.string().email("Must be a valid email address").required("Email address is required"),
    password: yup.string().required("Password is required")
  })

  return (
    <div className="w-full h-screen lg:flex lg:items-center">
      <img
        src={banner}
        className="hidden lg:block h-full object-cover lg:w-[50%]"
        alt=""
      />

      <div className="flex  flex-col h-screen lg:h-auto justify-center gap-6 mx-auto">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl lg:text-4xl font-bold">Welcome to Admin</h2>
          <p className="caret-(--gray-50) text-sm sm:text-base px-3">
            You were invited to be an admin in lavernderCare
          </p>
        </div>

        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: '', password: ''
          }}
          onSubmit={(values) => {
            setApiReqs({
              isLoading: true,
              errorMsg: null,
              data: {
                type: 'login',
                requestInfo: values
              }
            })
          }}
        >
          {({ values, handleBlur, handleChange, isValid, dirty, handleSubmit }) => (
            <div className="lg:w-max px-[14px]">
              <div className="flex justify-center flex-col gap-6">
                <label htmlFor="email_address" className="flex flex-col gap-1">
                  <p>Email Address</p>
                  <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="py-[10px] w-full pl-[40px] pr-[14px] border border-(--grey-200) rounded-md"
                    type="email"
                    required
                    id="email_address"
                    placeholder="youremail@gmail.com"
                  />
                  <ErrorMessage name="email">
                    {err => <ErrorMsg1 errorMsg={err} />}
                  </ErrorMessage>
                </label>

                <label htmlFor="password" className="flex flex-col gap-1">
                  <p>Password</p>
                  <div className="w-full pr-[14px]  border border-(--grey-200) rounded-md flex items-center justify-between">
                    <input
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="py-[10px] pl-[14px] w-10/12"
                      type={passwordVisible ? "text" : "password"}
                      required
                      id="password"
                      placeholder="Type your password"
                    />

                    {
                      passwordVisible
                        ?
                        <FaRegEye color="#6F3DCB" size={20} className="cursor-pointer" onClick={togglePasswordVisibility} />
                        :
                        <FaRegEyeSlash color="#6F3DCB" size={20} className="cursor-pointer" onClick={togglePasswordVisibility} />
                    }
                  </div>
                  <ErrorMessage name="password">
                    {err => <ErrorMsg1 errorMsg={err} />}
                  </ErrorMessage>
                </label>
              </div>

              <div className="flex flex-col py-3 w-full gap-6">
                {/* <Link className="text-right text-(--gray-400)">Forgot passowrd?</Link> */}

                <button
                  disabled={!(isValid && dirty) ? true : false}
                  style={{
                    opacity: !(isValid && dirty) ? 0.5 : 1
                  }}
                  type="submit"
                  className="py-4 hover:cursor-pointer lg:px-[190px] text-white rounded-full bg-(--primary-500)"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
