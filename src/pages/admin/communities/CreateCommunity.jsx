import React, { useEffect, useRef, useState } from "react";
import { data, Link, useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { toast } from "react-toastify";
import { FaMinus } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { cloudinaryUpload } from "../../../lib/requestApi";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import ProfileImg from "../components/ProfileImg";

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = [
  /^image\//,
  // 'application/pdf',
  // 'application/msword',
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function validateImageFile(file) {
  if (!(file instanceof File)) {
    return { valid: false, error: "You must select a file" };
  }

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Only image files are allowed" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File must be smaller than 5 MB" };
  }

  return { valid: true, error: null };
}

function CreateCommunity() {
  const dispatch = useDispatch()

  const { state } = useLocation()
  const initialState = state?.community || {
    name: '', slug: '', about: '', visibility: 'public', group_type: '',
    rules: [], profile_img: ''
  }

  const coverImgFileInput = useRef(null)

  const [rules, setRules] = useState(initialState?.rules)
  const [ruleInput, setRuleInput] = useState('')
  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [profileImgPreview, setProfileImgPreview] = useState({
    file: null, preview: null
  })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'createCommunity') {
        createCommunity({ requestInfo })
      }
    }
  }, [apiReqs])

  const createCommunity = async ({ requestInfo }) => {
    try {

      let error = null

      if (state?.community) {
        const { error: updateError } = await supabase
          .from('community')
          .update(requestInfo)
          .eq('id', state?.community?.id)

        error = updateError

      } else {
        const { error: createError } = await supabase
          .from("community")
          .insert(requestInfo)

        error = createError
      }

      if (error) {
        console.warn(error)
        throw new Error()
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      toast.success("Community created!")

      setRules([])
      setRuleInput('')

    } catch (error) {
      console.warn(error)
      return createCommunityFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const createCommunityFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return
  }

  const handleAddRule = () => {
    if (!ruleInput) {
      toast.info("Type in a rule")
      return
    }

    setRuleInput('')
    setRules(prev => ([...prev, ruleInput]))
  }

  const uploadFiles = async ({ files, requestBody }) => {
    try {

      const { result } = await cloudinaryUpload({ files })

      if (!result) throw new Error();

      const profile_img = result[0]?.secure_url

      if (!profile_img) throw new Error();

      toast.success("Cover image uploaded")

      initiateCreate({ requestBody, profile_img })

      return;

    } catch (error) {
      console.log(error)
      return createCommunityFailure({ errorMsg: 'Error uploading community cover image' })
    }
  }

  const initiateCreate = ({ requestBody, profile_img }) => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'createCommunity',
        requestInfo: {
          ...requestBody,
          profile_img
        }
      }
    })
  }

  return (
    <div className="pt-6 w-full">
      <PathHeader
        paths={[
          { text: 'Communities' },
          state?.community
            ?
            { text: `Edit community: ${state?.community?.name}` }
            :
            { text: 'Create community' },
        ]}
      />

      {/* create community title */}
      <div className="mb-4 flex items-center gap-1">
        <div
          className="text-lg sm:text-xl font-bold"
        >
          Create Community
        </div>
      </div>

      {/* community body wrapper */}
      <div className="bg-white rounded-xl mb-8 p-4 2xl:w-6xl 2xl:mx-auto">
        <Formik
          validationSchema={yup.object().shape({
            name: yup.string().required("Name is required"),
            slug: yup.string().required("Slug is required"),
            about: yup.string().required("About is required"),
            group_type: yup.string().required("Group type is required"),
          })}
          initialValues={{
            name: initialState?.name,
            slug: initialState?.slug,
            about: initialState?.about,
            visibility: 'public',
            group_type: initialState?.group_type,
          }}
          onSubmit={(values, { resetForm }) => {
            setApiReqs({ isLoading: true, errorMsg: null })

            resetForm()

            const requestBody = {
              ...values,
              rules
            }

            if (profileImgPreview?.file) {
              return uploadFiles({ files: [profileImgPreview?.file], requestBody })
            }

            initiateCreate({ requestBody })
            r
          }}
        >
          {({ values, isValid, dirty, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="Enter community name"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  name="name"
                />
                <ErrorMessage name="name">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Handle / Slug
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="e.g. newmothers, lactation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.slug}
                  name="slug"
                />
                <ErrorMessage name="slug">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  About
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="Describe what this community is about..."
                  rows={3}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.about}
                  name="about"
                />
                <ErrorMessage name="about">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              {/* <div>
                <label className="block text-sm font-medium mb-1">Visibility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="Public"
                      className="accent-primary"
                      defaultChecked
                    />{" "}
                    Public
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="Private"
                      className="accent-primary"
                    />{" "}
                    Private
                  </label>
                </div>
              </div> */}
              <div>
                <label className="block text-sm font-medium mb-1">Group Type</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.group_type}
                  name="group_type"
                >
                  <option value="" selected disabled>Select group type</option>
                  <option value="support">Support</option>
                  <option value="education">Education</option>
                  <option value="local">Local</option>
                </select>

                <ErrorMessage name="group_type">
                  {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                </ErrorMessage>
              </div>
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Cover Image
                </label>
                {
                  (profileImgPreview?.preview || initialState.profile_img)
                  &&
                  <div style={{
                    position: 'relative'
                  }}>
                    <img
                      src={profileImgPreview?.preview || initialState.profile_img}
                      width={'175px'} height={'135px'}
                    />

                    {
                      profileImgPreview?.preview
                      &&
                      <div onClick={() => setProfileImgPreview({ file: null, preview: null })} className="cursor-pointer absolute -bottom-1 -left-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <MdCancel className="w-4 h-4 text-white" />
                      </div>
                    }
                  </div>
                }
                <div onClick={() => coverImgFileInput?.current?.click()} className="mt-3 flex flex-col items-center gap-2 border border-dotted border-gray-200 cursor-pointer rounded-lg p-4">
                  <span className="text-xs text-gray-400">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24 6V30"
                        stroke="#4D4D4D"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M34 16L24 6L14 16"
                        stroke="#4D4D4D"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                        stroke="#4D4D4D"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    ref={coverImgFileInput}
                    type="file"
                    className="hidden"
                    onChange={e => {
                      const file = e.currentTarget.files?.[0] ?? null

                      if (!file) return;

                      const { valid, error } = validateImageFile(file)

                      if (!valid) {
                        const errorMsg = error || 'Invalid file'
                        toast.error(errorMsg)

                        return;
                      }

                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          // reader.result is a base64 data-URL
                          setProfileImgPreview({ file, preview: reader.result })
                        }
                        reader.readAsDataURL(file)

                      }
                    }}
                  />
                  <p className=" text-(--primary-500) rounded text-xs">
                    Upload file
                  </p>
                  <span className="text-xs pt-2 text-gray-400">
                    Recommended: 1200x400px, JPG or PNG
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Community Rules
                </label>
                {
                  rules?.length === 0 &&
                  <ErrorMsg1 errorMsg={"Add at least one"} />
                }
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder="Type a single rule..."
                  rows={2}
                  value={ruleInput}
                  onChange={e => setRuleInput(e.target.value)}
                />
                <div>
                  <span className="text-sm text-[#4D4D4D]">
                    Common rules: No spam, respect privacy, be kind, etc.
                  </span>
                </div>
                <button
                  onClick={handleAddRule}
                  className="cursor-pointer py-2 px-4 rounded-lg bg-gray-700 text-white font-medium text-xs sm:text-sm"
                >
                  Add
                </button>
                <div className="space-y-2 mt-3">
                  {rules?.map((r, i) => {
                    const handleRemoveRule = () =>
                      setRules((prev) => prev.filter((rule) => rule !== r));

                    return (
                      <div
                        key={i}
                        className="group relative flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        {/* Accent */}
                        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#703dcb]" />

                        {/* Rule text */}
                        <p className="text-sm text-gray-800 leading-relaxed pr-8">
                          {r}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={handleRemoveRule}
                          className="absolute right-3 top-3 transition text-gray-400 hover:text-red-500"
                        >
                          <MdCancel size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
              <div className="flex gap-2 mt-6 justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={(rules?.length === 0) || !(isValid && dirty) ? true : false}
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm"
                  style={{
                    opacity: (rules?.length === 0) || !(isValid && dirty) ? 0.5 : 1
                  }}
                >
                  Create Community
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateCommunity;
