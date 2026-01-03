'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Camera, BookOpen, History, ChevronRight, CloudSun,
  Droplets, Mail, MessageSquare, Users, ShoppingBag,
  Globe, Moon, Sun, Zap, X, CalendarDays, Sparkles, Heart, AlertTriangle, ArrowUpRight, Activity
} from 'lucide-react'
import { useApp } from './context/AppContext'
import AgriGuruChat from './components/AgriGuruChat'

export default function Home() {
  const { lang, setLang, isDark, toggleTheme, theme, t } = useApp()
  const [showForecast, setShowForecast] = useState(false)
  const [showAloeDetails, setShowAloeDetails] = useState(false)

  // --- INTRO ANIMATION & THEME ---
  const [showIntro, setShowIntro] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // --- WEATHER STATE ---
  const [weatherData, setWeatherData] = useState({
    temp: '--',
    humidity: '--',
    risk: { level: 'Analyzing...', color: '#7A8278', advice: 'Accessing local environment...' },
    forecast: [],
    tip: "Loading botanical intelligence...",
    checklist: ["Syncing with local sensors...", "Analyzing soil data..."]
  })

  // --- BOTANICAL RISK ENGINE ---
  const getRiskAnalysis = (temp: number, humidity: number) => {
    if (humidity > 80 && temp > 20) {
      return { level: "High Risk", color: "#E74C3C", advice: "Fungal threat detected. Prune for airflow." }
    } else if (humidity > 60 || temp > 32) {
      return { level: "Moderate", color: "#E67E22", advice: "Check soil moisture; pests active." }
    }
    return { level: "Stable", color: "#2D4A23", advice: "Optimal conditions for growth." }
  }

  // --- AGRONOMIC INTELLIGENCE ENGINE ---
  const generateBotanicalInsights = (daily: any) => {
    let rainDay = -1;
    let heatOne = -1;

    // Scan next 3 days
    for (let i = 0; i < 3; i++) {
      if (daily.weather_code[i] > 50) rainDay = i; // Rain codes
      if (daily.temperature_2m_max[i] > 35) heatOne = i;
    }

    if (rainDay !== -1) {
      return {
        tip: `Precipitation expected in ${rainDay === 0 ? '24 hours' : rainDay + ' days'}. Pause irrigation systems.`,
        checklist: ["Clear field drainage channels", "Cover sensitive seedlings", "delay fertilizer application", "Monitor fungal hotspots"]
      }
    } else if (heatOne !== -1) {
      return {
        tip: "Extreme heat event approaching. Evaporation rates will spike.",
        checklist: ["Increase irrigation frequency", "Apply mulch to retain moisture", "Provide shade for young plants", "Monitor leaf turgidity"]
      }
    } else {
      return {
        tip: "Conditions are optimal for vegetative growth.",
        checklist: ["Scout for early pest signs", "Maintain regular nutrient schedule", "Weed management", "Record growth metrics"]
      }
    }
  }

  // --- INTRO TIMER ---
  useEffect(() => {
    console.log("Home Page Mounted - Starting Timer")
    // Intro lasts 2.5s total
    const timer1 = setTimeout(() => {
      setShowContent(true)
    }, 2000)

    const timer2 = setTimeout(() => {
      setShowIntro(false)
    }, 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // --- OPEN-METEO INTEGRATION ---
  useEffect(() => {
    const fetchBotanicalWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,weather_code&timezone=auto`
        )
        const data = await res.json()

        const currentRisk = getRiskAnalysis(data.current.temperature_2m, data.current.relative_humidity_2m)
        const insights = generateBotanicalInsights(data.daily)

        // Map API data to your forecast grid
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const mappedForecast = data.daily.time.map((date: string, i: number) => ({
          day: days[new Date(date).getDay()],
          temp: Math.round(data.daily.temperature_2m_max[i]) + "°",
          icon: data.daily.weather_code[i] > 3 ? CloudSun : Sun
        }))

        setWeatherData({
          temp: Math.round(data.current.temperature_2m) + "°C",
          humidity: data.current.relative_humidity_2m + "%",
          risk: currentRisk,
          // @ts-ignore
          forecast: mappedForecast,
          tip: insights.tip,
          checklist: insights.checklist
        })
      } catch (err) {
        console.error("Weather sync failed", err)
      }
    }

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchBotanicalWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchBotanicalWeather(28.61, 77.20) // Default to New Delhi
      )
    }
  }, [])

  // Compute CSS Variables for the root element
  const cssVars = {
    '--theme-bg': theme.bg,
    '--theme-text': theme.text,
    '--theme-subtext': theme.subtext,
    '--theme-accent': theme.accent,
    '--theme-card': theme.card,
    '--theme-border': theme.border,
    '--glass-bg': isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
    '--glass-border': isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
  } as React.CSSProperties

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden', ...cssVars }}>
      <AgriGuruChat />

      {/* BACKGROUND (Matches Library Page) */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

      {/* INTRO SPLASH */}
      {showIntro && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ animation: 'splashFadeInOut 2.5s ease-in-out forwards', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '180px', height: '180px', marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src="/icon.png" style={{ width: '100%', borderRadius: '40px', filter: 'drop-shadow(0 0 30px rgba(74,103,65,0.2))' }} />
            </div>
            <h1 style={{ fontSize: '64px', fontWeight: '300', color: theme.accent, letterSpacing: '8px', fontFamily: 'serif', textTransform: 'uppercase', marginBottom: '10px' }}>Nivara</h1>
            <div style={{ width: '40px', height: '1px', backgroundColor: theme.accent, marginBottom: '20px' }} />
            <p style={{ fontSize: '13px', letterSpacing: '6px', textTransform: 'uppercase', color: theme.subtext, fontWeight: '600' }}>{t('tagline')}</p>
          </div>
        </div>
      )}

      {/* HEADER NAV - Minimal */}


      {/* FLOATING CONTROLS (Top-Right) */}
      <div className="glass-panel" style={{ position: 'fixed', top: '30px', right: '30px', padding: '10px 20px', borderRadius: '50px', display: 'flex', gap: '15px', alignItems: 'center', zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, padding: '5px', display: 'flex' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{ width: '1px', height: '20px', backgroundColor: theme.border }} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setLang('EN')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'EN' ? 'bold' : 'normal', color: lang === 'EN' ? theme.accent : theme.subtext }}>EN</button>
          <button onClick={() => setLang('HI')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'HI' ? 'bold' : 'normal', color: lang === 'HI' ? theme.accent : theme.subtext }}>HI</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {showContent && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 5% 60px', fontFamily: 'serif', color: theme.text }}>

          {/* 1. ASYMMETRIC HERO SECTION - Vertically Centered */}
          <div style={{ minHeight: '85vh', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: '60px', position: 'relative' }}>

            {/* Left: Typography Branding */}
            <div style={{ flex: '1 1 500px', position: 'relative', zIndex: 2 }}>

              {/* Aesthetic Logo Placement */}
              <img src="/icon.png" style={{ width: '60px', height: '60px', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'block' }} />

              <div className="hero-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '20px', padding: '8px 16px', border: `1px solid ${theme.accent}`, borderRadius: '100px', color: theme.accent }}>
                <Sparkles size={14} />
                <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>AI Botanical Intelligence</span>
              </div>

              <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: '300', margin: '0', lineHeight: '1', color: theme.text, letterSpacing: '-0.03em' }}>
                Nivara
              </h1>
              <p style={{ fontSize: '14px', letterSpacing: '0.4em', textTransform: 'uppercase', color: theme.accent, margin: '20px 0 50px 0', borderLeft: `2px solid ${theme.accent}`, paddingLeft: '20px' }}>
                {t('tagline')}
              </p>

              {/* Ghost Button */}
              <Link href="/scan" style={{ textDecoration: 'none' }}>
                <div className="btn-premium-scan" style={{ width: '220px', padding: '18px 25px', borderRadius: '40px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '15px', fontFamily: 'serif', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase' }}>{t('scanBtn')}</span>
                  <div className="icon-box">
                    <Camera size={18} color="white" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right: Floating 3D Plant & Weather Glass */}
            <div style={{ flex: '1 1 400px', position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

              {/* 3D Plant Asset (Simulated with image) */}
              <div className="hero-plant" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop"
                  alt="3D Plant"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))' }}
                />
              </div>

              {/* Floating Glass Weather Widget */}
              <div onClick={() => setShowForecast(true)} className="glass-panel" style={{
                position: 'absolute', bottom: '10%', left: '-10%',
                padding: '25px', borderRadius: '30px',
                cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'center',
                animation: 'floatSlow 7s ease-in-out infinite reverse'
              }}>
                <CloudSun size={32} color={theme.text} strokeWidth={1.5} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '28px', fontWeight: '300' }}>{weatherData.temp}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: weatherData.risk.color }} />
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>{weatherData.risk.level}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. MAGAZINE GRID LAYOUT */}
          <div key={lang} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '120px' }}>

            {/* Library Card - Tall */}
            <Link href="/diseases" className="card-interaction" style={{ gridRow: 'span 2', padding: '40px', borderRadius: '40px', textDecoration: 'none', color: theme.text, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <BookOpen size={24} color={theme.accent} strokeWidth={1} />
                <ArrowUpRight size={20} style={{ opacity: 0.5 }} />
              </div>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: '300', margin: '0 0 10px 0' }}>{t('library')}</h2>
                <p style={{ fontSize: '14px', color: theme.subtext, lineHeight: '1.6' }}>{t('libDesc')}</p>
              </div>
              <div style={{ height: '150px', background: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=500) center/cover', borderRadius: '20px', marginTop: '30px' }} />
            </Link>

            {/* Tracker - Square */}
            <Link href="/tracker" className="card-interaction" style={{ padding: '30px', borderRadius: '40px', textDecoration: 'none', color: theme.text, background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Zap size={24} color={theme.accent} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '300', margin: 0 }}>{t('tracker')}</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '5px' }}>{t('trackerDesc')}</p>
            </Link>

            {/* History - Square */}
            <Link href="/history" className="card-interaction" style={{ padding: '30px', borderRadius: '40px', textDecoration: 'none', color: theme.text, background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <History size={24} color={theme.accent} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '300', margin: 0 }}>{t('history')}</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '5px' }}>{t('hisDesc')}</p>
            </Link>

            {/* Shop - Square */}
            <Link href="/shop" className="card-interaction" style={{ padding: '30px', borderRadius: '40px', textDecoration: 'none', color: theme.text, background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <ShoppingBag size={24} color={theme.accent} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '300', margin: 0 }}>{t('shop')}</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '5px' }}>{t('shopDesc')}</p>
            </Link>

            {/* Community - Square */}
            <Link href="/community" className="card-interaction" style={{ padding: '30px', borderRadius: '40px', textDecoration: 'none', color: theme.text, background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Users size={24} color={theme.accent} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '300', margin: 0 }}>{t('community')}</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '5px' }}>{t('comDesc')}</p>
            </Link>
          </div>

          {/* 3. PLANT OF THE DAY - Cut-Out Look */}
          <div onClick={() => setShowAloeDetails(true)} style={{ marginBottom: '120px', cursor: 'pointer', position: 'relative' }}>
            <div className="card-interaction" style={{ borderRadius: '50px', padding: '60px 50px 60px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'visible', background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)', border: `1px solid ${theme.border}`, backdropFilter: 'blur(12px)' }}>
              <div style={{ maxWidth: '400px' }}>
                <span style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: theme.accent, display: 'block', marginBottom: '20px' }}>{t('potd')}</span>
                <h2 style={{ fontSize: '48px', fontWeight: '300', margin: '0 0 20px 0', lineHeight: 1.1 }}>{t('aloeName')}</h2>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: theme.subtext, marginBottom: '30px' }}>{t('aloeDesc')}</p>
                <span className="link-minimal" style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: theme.text }}>{t('viewProfile')}</span>
              </div>

              {/* Floating "Cut-out" Image - overflowing container */}
              <div style={{ width: '400px', height: '500px', marginTop: '-100px', marginRight: '-20px', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }} />
              </div>
            </div>
          </div>

          {/* 4. FOOTER - Minimal Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '60px' }}>
            <Link href="/contact" className="link-minimal" style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px', color: theme.subtext }}>{t('contact')}</Link>
            <Link href="/feedback" className="link-minimal" style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px', color: theme.subtext }}>{t('feedback')}</Link>
          </div>
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#333', letterSpacing: '4px', opacity: 0.5 }}>
            NIVARA © 2025 • v2.1 • {isDark ? 'DARK' : 'LIGHT'}
          </div>

        </div>
      )}

      {/* FORECAST & AGRONOMIC INSIGHTS MODAL (PREMIUM) */}
      {showForecast && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.card} 80%, #F0F5F0 100%)`, width: '90%', maxWidth: '900px', borderRadius: '50px', padding: '50px', border: `1px solid ${theme.border}`, position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '50px', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>

            <button onClick={() => setShowForecast(false)} style={{ position: 'absolute', right: '30px', top: '30px', border: 'none', background: 'none', cursor: 'pointer', color: theme.subtext }}><X size={28} /></button>

            {/* Left Col: Current Status */}
            <div style={{ paddingRight: '40px', borderRight: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <CloudSun size={32} color={theme.accent} />
                <span style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>{t('localConditions')}</span>
              </div>

              <h2 style={{ fontSize: '80px', fontWeight: '200', margin: '0 0 10px 0', color: theme.text }}>{weatherData.temp}</h2>
              <p style={{ fontSize: '16px', color: theme.subtext, marginBottom: '40px' }}>{t('humidity')}: {weatherData.humidity}</p>

              <div style={{ background: theme.bg, padding: '20px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: weatherData.risk.color }} />
                  <span style={{ fontWeight: '600', color: theme.text }}>{weatherData.risk.level}</span>
                </div>
                <p style={{ fontSize: '13px', color: theme.subtext, lineHeight: '1.5' }}>{weatherData.risk.advice}</p>
              </div>
            </div>

            {/* Right Col: Agronomic Intelligence */}
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '30px', color: theme.text }}>Agronomic Intelligence</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                {/* Smart Tip Card */}
                <div style={{
                  padding: '25px',
                  borderRadius: '30px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(235, 245, 235, 0.9) 0%, rgba(220, 240, 220, 0.4) 100%)',
                  border: isDark ? `1px solid ${theme.border}` : '1px solid rgba(100, 150, 100, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <AlertTriangle size={18} color={isDark ? theme.accent : "#4A6741"} />
                    <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? theme.text : '#3A4A35' }}>
                      {t('smartTip') || 'Smart Tip'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: isDark ? theme.subtext : '#2D3A29' }}>{weatherData.tip}</p>
                </div>

                {/* Checklist Card */}
                <div style={{
                  padding: '25px',
                  borderRadius: '30px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(240, 242, 250, 0.9) 0%, rgba(230, 235, 250, 0.4) 100%)',
                  border: isDark ? `1px solid ${theme.border}` : '1px solid rgba(100, 100, 150, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <CalendarDays size={18} color={isDark ? theme.accent : "#5B6B8C"} />
                    <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? theme.text : '#455570' }}>
                      {t('fieldChecks') || 'Field Checks'}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {weatherData.checklist.map((item, i) => (
                      <li key={i} style={{ fontSize: '13px', color: isDark ? theme.subtext : '#455570', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isDark ? theme.accent : '#5B6B8C' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 7-Day Forecast Row */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '20px', color: theme.subtext }}>{t('forecastLabel')}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* @ts-ignore */}
                  {weatherData.forecast.length > 0 ? weatherData.forecast.map((f: any, i) => {
                    const IconComponent = f.icon
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: theme.subtext }}>{f.day}</span>
                        <IconComponent size={20} color={theme.text} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{f.temp}</span>
                      </div>
                    )
                  }) : <p>Loading...</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ALOE DETAILS MODAL - PREMIUM REDESIGN */}
      {showAloeDetails && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            backgroundColor: theme.card, width: '90%', maxWidth: '1000px', height: '90vh', maxHeight: '700px',
            borderRadius: '50px', border: `1px solid ${theme.border}`, position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'row', boxShadow: '0 50px 100px rgba(0,0,0,0.3)'
          }}>

            <button onClick={() => setShowAloeDetails(false)} style={{ position: 'absolute', right: '30px', top: '30px', border: 'none', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: theme.text, zIndex: 10 }}>
              <X size={24} />
            </button>

            {/* LEFT: IMMERSIVE IMAGE */}
            <div style={{ flex: '1', position: 'relative', height: '100%' }}>
              <img src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', color: 'white' }}>
                <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.9, display: 'block', marginBottom: '10px' }}>{t('potd')}</span>
                <h2 style={{ fontSize: '48px', fontWeight: '300', margin: 0, lineHeight: 1 }}>{t('aloeName')}</h2>
                <p style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.8, marginTop: '5px' }}>{t('aloeSciName')}</p>
              </div>
            </div>

            {/* RIGHT: DETAILS PANEL */}
            <div style={{ flex: '1', padding: '60px 50px', overflowY: 'auto' }}>

              {/* Quick Stats Row */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                <div style={{ flex: 1, padding: '15px', borderRadius: '20px', backgroundColor: theme.widget, border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                  <Droplets size={20} color="#3498DB" style={{ marginBottom: '8px' }} />
                  <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: theme.subtext, marginBottom: '4px' }}>{t('aloeWater')}</span>
                  <strong style={{ color: theme.text }}>Water</strong>
                </div>
                <div style={{ flex: 1, padding: '15px', borderRadius: '20px', backgroundColor: theme.widget, border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                  <Sun size={20} color="#F1C40F" style={{ marginBottom: '8px' }} />
                  <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: theme.subtext, marginBottom: '4px' }}>{t('aloeLight')}</span>
                  <strong style={{ color: theme.text }}>Light</strong>
                </div>
                <div style={{ flex: 1, padding: '15px', borderRadius: '20px', backgroundColor: theme.widget, border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                  <Activity size={20} color="#E74C3C" style={{ marginBottom: '8px' }} />
                  <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: theme.subtext, marginBottom: '4px' }}>{t('aloeDifficulty')}</span>
                  <strong style={{ color: theme.text }}>Care</strong>
                </div>
              </div>

              {/* Origin Story */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <Globe size={18} color={theme.accent} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: theme.accent }}>Native Origin</span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '300', color: theme.text, marginTop: '5px', marginBottom: '10px' }}>{t('aloeOrigin')}</p>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: theme.subtext }}>{t('aloeDesc')}</p>
              </div>

              {/* Key Benefits */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Heart size={18} color="#E91E63" />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: "#E91E63" }}>Key Benefits</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {/* @ts-ignore */}
                  {Array.isArray(t('aloeBenefits')) && t('aloeBenefits').map((benefit: string, i: number) => (
                    <span key={i} style={{ padding: '8px 16px', borderRadius: '30px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5', color: theme.text, fontSize: '13px', border: `1px solid ${theme.border}` }}>
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div style={{ padding: '25px', borderRadius: '25px', background: 'linear-gradient(135deg, #4A6741 0%, #2D4A23 100%)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Sparkles size={16} color="#FFD700" />
                  <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Did You Know?</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.9 }}>{t('aloeFunFact')}</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
