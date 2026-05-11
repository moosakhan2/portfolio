import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  let font: ArrayBuffer | null = null
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,900&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } }
    ).then(r => r.text())
    const url = css.match(/url\(([^)]+)\)\s+format\('woff2'\)/)?.[1]
    if (url) font = await fetch(url).then(r => r.arrayBuffer())
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F4EE',
          fontFamily: font ? 'Fraunces' : 'Georgia, serif',
          fontWeight: 900,
          fontSize: 24,
          color: '#1C1A16',
          letterSpacing: '-1.5px',
          paddingBottom: '1px',
        }}
      >
        M
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: 'Fraunces', data: font, weight: 900 as const, style: 'normal' as const }]
        : [],
    }
  )
}
