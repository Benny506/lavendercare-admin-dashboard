import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp4({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div 
      className="rounded-3xl overflow-hidden shadow-sm border bg-white"
      style={{ borderColor: theme.light }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div 
              className="text-[10px] font-semibold uppercase tracking-wide mb-2"
              style={{ color: theme.primary }}
            >
              Limited time
            </div>
            <div 
              className="font-extrabold text-base leading-tight line-clamp-2"
              style={{ color: theme.dark }}
            >
              {data?.title || 'Headline'}
            </div>
            <div className="text-gray-500 text-[11px] mt-2 line-clamp-3">
              {data?.description || 'Description goes here...'}
            </div>
          </div>
          <div 
            className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner shrink-0 border-2"
            style={{ borderColor: theme.light, backgroundColor: theme.light2 }}
          >
            <AdTemplateMedia
              data={data}
              autoplay={autoplayMedia}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-4" />
      </div>
    </div>
  )
}
