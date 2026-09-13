import type { Metadata } from 'next'
import { Cormorant_Garamond, Space_Mono } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import CustomCursor from '@/components/ui/CustomCursor'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Rizky Setiawan — Web Developer',
    template: '%s · Rizky Setiawan',
  },
  description: 'Portofolio web developer — project, keahlian, dan pengalaman.',
  openGraph: {
    title: 'Rizky Setiawan — Web Developer',
    description: 'Portofolio web developer — project, keahlian, dan pengalaman.',
    type: 'website',
  },
  verification: {
    google: 'CPSt267xFXe_kLPe-KtLpo0DI9Yj2dnaqfZDdON5jr4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${cormorant.variable} ${spaceMono.variable}`}>
      <body>
        <CustomCursor />
        <Navbar />
        <main style={{ paddingTop: '4rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
