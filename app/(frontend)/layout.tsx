import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

export default function FrontendLayout({children} : {children: React.ReactNode}) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
