import React from 'react'
import { makeTheme } from './AdTheme'

export default function AdTemplateCta({ data, className = '', style }) {
  if (!data || data.destination_type === 'informative') return null
  const theme = makeTheme(data?.color_tone)

  return (
    <button
      type="button"
      className={className}
      style={style || { backgroundColor: theme.primary }}
    >
      {data.cta_text || 'Learn More'}
    </button>
  )
}
