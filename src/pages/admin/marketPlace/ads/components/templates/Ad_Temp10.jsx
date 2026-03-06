import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp10({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border"
      style={{ borderColor: theme.light }}
    >
      <div className="p-3 flex items-center gap-3">
        <div 
          className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border"
          style={{ borderColor: theme.light, backgroundColor: theme.light2 }}
        >
          <AdTemplateMedia
            data={data}
            autoplay={autoplayMedia}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="font-bold text-xs truncate"
            style={{ color: theme.dark }}
          >
            {data?.title || 'Headline'}
          </div>
          <div className="text-gray-500 text-[10px] mt-1 line-clamp-2">
            {data?.description || 'Description goes here...'}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3" />
    </div>
  )
}
