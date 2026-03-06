import React from 'react'

export default function AdTemplateMedia({ data, className = '', autoplay = true }) {
  const src = data?.media_preview || data?.image_url
  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-300 text-xs ${className}`}>
        No Media
      </div>
    )
  }

  if (data?.media_type === 'video') {
    return (
      <video
        src={src}
        className={className}
        autoPlay={autoplay}
        muted
        loop
        playsInline
        controls={!autoplay}
      />
    )
  }

  return <img src={src} alt="Ad media" className={className} />
}
