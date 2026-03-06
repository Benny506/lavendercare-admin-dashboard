import React from 'react'
import AdTemplateMedia from './AdTemplateMedia'
import { makeTheme } from './AdTheme'

export default function Ad_Temp2({ data, autoplayMedia = true }) {
  const theme = makeTheme(data?.color_tone)
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-md h-80" style={{ backgroundColor: theme.dark }}>
      <div className="absolute inset-0">
        <AdTemplateMedia
          data={data}
          autoplay={autoplayMedia}
          className="w-full h-full object-cover opacity-90"
        />
        <div 
          className="absolute inset-0" 
          style={{ background: `linear-gradient(to top, ${theme.dark} 0%, transparent 100%)` }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div 
          className="font-extrabold text-white text-lg leading-tight line-clamp-2"
          style={{ textShadow: `0 2px 4px ${theme.dark}` }}
        >
          {data?.title || 'Headline'}
        </div>
        <div className="text-white/90 text-[11px] mt-2 line-clamp-2 font-medium">
          {data?.description || 'Description goes here...'}
        </div>
        <div className="mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: theme.primary }} />
      </div>
    </div>
  )
}
