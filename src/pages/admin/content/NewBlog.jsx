import React, { useEffect, useRef, useState } from "react";
import { data, Link, useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import ErrorMsg1 from "../components/ErrorMsg1";
import { toast } from "react-toastify";
import { FaMinus } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { cloudinaryUpload, getPublicUrl, uploadAsset } from "../../../lib/requestApi";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import ProfileImg from "../components/ProfileImg";
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE_IMAGE = 2 * 1024 * 1024
const MAX_FILE_SIZE_PDF = 10 * 1024 * 1024

function validateFile(file, type) {
    if (!(file instanceof File)) {
        return { valid: false, error: "You must select a file" };
    }

    const allowedTypes = 
        type === 'cover_img'
        ?
            [
                "image/png",
                "image/jpeg",
                "image/jpg",
            ]
        :
            [
                "application/pdf",
            ]

    const isAllowed =
        allowedTypes.some((type) =>
            type.endsWith("/") ? file.type.startsWith(type) : file.type === type
        );

    if (!isAllowed) {
        return {
            valid: false,
            error: `Only ${type === 'cover_img' ? 'images' : 'PDFs'} are allowed`
        };
    }

    const MAX_FILE_SIZE = type === 'cover_img' ? MAX_FILE_SIZE_IMAGE : MAX_FILE_SIZE_PDF

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `File must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)} MB` };
    }

    return { valid: true, error: null };
}


function NewBlog() {
    const dispatch = useDispatch()

    const { state } = useLocation()
    const initialState = state?.article || {
        title: '', category: '', url: '', brief: '', cover_img: ''
    }

    const articleFileRef = useRef(null)
    const coverImgRef = useRef(null)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [urlInput, setUrlInput] = useState({
        file: null, preview: initialState?.url
    })
    const [coverImgInput, setCoverImgInput] = useState({
        file: null, preview: initialState?.cover_img
    })

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if (isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if (isLoading && data) {
            const { type, requestInfo } = data

            if (type === 'createArticle') {
                createArticle({ requestInfo })
            }
        }
    }, [apiReqs])

    const createArticle = async ({ requestInfo }) => {
        try {

            let error = null

            if (state?.article) {
                const { error: updateError } = await supabase
                    .from('articles')
                    .update(requestInfo)
                    .eq('id', state?.article?.id)

                error = updateError

            } else {
                const { error: createError } = await supabase
                    .from("articles")
                    .insert(requestInfo)

                error = createError
            }

            if (error) {
                console.warn(error)
                throw new Error()
            }

            setApiReqs({ isLoading: false, errorMsg: null, data: null })

            toast.success(`Article ${state?.article ? 'editted' : 'uploaded!'}`)

        } catch (error) {
            console.warn(error)
            return createArticleError({ errorMsg: 'Something went wrong! Try again.' })
        }
    }
    const createArticleError = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, errorMsg, data: null })
        toast.error(errorMsg)

        return
    }

    const uploadFiles = async ({ requestBody }) => {
        try {

            const { url, cover_img } = requestBody

            if(!url || !cover_img) throw new Error();

            const assets = [{ file: url, ext: 'pdf' }, { file: cover_img, ext: 'png' }]
            const paths = []

            for(let i = 0; i < assets.length; i++){
                const { file, ext } = assets[i]

                const id = uuidv4()

                const { filePath } = await uploadAsset({ file, id, bucket_name: 'articles', ext })

                if(!filePath) throw new Error();

                paths.push(filePath)
            }

            initiateCreate({ requestBody, url: paths[0], cover_img: paths[1] })

            return;

        } catch (error) {
            console.log(error)
            return createArticleError({ errorMsg: 'Error uploading article' })
        }
    }

    const initiateCreate = ({ requestBody, url, cover_img }) => {
        setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'createArticle',
                requestInfo: {
                    ...requestBody,
                    url,
                    cover_img
                }
            }
        })
    }

    return (
        <div className="pt-6 w-full min-h-screen ">
            <PathHeader
                paths={[
                    { text: 'Blog' },
                    state?.article
                        ?
                        { text: `Edit article: ${state?.article?.title}` }
                        :
                        { text: 'Create article' },
                ]}
            />

            {/* create community title */}
            <div className="mb-4 flex items-center gap-1">
                <div
                    className="text-lg sm:text-xl font-bold"
                >
                    Create Article
                </div>
            </div>

            {/* community body wrapper */}
            <div className="bg-white rounded-xl mb-8 p-4 2xl:w-6xl 2xl:mx-auto">
                <Formik
                    validationSchema={yup.object().shape({
                        title: yup.string().required("Title is required"),
                        brief: yup.string().required("Brief is required"),
                        category: yup.string().required("Category is required"),
                    })}
                    initialValues={{
                        title: initialState?.title,
                        brief: initialState?.brief,
                        category: initialState?.category,
                    }}
                    onSubmit={(values, { resetForm }) => {
                        setApiReqs({ isLoading: true, errorMsg: null })

                        // resetForm()

                        const requestBody = {
                            ...values,
                            url: urlInput?.file,
                            cover_img: coverImgInput?.file
                        }

                        if (urlInput?.file) {
                            return uploadFiles({ requestBody })
                        }

                        initiateCreate({ requestBody })
                    }}
                >
                    {({ values, isValid, dirty, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Article title
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                    placeholder="Enter article title"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    name="title"
                                />
                                <ErrorMessage name="title">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Brief
                                </label>
                                <textarea
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                    placeholder="Short brief on the article..."
                                    rows={3}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.brief}
                                    name="brief"
                                />
                                <ErrorMessage name="brief">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.category}
                                    name="category"
                                >
                                    <option value="" selected disabled>Select category</option>
                                    <option value="informative">Informative</option>
                                    <option value="education">Education</option>
                                </select>

                                <ErrorMessage name="category">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Cover image
                                </label>

                                {coverImgInput?.preview && (
                                    <>
                                        <img 
                                            src={coverImgInput?.preview}
                                            className="rounded-lg mb-2 max-w-4/5"
                                            style={{                                                
                                                maxHeight: '800px'
                                            }}
                                            alt="article-cover-img"
                                        />
                                    </>
                                )}

                                <div onClick={() => coverImgRef?.current?.click()} className="flex flex-col items-center gap-2 border border-dotted border-gray-200 cursor-pointer rounded-lg p-4">
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
                                        ref={coverImgRef}
                                        type="file"
                                        // accept="image/png, img/jpeg"
                                        className="hidden"
                                        onChange={e => {
                                            const file = e.currentTarget.files?.[0] ?? null

                                            if (!file) return;

                                            const { valid, error } = validateFile(file, 'cover_img')

                                            if (!valid) {
                                                const errorMsg = error || 'Invalid file'
                                                toast.error(errorMsg)

                                                return;
                                            }

                                            if (file) {
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                    // reader.result is a base64 data-URL
                                                    setCoverImgInput({ file, preview: reader.result })
                                                }
                                                reader.readAsDataURL(file)

                                            }
                                        }}
                                    />
                                    <p className=" text-(--primary-500) rounded text-xs">
                                        Upload file
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Article document
                                </label>

                                {urlInput?.preview && (
                                    <>
                                        <a target="_blank" className="text-xs text-blue-300" style={{ textDecorationLine: 'underline', fontStyle: 'italic' }} href={urlInput.preview} download={state?.article?.title || urlInput?.file?.name || 'Article.pdf'}>
                                            Article upload
                                        </a>
                                    </>
                                )}

                                <div onClick={() => articleFileRef?.current?.click()} className="flex flex-col items-center gap-2 border border-dotted border-gray-200 cursor-pointer rounded-lg p-4">
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
                                        ref={articleFileRef}
                                        type="file"
                                        className="hidden"
                                        onChange={e => {
                                            const file = e.currentTarget.files?.[0] ?? null

                                            if (!file) return;

                                            const { valid, error } = validateFile(file, "url")

                                            if (!valid) {
                                                const errorMsg = error || 'Invalid file'
                                                toast.error(errorMsg)

                                                return;
                                            }

                                            if (file) {
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                    // reader.result is a base64 data-URL
                                                    setUrlInput({ file, preview: reader.result })
                                                }
                                                reader.readAsDataURL(file)

                                            }
                                        }}
                                    />
                                    <p className=" text-(--primary-500) rounded text-xs">
                                        Upload file
                                    </p>
                                </div>
                            </div>                            
                            <div className="flex gap-2 mt-6 justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!(isValid && dirty) || !(urlInput?.preview) ? true : false}
                                    type="submit"
                                    className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm"
                                    style={{
                                        opacity: !(isValid && dirty) || !(urlInput?.preview) ? 0.5 : 1
                                    }}
                                >
                                    { state?.article ? 'Edit' : 'Create'} Article                                
                                </button>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default NewBlog;
