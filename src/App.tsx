import { useEffect, useState } from 'react'
import './App.css'

import SplashScreen from './components/SplashScreen'
import OrchiaBackground from './components/OrchiaBackground'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/sections/Hero'
import Clients from './components/sections/Clients'
import StudioMethod from './components/sections/StudioMethod'
import WhatWeBuild from './components/sections/WhatWeBuild'
import SpatialSection from './components/sections/SpatialSection'
import CommerceJourney from './components/sections/CommerceJourney'
import Capabilities from './components/sections/Capabilities'
import Process from './components/sections/Process'
import Work from './components/sections/Work'
import Contact from './components/sections/Contact'
import BlogTeaser from './components/blog/BlogTeaser'

export default function App() {
  const skipSplash =
    typeof window !== 'undefined' &&
    (window.sessionStorage.getItem('orchia-entered') === '1' ||
      window.location.hash.length > 1)
  const [entered, setEntered] = useState(skipSplash)
  const [visible, setVisible] = useState(skipSplash)
  const [scrolled, setScrolled] = useState(false)

  const handleEnter = () => {
    try {
      window.sessionStorage.setItem('orchia-entered', '1')
    } catch {
      /* ignore */
    }
    setEntered(true)
    setTimeout(() => setVisible(true), 50)
  }

  // Scroll to hash anchor on initial mount when arriving from another route
  useEffect(() => {
    if (!entered) return
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'auto', block: 'start' }))
    }
  }, [entered])

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
      <Header scrolled={scrolled} />
      <div className={`site-shell site-enter${visible ? ' site-visible' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
        <main>
          <div id="hero"><Hero /></div>
          <div id="clients"><Clients /></div>
          <div id="what-we-build"><WhatWeBuild /></div>
          <SpatialSection />
          <div id="work"><Work /></div>
          <CommerceJourney />
          <div id="process"><Process /></div>
          <Capabilities />
          <StudioMethod />
          <BlogTeaser />
          <div id="contact"><Contact /></div>
        </main>
        <Footer />
      </div>
    </>
  )
}
