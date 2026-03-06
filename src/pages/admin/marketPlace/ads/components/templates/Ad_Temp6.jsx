import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp6({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div className="relative h-72 rounded-3xl overflow-hidden shadow-lg bg-gray-100">
      <div className="absolute inset-0">
        <AdTemplateMedia
          data={data}
          autoplay={autoplayMedia}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div
        className="absolute inset-x-4 bottom-4 bg-white/85 backdrop-blur-xl rounded-2xl p-4 shadow-xl"
        style={{ border: `1px solid ${theme.light2}` }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wide"
               style={{ color: theme.dark }}>
            Recommended
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.light2 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.light2 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.light2 }} />
          </div>
        </div>
        <div className="font-bold text-gray-900 text-sm mt-2 leading-snug line-clamp-2">
          {data?.title || 'Headline'}
        </div>
        <div className="text-gray-600 text-[11px] mt-1 line-clamp-2">
          {data?.description || 'Description goes here...'}
        </div>
        <div className="mt-3" />
      </div>
    </div>
  )
}
