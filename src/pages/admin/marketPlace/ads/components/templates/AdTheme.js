// Tiny color utility to derive a simple theme from a base hex color
// Avoids external deps by using basic mix operations with white/black

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function parseHex(hex) {
  if (!hex) return { r: 111, g: 61, b: 203 } // default #6F3DCB
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('')
  }
  const int = parseInt(h, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

function toHex({ r, g, b }) {
  const v = (clamp(r, 0, 255) << 16) + (clamp(g, 0, 255) << 8) + clamp(b, 0, 255)
  return `#${v.toString(16).padStart(6, '0')}`
}

function mix(c1, c2, ratio) {
  return {
    r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
    g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
    b: Math.round(c1.b * (1 - ratio) + c2.b * ratio),
  }
}

export function makeTheme(baseHex) {
  const base = parseHex(baseHex)
  const white = { r: 255, g: 255, b: 255 }
  const black = { r: 0, g: 0, b: 0 }

  const primary = base
  const light = mix(base, white, 0.8) // very light tint
  const light2 = mix(base, white, 0.6)
  const dark = mix(base, black, 0.25) // darker for text/borders

  return {
    primary: toHex(primary),
    light: toHex(light),
    light2: toHex(light2),
    dark: toHex(dark),
    rgbaPrimary: `rgba(${primary.r}, ${primary.g}, ${primary.b}, 1)`,
    rgbaPrimarySoft: `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.15)`,
  }
}

