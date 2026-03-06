import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp1({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: theme.light }}
    >
      <AdTemplateMedia
        data={data}
        autoplay={autoplayMedia}
        className="w-full h-44 object-cover"
      />
      <div className="p-4 relative">
        <div 
          className="absolute top-0 left-0 right-0 h-1" 
          style={{ backgroundColor: theme.primary }} 
        />
        <div 
          className="font-bold text-sm leading-snug line-clamp-2 mt-2"
          style={{ color: theme.dark }}
        >
          {data?.title || 'Headline'}
        </div>
        <div className="text-gray-500 text-[11px] mt-1 line-clamp-2">
          {data?.description || 'Description goes here...'}
        </div>
      </div>
    </div>
  )
}
