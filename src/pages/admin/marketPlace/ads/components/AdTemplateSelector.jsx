import React from 'react'
import { FaCheck } from 'react-icons/fa'
import Ad_Temp1 from './templates/Ad_Temp1'
import Ad_Temp2 from './templates/Ad_Temp2'
import Ad_Temp3 from './templates/Ad_Temp3'
import Ad_Temp4 from './templates/Ad_Temp4'
import Ad_Temp5 from './templates/Ad_Temp5'
import Ad_Temp6 from './templates/Ad_Temp6'
import Ad_Temp7 from './templates/Ad_Temp7'
import Ad_Temp8 from './templates/Ad_Temp8'
import Ad_Temp9 from './templates/Ad_Temp9'
import Ad_Temp10 from './templates/Ad_Temp10'

const sampleMedia = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6F3DCB"/>
        <stop offset="1" stop-color="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)"/>
    <circle cx="480" cy="120" r="90" fill="rgba(255,255,255,0.18)"/>
    <circle cx="120" cy="300" r="120" fill="rgba(255,255,255,0.12)"/>
  </svg>`
)}`

const sampleData = {
  template_id: 'template_1',
  title: 'Example headline',
  description: 'Short description preview for the layout.',
  cta_text: 'Learn More',
  destination_type: 'external',
  color_tone: '#6F3DCB',
  media_type: 'image',
  media_preview: sampleMedia,
}

const templates = [
  { id: 'template_1', name: 'Standard', Component: Ad_Temp1 },
  { id: 'template_2', name: 'Overlay', Component: Ad_Temp2 },
  { id: 'template_3', name: 'Split Grid', Component: Ad_Temp3 },
  { id: 'template_4', name: 'Feature Grid', Component: Ad_Temp4 },
  { id: 'template_5', name: 'Retro', Component: Ad_Temp5 },
  { id: 'template_6', name: 'Glass', Component: Ad_Temp6 },
  { id: 'template_7', name: 'Dark', Component: Ad_Temp7 },
  { id: 'template_8', name: 'Content First', Component: Ad_Temp8 },
  { id: 'template_9', name: 'Gradient', Component: Ad_Temp9 },
  { id: 'template_10', name: 'Compact', Component: Ad_Temp10 },
]

export default function AdTemplateSelector({ hideContinueBtn = false, selected, onSelect, onNext }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg mb-4">Select a Template</h3>
      <p className="text-gray-500 mb-6 text-sm">
        Each template has a unique layout. The phone preview updates instantly.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {templates.map(({ id, name, Component }) => {
          const isSelected = selected === id
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              style={{
                // height: '250px',
                width: '100%'
              }}
              className={`relative w-full rounded-xl transition-all overflow-hidden group bg-gray-50 border ${isSelected
                  ? 'ring-4 ring-[#6F3DCB]/30 scale-[1.02] border-transparent'
                  : 'hover:scale-[1.01] hover:shadow-md border-gray-100'
                }`}
            >
              {/* <div style={{ height: '100%' }} className="absolute inset-0 p-2"> */}
              {/* <div className="w-full h-full origin-top-left scale-[0.38]"> */}
              <Component
                data={{ ...sampleData, template_id: id }}
                autoplayMedia={false}
              />
              {/* </div> */}
              {/* </div> */}

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="px-2 py-1 rounded-lg bg-white/80 backdrop-blur text-[10px] font-bold text-gray-700 truncate">
                  {name}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#6F3DCB] text-white p-1.5 rounded-full shadow-md z-10">
                  <FaCheck size={12} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {
        !hideContinueBtn
        &&
        <div className="flex justify-end">
          <button
            onClick={onNext}
            disabled={!selected}
            className="bg-[#6F3DCB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      }
    </div>
  )
}
