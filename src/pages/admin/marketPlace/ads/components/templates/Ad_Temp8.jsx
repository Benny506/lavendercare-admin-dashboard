import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp8({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: theme.light }}
    >
      <div className="p-5" style={{ backgroundColor: theme.light2 }}>
        <div 
          className="font-extrabold text-lg leading-tight line-clamp-2"
          style={{ color: theme.dark }}
        >
          {data?.title || 'Headline'}
        </div>
        <div className="mt-2 text-gray-600 text-[11px] line-clamp-2">
          {data?.description || 'Description goes here...'}
        </div>
        <div className="mt-4" />
      </div>

      <div className="relative">
        <AdTemplateMedia
          data={data}
          autoplay={autoplayMedia}
          className="w-full h-44 object-cover"
        />
        <div 
          className="absolute top-0 left-0 right-0 h-12"
          style={{ background: `linear-gradient(to bottom, ${theme.light2} 0%, transparent 100%)` }}
        />
      </div>
    </div>
  )
}
