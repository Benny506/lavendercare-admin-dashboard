import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { formatDate1 } from "../../../lib/utils";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { getPublicImageUrl, getPublicUrl } from "../../../lib/requestApi";

function BlogDetail() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { state } = useLocation()

  const article = state?.article

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [files, setFiles] = useState({ cover_img: null, url: null })

  useEffect(() => {
    if (!article) {
      navigate('/admin/content/blog')

    } else {  
      getUrl()
    }
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type } = data

      if (type === 'deleteArticle') {
        deleteArticle()
      }
    }
  }, [apiReqs])

  const getUrl = () => {
    try {

      const url = getPublicImageUrl({ path: article?.url, bucket_name: 'articles' })
      const cover_img = getPublicImageUrl({ path: article?.cover_img, bucket_name: 'articles' }) 

      if (!url || !cover_img) throw new Error();

      setFiles({ url, cover_img })

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      return;

    } catch (error) {
      console.log(error)
      return getUrlFailure({ errorMsg: 'Error getting file-url. Download is unavailable' })
    }
  }
  const getUrlFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const deleteArticle = async () => {
    try {

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq("id", article?.id)

      if (error) {
        console.warn(error)
        throw new Error()
      }

      setApiReqs({ isLoading: false, errorMsg: null, data: null })
      toast.success("Article deleted")
      dispatch(appLoadStop())

      navigate('/admin/content/blog')

    } catch (error) {
      console.warn(error)
      return deleteArticleFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const deleteArticleFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return
  }

  if (!article) return <></>

  const initiateArticleDeletion = () => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'deleteArticle'
      }
    })
  }

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* breadcrumb */}
      <PathHeader
        paths={[
          { text: 'Content' },
          { text: 'Blog Management' },
          { text: article?.title },
        ]}
      />

      {/* blog title */}
      <div className="flex item-center justify-between py-2 flex-wrap gap-2">
        <h2 className="text-lg h-max sm:text-xl font-bold">Blog Management</h2>

        <div className="flex gap-2">
          {
            files.url
            &&
            <a
              className="bg-purple-600 text-white px-4 py-2 rounded-full self-end"
              href={files.url}
              download={article?.title}
              target="_blank"
            >
              Download
            </a>
          }
          <button onClick={() => navigate('/admin/content/edit-blog', { state: { article: { ...article, url: files?.url, cover_img: files?.cover_img } } })} className="bg-gray-500 text-white px-4 py-2 rounded-full self-end">
            Edit
          </button>
          <button onClick={initiateArticleDeletion} className="bg-red-500 text-white px-4 py-2 rounded-full self-end">
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {formatDate1({ dateISO: article?.created_at })}
              </div>
              <h3 className="font-bold text-lg mb-2">
                {article?.brief}
              </h3>
              {files?.cover_img && (
                <>
                  <img
                    src={files?.cover_img}
                    className="rounded-lg mb-2 max-w-4/5"
                    style={{
                      maxHeight: '800px'
                    }}
                    alt="article-cover-img"
                  />
                </>
              )}
              {/* <div className="text-xs text-gray-500 mb-2">
                By Emma Cox, Will Jackson-Moore and James King
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
