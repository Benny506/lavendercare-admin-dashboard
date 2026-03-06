import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp3({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: theme.light }}
    >
      <div className="grid grid-cols-5">
        <div className="col-span-2 relative">
          <AdTemplateMedia
            data={data}
            autoplay={autoplayMedia}
            className="w-full h-full min-h-36 object-cover"
          />
          <div className="absolute inset-y-0 right-0 w-1" style={{ backgroundColor: theme.primary }} />
        </div>
        <div className="col-span-3 p-4 flex flex-col" style={{ backgroundColor: theme.light2 }}>
          <div className="mb-2" />
          <div 
            className="font-bold text-sm leading-snug line-clamp-2"
            style={{ color: theme.dark }}
          >
            {data?.title || 'Headline'}
          </div>
          <div className="text-gray-600 text-[11px] mt-1 line-clamp-2">
            {data?.description || 'Description goes here...'}
          </div>
          <div className="mt-auto pt-3" />
        </div>
      </div>
    </div>
  )
}
