import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp9({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <div 
        className="p-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.dark} 100%)` }}
      >
        <div className="mt-3 grid grid-cols-5 gap-3 items-stretch">
          <div className="col-span-3 flex flex-col justify-between">
            <div>
              <div className="font-extrabold text-white text-base leading-tight line-clamp-2">
                {data?.title || 'Headline'}
              </div>
              <div className="text-white/80 text-[11px] mt-2 line-clamp-3">
                {data?.description || 'Description goes here...'}
              </div>
            </div>
            <div className="mt-4" />
          </div>
          <div className="col-span-2">
            <div className="h-full rounded-2xl overflow-hidden backdrop-blur"
                 style={{ border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <AdTemplateMedia
                data={data}
                autoplay={autoplayMedia}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
