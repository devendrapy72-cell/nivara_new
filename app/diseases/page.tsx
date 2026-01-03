'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Leaf, Loader2, AlertCircle, Sparkles, Droplets, Shield, Sprout, ChevronRight, Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface DiseaseResult {
  name: string
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export default function LibraryPage() {
  const { theme, t, isDark, lang, toggleTheme, setLang } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<DiseaseResult | null>(null)

  const commonDiseases = [
    { name: "Potato Blight", hi: "आलू की अंगमारी", icon: "🥔" },
    { name: "Wheat Rust", hi: "गेहूँ का रतुआ", icon: "🌾" },
    { name: "Rice Blast", hi: "धान का झुलसा रोग", icon: "🍚" },
    { name: "Tomato Leaf Curl", hi: "टमाटर का पर्ण कुंचन", icon: "🍅" },
    { name: "Sugarcane Red Rot", hi: "गन्ने का लाल सड़न", icon: "🎋" },
    { name: "Corn Smut", hi: "मक्का का कंडुआ", icon: "🌽" }
  ]

  const triggerSearch = async (query: string) => {
    setSearchQuery(query)
    setLoading(true)
    setError(null)
    setAiResult(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language: lang })
      })

      if (!res.ok) throw new Error(t('aiError'))

      const data = await res.json()
      if (data.name) {
        setAiResult(data)
      } else {
        setError(t('noInfoFound'))
      }

    } catch (err: any) {
      console.error(err)
      setError(t('aiError'))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    triggerSearch(searchQuery)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <style jsx global>{`
        .hover-bulge { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important; }
        .hover-bulge:hover { transform: scale(1.02) translateY(-4px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
        .btn-bulge { transition: transform 0.2s ease !important; }
        .btn-bulge:hover { transform: scale(1.05) !important; }
      `}</style>

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.92)', zIndex: -1 }} />

      {/* TOP CONTROLS (Capsule) */}
      <div className="glass-panel" style={{ position: 'fixed', top: '30px', right: '30px', padding: '10px 20px', borderRadius: '50px', display: 'flex', gap: '15px', alignItems: 'center', zIndex: 999, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)', border: `1px solid ${theme.border}` }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, padding: '5px' }}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
        <div style={{ width: '1px', height: '20px', backgroundColor: theme.border }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setLang('EN')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'EN' ? 'bold' : 'normal', color: lang === 'EN' ? theme.accent : theme.subtext }}>EN</button>
          <button onClick={() => setLang('HI')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'HI' ? 'bold' : 'normal', color: lang === 'HI' ? theme.accent : theme.subtext }}>HI</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '60px 20px', minHeight: '100vh', color: theme.text }}>

        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Header Link */}
          <div style={{ width: '100%', marginBottom: '40px' }}>
            <Link href="/" className="btn-bulge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              <ArrowLeft size={18} /> {t('backHome')}
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '64px', color: theme.text, margin: '0 0 15px 0', fontWeight: '600', letterSpacing: '-1px' }}>
              {t('libTitle')}
            </h1>
            <p style={{ color: theme.subtext, fontSize: '20px', maxWidth: '500px', margin: '0 auto' }}>
              {t('libSubtitle')}
            </p>
          </div>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '60px', width: '100%' }}>
            <Search style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', color: theme.accent }} size={24} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '25px 35px 25px 75px', borderRadius: '50px', border: `1px solid ${theme.border}`, fontSize: '20px', outline: 'none', backgroundColor: theme.card, color: theme.text, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ position: 'absolute', right: '12px', top: '12px', bottom: '12px', padding: '0 30px', backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '40px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s' }}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : t('searchBtn')}
            </button>
          </form>

          {/* COMMON DISEASES */}
          {!aiResult && !loading && (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
                <Sprout size={18} color={theme.accent} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {t('commonDiseases')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {commonDiseases.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => triggerSearch(lang === 'EN' ? d.name : d.hi)}
                    className="hover-bulge"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 25px',
                      backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '25px',
                      cursor: 'pointer', textAlign: 'left', color: theme.text, fontSize: '16px', fontWeight: '500',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{d.icon}</span>
                    <span>{lang === 'EN' ? d.name : d.hi}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {error && (
            <div style={{ padding: '25px', backgroundColor: isDark ? 'rgba(231, 76, 60, 0.1)' : '#FEF2F2', border: `1px solid ${isDark ? '#E74C3C' : '#FCA5A5'}`, borderRadius: '30px', color: isDark ? '#FF6B6B' : '#B91C1C', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
              <AlertCircle size={24} />
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {/* AI RESULT DISPLAY */}
          {aiResult && (
            <div style={{ width: '100%', animation: 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <div style={{ backgroundColor: theme.card, borderRadius: '50px', padding: '50px', border: `1px solid ${theme.border}`, boxShadow: '0 30px 60px rgba(0,0,0,0.1)', position: 'relative' }}>
                <button onClick={() => setAiResult(null)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', cursor: 'pointer', color: theme.subtext }}><X size={24} /></button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '40px' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '30px', backgroundColor: theme.widget, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
                    <Leaf size={45} color={theme.accent} />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: theme.accent, textTransform: 'uppercase', letterSpacing: '3px' }}>
                      {t('resultLabel')}
                    </span>
                    <h2 style={{ fontSize: '48px', margin: '5px 0 0', fontWeight: '600', letterSpacing: '-1px' }}>{aiResult.name}</h2>
                  </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <p style={{ fontSize: '20px', lineHeight: '1.8', color: theme.subtext }}>{aiResult.description}</p>
                </div>

                <div style={{ display: 'grid', gap: '25px' }}>

                  {/* SYMPTOMS */}
                  <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAF9', padding: '35px', borderRadius: '40px', border: `1px solid ${theme.border}` }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '12px', color: theme.text }}>
                      <AlertCircle size={22} color={theme.warning} /> {t('symptomsLabel')}
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: theme.subtext, lineHeight: '1.8', fontSize: '17px' }}>
                      {aiResult.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                    {/* TREATMENT */}
                    <div style={{ backgroundColor: isDark ? 'rgba(74, 103, 65, 0.1)' : '#F3F7E9', padding: '35px', borderRadius: '40px', border: `1px solid ${theme.accent}44` }}>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '12px', color: theme.accent }}>
                        <Droplets size={22} /> {t('treatmentLabel')}
                      </h3>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: theme.text, lineHeight: '1.8', fontSize: '17px' }}>
                        {aiResult.treatment.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>

                    {/* PREVENTION */}
                    <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', padding: '35px', borderRadius: '40px', border: `1px solid ${theme.border}` }}>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '12px', color: theme.text }}>
                        <Shield size={22} color={theme.accent} /> {t('preventionLabel')}
                      </h3>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: theme.subtext, lineHeight: '1.8', fontSize: '17px' }}>
                        {aiResult.prevention.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '100px', color: theme.subtext, fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase' }}>
          {t('tagline')}
        </footer>
      </div>
    </div>
  )
}

function X({ size, color }: { size: number, color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  )
}