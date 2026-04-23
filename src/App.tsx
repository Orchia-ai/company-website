import { useEffect, useState } from 'react'
import './App.css'

import SplashScreen from './components/SplashScreen'
import OrchiaBackground from './components/OrchiaBackground'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import WhoWeAre from './components/sections/WhoWeAre'
import Clients from './components/sections/Clients'
import WhyUs from './components/sections/WhyUs'
import WhatWeBuild from './components/sections/WhatWeBuild'
import Proof from './components/sections/Proof'
import Process from './components/sections/Process'
import Work from './components/sections/Work'
import Recognition from './components/sections/Recognition'
import Contact from './components/sections/Contact'

export default function App() {
  const showWhoWeAre = import.meta.env.VITE_ENABLE_WHO_WE_ARE === 'true'
  const showWhyOrchia = import.meta.env.VITE_ENABLE_WHY_ORCHIA === 'true'
  const showWhatWeBuild = import.meta.env.VITE_ENABLE_WHAT_WE_BUILD === 'true'
  const showHowWeWork = import.meta.env.VITE_ENABLE_HOW_WE_WORK === 'true'
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
      <Header
        scrolled={scrolled}
        showWhatWeBuild={showWhatWeBuild}
      />
      <main>
        <div id="hero"><Hero showWhatWeBuild={showWhatWeBuild} /></div>
        <div id="clients"><Clients /></div>
        <div id="work"><Work /></div>
        <div id="proof"><Proof /></div>
        <div id="why-us"><WhyUs showFullContent={showWhyOrchia} /></div>
        <WhoWeAre showFullContent={showWhoWeAre} />
        <Recognition />
        {showWhatWeBuild && (
          <div id="what-we-build"><WhatWeBuild /></div>
        )}
        {showHowWeWork && (
          <div id="process"><Process /></div>
        )}
        <div id="contact"><Contact /></div>
      </main>
      <Footer />
    </div>
    </>
  )
}
