import { useEffect, useState } from 'react'
import './App.css'

import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import Clients from './components/sections/Clients'
import WhyUs from './components/sections/WhyUs'
import WhatWeBuild from './components/sections/WhatWeBuild'
import Proof from './components/sections/Proof'
import Process from './components/sections/Process'
import Tech from './components/sections/Tech'
import Contact from './components/sections/Contact'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleEnter = () => {
    setEntered(true)
    setTimeout(() => setVisible(true), 50)
  }

  useEffect(() => {
    if (!entered) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [entered])

  if (!entered) return <SplashScreen onEnter={handleEnter} />

  return (
    <div className={`site-shell site-enter${visible ? ' site-visible' : ''}`}>
      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <Clients />
        <WhyUs />
        <WhatWeBuild />
        <Proof />
        <Process />
        <Tech />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
