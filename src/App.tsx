import { useEffect, useRef, useState } from 'react'
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
import Tech from './components/sections/Tech'
import Contact from './components/sections/Contact'

const SECTIONS = ['hero', 'clients', 'why-us', 'what-we-build', 'proof', 'process', 'tech', 'contact']

export default function App() {
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  useEffect(() => {
    if (!entered) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [entered])

  if (!entered) return <SplashScreen onEnter={handleEnter} />

  const sw = (id: string) => `section-wrap${activeSection === id ? ' is-active' : ''}`

  return (
    <>
    <OrchiaBackground />
    <div className={`site-shell site-enter${visible ? ' site-visible' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
      <Header scrolled={scrolled} />
      <main>
        <div id="hero"          className={sw('hero')}><Hero /></div>
        <div id="clients"       className={sw('clients')}><Clients /></div>
        <div id="why-us"        className={sw('why-us')}><WhyUs /></div>
        <div id="what-we-build" className={sw('what-we-build')}><WhatWeBuild /></div>
        <div id="proof"         className={sw('proof')}><Proof /></div>
        <div id="process"       className={sw('process')}><Process /></div>
        <div id="tech"          className={sw('tech')}><Tech /></div>
        <div id="contact"       className={sw('contact')}><Contact /></div>
      </main>
      <Footer />
    </div>
    </>
  )
}
