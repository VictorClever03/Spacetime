/* eslint-disable prettier/prettier */
import './globals.css'
import type { Metadata } from 'next'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import { cookies } from 'next/headers'
import { Copyright } from '@/components/Copyright'
import { Hero } from '@/components/Hero'
import { SignIn } from '@/components/SignIn'
import { Stripes } from '@/components/Stripes'
import { Profile } from '@/components/Profile'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata: Metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo construido com React, Next.Js, Tailwindcss e typescript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = cookies().has('token')
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} ${roboto.className} bg-gray-900 text-gray-100`}
      >
       

        <main className="grid grid-cols-2 min-h-screen">
      {/* left */}
      <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
        {/* blur */}
        <div className="absolute right-0 top-1/2 h-[288px] w-[526px] bg-purple-700 opacity-50 -translate-y-1/2 translate-x-1/2 rounded-full blur-[194px]" />

        {/* stripes */}
        <Stripes />

        {/* Sign In */}
        {isAuthenticated ? <Profile /> : <SignIn />}

        {/* hero */}
        <Hero />

        {/* Copyright */}
        <Copyright />
      </div>

      {/* right */}
      <div className="flex flex-col overflow-y-scroll max-h-screen bg-[url(../assets/bg-stars.svg)] bg-cover">
      
      {children}
    </div>
    </main>
      </body>
    </html>
  )
}
