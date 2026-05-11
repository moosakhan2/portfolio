import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Moosa Khan — Software Engineer',
  description:
    'Building things at the intersection of AI and product. UWaterloo Software Engineering. AI Engineer at Presto.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}})();` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
