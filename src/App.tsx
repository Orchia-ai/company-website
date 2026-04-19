import { useEffect, useState } from 'react'
import './App.css'

import SplashScreen from './components/SplashScreen'
import OrchiaBackground from './components/OrchiaBackground'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import Clients from './components/sections/Clients'
import WhyUs from './components/sections/WhyUs'
import WhatWeBuild from './components/sections/WhatWeBuild'
import Proof from './components/sections/Proof'
import Process from './components/sections/Process'
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

  // Keep scroll-padding-top in sync with the actual sticky header height
  useEffect(() => {
    if (!entered) return
    const wrapper = document.querySelector('.topbar-wrapper') as HTMLElement | null
    if (!wrapper) return
    const update = () => {
      document.documentElement.style.setProperty(
        '--topbar-h',
        `${wrapper.offsetHeight}px`
      )
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(wrapper)
    return () => ro.disconnect()
  }, [entered])

  if (!entered) return <SplashScreen onEnter={handleEnter} />

  return (
    <>
    <OrchiaBackground />
    <div className={`site-shell site-enter${visible ? ' site-visible' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
      <Header scrolled={scrolled} />
      <main>
        <div id="hero"><Hero /></div>
        <div id="clients"><Clients /></div>
        <div id="proof"><Proof /></div>
        <div id="why-us"><WhyUs /></div>
        <div id="what-we-build"><WhatWeBuild /></div>
        <div id="process"><Process /></div>
        <div id="contact"><Contact /></div>
      </main>
      <Footer />
    </div>
    </>
  )
}
