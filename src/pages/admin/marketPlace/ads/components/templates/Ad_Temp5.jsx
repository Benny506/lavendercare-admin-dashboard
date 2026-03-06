import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp5({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex">
        <div className="w-3" style={{ backgroundColor: theme.dark }} />
        <div className="flex-1">
          <div className="relative">
            <AdTemplateMedia
              data={data}
              autoplay={autoplayMedia}
              className="w-full h-36 object-cover"
            />
            <div className="absolute -bottom-2 left-4 w-8 h-1 rounded" style={{ backgroundColor: theme.primary }} />
          </div>
          <div className="p-4 pt-6">
            <div className="font-black text-black text-base uppercase tracking-tight line-clamp-2">
              {data?.title || 'Headline'}
            </div>
            <div className="text-gray-700 text-[11px] mt-2 line-clamp-2 font-medium">
              {data?.description || 'Description goes here...'}
            </div>
            <div className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
