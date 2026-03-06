import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp7({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-widest"
               style={{ color: theme.light2 }}>
            Spotlight
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            <div className="text-[10px]" style={{ color: theme.light2 }}>Live</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <div className="font-extrabold text-white text-base leading-tight line-clamp-2">
              {data?.title || 'Headline'}
            </div>
            <div className="text-white/70 text-[11px] mt-2 line-clamp-3">
              {data?.description || 'Description goes here...'}
            </div>
          </div>
          <div className="col-span-1">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <AdTemplateMedia
                data={data}
                autoplay={autoplayMedia}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-4" />

        <div className="mt-2" />
      </div>
    </div>
  )
}
