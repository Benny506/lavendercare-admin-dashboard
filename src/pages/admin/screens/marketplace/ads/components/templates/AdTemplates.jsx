import React from 'react';

// Common helper to get image source
const getImageSrc = (data) => data.media_preview || data.image_url;
const hasMedia = (data) => !!(data.media_preview || data.image_url);

/* 
  TEMPLATE 1: STANDARD CARD
  - Full width image top
  - Content bottom
  - Clean white background
  - Border radius
*/
export function AdTemplate1({ data }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      <div className="h-48 relative bg-gray-100">
        {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Media</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{data.title || 'Headline'}</h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2">{data.description || 'Description goes here...'}</p>
        
        {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity active:opacity-90 shadow-sm"
             style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
           >
             {data.cta_text || 'Learn More'}
           </button>
        )}
      </div>
    </div>
  );
}

/* 
  TEMPLATE 2: FULL OVERLAY (STORY STYLE)
  - Full height image background
  - Gradient overlay
  - Text at bottom
  - White text
*/
export function AdTemplate2({ data }) {
  return (
    <div className="relative h-80 rounded-3xl overflow-hidden shadow-md bg-gray-900">
       <div className="absolute inset-0">
        {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover opacity-80" />
          )
        ) : (
           <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
       </div>

       <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-full">
         <h3 className="font-bold text-white text-xl mb-2 leading-tight drop-shadow-md">{data.title || 'Headline'}</h3>
         <p className="text-gray-200 text-xs mb-4 line-clamp-2 drop-shadow-sm opacity-90">{data.description || 'Description goes here...'}</p>
         
         {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-3 rounded-xl text-sm font-bold text-gray-900 bg-white transition-opacity active:opacity-90 shadow-lg"
           >
             {data.cta_text || 'Learn More'}
           </button>
        )}
       </div>
    </div>
  );
}

/* 
  TEMPLATE 3: HORIZONTAL LIST STYLE
  - Image on left (square)
  - Content on right
  - Compact height
*/
export function AdTemplate3({ data }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex h-32 items-center p-2 gap-3">
      <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Media</div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col h-full justify-center pr-1">
        <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">{data.title || 'Headline'}</h3>
        <p className="text-gray-500 text-[10px] mb-2 line-clamp-2">{data.description || 'Description...'}</p>
        
        {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-opacity active:opacity-90 shadow-sm mt-auto"
             style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
           >
             {data.cta_text || 'Go'}
           </button>
        )}
      </div>
    </div>
  );
}

/* 
  TEMPLATE 4: MINIMALIST (CLEAN)
  - No visible border
  - Centered text
  - Soft background
  - Rounded image
*/
export function AdTemplate4({ data }) {
  return (
    <div className="bg-gray-50 rounded-3xl p-4 text-center">
       <div className="h-40 rounded-2xl overflow-hidden bg-gray-200 mb-4 shadow-inner mx-auto w-full">
        {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Media</div>
        )}
      </div>
      
      <h3 className="font-bold text-gray-800 text-lg mb-2">{data.title || 'Headline'}</h3>
      <p className="text-gray-500 text-xs mb-4 px-2">{data.description || 'Description goes here...'}</p>
      
      {data.destination_type !== 'informative' && (
           <button 
             className="px-8 py-2 rounded-full text-sm font-bold text-white transition-opacity active:opacity-90 shadow-md inline-block"
             style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
           >
             {data.cta_text || 'Learn More'}
           </button>
        )}
    </div>
  );
}

/* 
  TEMPLATE 5: BOLD BORDER (RETRO/POP)
  - Thick black border
  - Sharp corners (or slight radius)
  - Uppercase text
  - High contrast
*/
export function AdTemplate5({ data }) {
  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 flex flex-col">
       <div className="h-44 bg-gray-100 border-b-2 border-black relative">
         {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Media</div>
        )}
        <div className="absolute top-2 right-2 bg-yellow-400 border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Ad
        </div>
       </div>
       
       <div className="p-4">
         <h3 className="font-black text-black text-lg mb-1 uppercase tracking-tight">{data.title || 'HEADLINE'}</h3>
         <p className="text-gray-700 text-xs mb-4 font-medium border-l-2 border-black pl-2">{data.description || 'Description goes here...'}</p>
         
         {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
           >
             {data.cta_text || 'CLICK HERE'}
           </button>
        )}
       </div>
    </div>
  );
}

/* 
  TEMPLATE 6: FLOATING CARD
  - Content floats over image
  - Image is background
  - Glassmorphism effect
*/
export function AdTemplate6({ data }) {
  return (
    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
        {/* Background Image */}
        <div className="absolute inset-0">
             {hasMedia(data) ? (
            data.media_type === 'video' ? (
                <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            ) : (
                <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
            )
            ) : (
            <div className="w-full h-full bg-gray-200" />
            )}
        </div>

        {/* Floating Content Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50">
             <h3 className="font-bold text-gray-900 text-sm mb-1">{data.title || 'Headline'}</h3>
             <p className="text-gray-600 text-[10px] mb-3 line-clamp-2">{data.description || 'Description goes here...'}</p>
            
             {data.destination_type !== 'informative' && (
                <button 
                    className="w-full py-2 rounded-lg text-xs font-bold text-white transition-opacity active:opacity-90 shadow-sm"
                    style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
                >
                    {data.cta_text || 'Learn More'}
                </button>
             )}
        </div>
    </div>
  );
}

/* 
  TEMPLATE 7: DARK ELEGANCE
  - Dark theme
  - Serif fonts (simulated)
  - Gold/Accent touches
*/
export function AdTemplate7({ data }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col">
       <div className="h-56 relative opacity-90">
          {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">No Media</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
       </div>
       
       <div className="p-5 -mt-12 relative z-10">
         <h3 className="font-serif text-white text-xl mb-2 italic tracking-wide">{data.title || 'Headline'}</h3>
         <p className="text-gray-400 text-xs mb-5 font-light leading-relaxed">{data.description || 'Description goes here...'}</p>
         
         {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-2 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
           >
             {data.cta_text || 'DISCOVER'}
           </button>
        )}
       </div>
    </div>
  );
}

/* 
  TEMPLATE 8: SPLIT VERTICAL (REVERSE)
  - Content Top
  - Image Bottom
  - Clean separation
*/
export function AdTemplate8({ data }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-auto">
      <div className="p-5 flex-1 flex flex-col justify-center text-center">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{data.title || 'Headline'}</h3>
        <p className="text-gray-500 text-sm mb-4">{data.description || 'Description goes here...'}</p>
        
        {data.destination_type !== 'informative' && (
           <button 
             className="px-6 py-2 rounded-full text-xs font-bold text-white transition-opacity active:opacity-90 shadow-sm mx-auto mb-2"
             style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
           >
             {data.cta_text || 'Learn More'}
           </button>
        )}
      </div>

      <div className="h-40 bg-gray-100">
         {hasMedia(data) ? (
          data.media_type === 'video' ? (
             <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
             <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
          )
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Media</div>
        )}
      </div>
    </div>
  );
}

/* 
  TEMPLATE 9: COLORFUL GRADIENT
  - Gradient Background
  - White Glass Card for Content
  - Image floats
*/
export function AdTemplate9({ data }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg text-white">
       <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 shadow-md shrink-0 bg-white/10">
             {hasMedia(data) ? (
                data.media_type === 'video' ? (
                    <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                ) : (
                    <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
                )
            ) : null}
          </div>
          <div>
             <h3 className="font-bold text-lg leading-tight">{data.title || 'Headline'}</h3>
             <div className="h-1 w-10 bg-white/50 rounded mt-1"></div>
          </div>
       </div>

       <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <p className="text-white/90 text-xs leading-relaxed">{data.description || 'Description goes here...'}</p>
       </div>

       {data.destination_type !== 'informative' && (
           <button 
             className="w-full py-2.5 rounded-xl text-sm font-bold text-purple-600 bg-white transition-transform active:scale-95 shadow-md"
           >
             {data.cta_text || 'Get It Now'}
           </button>
        )}
    </div>
  );
}

/* 
  TEMPLATE 10: COMPACT BANNER
  - Very small height
  - Horizontal layout
  - Good for list insertions
*/
export function AdTemplate10({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex items-center gap-3">
       <div className="w-12 h-12 rounded bg-gray-100 shrink-0 overflow-hidden">
          {hasMedia(data) ? (
            data.media_type === 'video' ? (
                <video src={getImageSrc(data)} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            ) : (
                <img src={getImageSrc(data)} alt="Ad" className="w-full h-full object-cover" />
            )
        ) : null}
       </div>
       
       <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-xs truncate">{data.title || 'Headline'}</h3>
          <p className="text-gray-500 text-[10px] truncate">{data.description || 'Description...'}</p>
       </div>

       {data.destination_type !== 'informative' && (
           <button 
             className="px-3 py-1.5 rounded-md text-[10px] font-bold text-white whitespace-nowrap"
             style={{ backgroundColor: data.color_tone || '#6F3DCB' }}
           >
             {data.cta_text || 'View'}
           </button>
        )}
    </div>
  );
}
