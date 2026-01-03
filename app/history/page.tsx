'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, History, Search, Filter, CalendarDays, ExternalLink, Sun, Moon, Sparkles, X, ChevronRight, Leaf, AlertCircle, Droplets, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface HistoryRecord {
  id: string
  date: string
  plant: string
  diagnosis: string
  confidence: number
  image: string
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export default function HistoryPage() {
  const { theme, t, isDark, lang, toggleTheme, setLang, history } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)

  const filteredRecords = history.filter((r: any) =>
    r.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  )



  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <style jsx global>{`
        .record-card { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .record-card:hover { transform: scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.92)', zIndex: -1 }} />

      {/* TOP CONTROLS */}
      <div className="glass-panel" style={{ position: 'fixed', top: '30px', right: '30px', padding: '10px 20px', borderRadius: '50px', display: 'flex', gap: '15px', alignItems: 'center', zIndex: 999, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)', border: `1px solid ${theme.border}` }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, padding: '5px' }}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
        <div style={{ width: '1px', height: '20px', backgroundColor: theme.border }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setLang('EN')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'EN' ? 'bold' : 'normal', color: lang === 'EN' ? theme.accent : theme.subtext }}>EN</button>
          <button onClick={() => setLang('HI')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'HI' ? 'bold' : 'normal', color: lang === 'HI' ? theme.accent : theme.subtext }}>HI</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '60px 20px', minHeight: '100vh', color: theme.text }}>

        <div style={{ width: '100%', maxWidth: '1000px' }}>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', marginBottom: '40px', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('backToHome')}
          </Link>

          <header style={{ marginBottom: '60px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: theme.widget, padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', border: `1px solid ${theme.border}` }}>
              <Sparkles size={16} color={theme.accent} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Diagnosis Archive</span>
            </div>
            <h1 style={{ fontSize: '64px', margin: '0 0 15px 0', letterSpacing: '-2px' }}>{t('historyTitle')}</h1>
            <p style={{ color: theme.subtext, fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>{t('historySubtitle')}</p>
          </header>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '60px', justifyContent: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: theme.subtext }} size={18} />
              <input
                type="text"
                placeholder="Search plants or results..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '20px 20px 20px 55px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, outline: 'none', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
              />
            </div>
            <button style={{ padding: '0 30px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Filter size={18} /> Filter
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredRecords.map(record => (
              <div
                key={record.id}
                className="record-card glass-panel"
                onClick={() => setSelectedRecord(record)}
                style={{ padding: '25px', borderRadius: '35px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer', border: `1px solid ${theme.border}` }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                    <img src={record.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>{record.plant}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: theme.subtext, marginTop: '4px' }}>
                      <CalendarDays size={14} /> {record.date}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '15px 20px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAF9', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: theme.subtext }}>{t('resultLabel')}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.accent }}>{record.confidence}% Match</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '5px' }}>{record.diagnosis}</div>
                </div>

                <button style={{ backgroundColor: 'transparent', border: 'none', color: theme.accent, fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                  {t('viewReport')} <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: theme.subtext }}>
              <History size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
              <p>{t('noHistory')}</p>
            </div>
          )}

        </div>

        {/* FULL REPORT MODAL */}
        {selectedRecord && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.3s' }}>
            <div style={{ backgroundColor: theme.card, width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '40px', overflowY: 'auto', position: 'relative', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', border: `1px solid ${theme.border}` }}>
              <button onClick={() => setSelectedRecord(null)} style={{ position: 'absolute', top: '25px', right: '25px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <X size={20} color={theme.text} />
              </button>

              <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                <img src={selectedRecord.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'white', marginBottom: '10px' }}>
                    <CalendarDays size={16} /> <span style={{ fontSize: '14px', letterSpacing: '1px' }}>{selectedRecord.date}</span>
                  </div>
                  <h2 style={{ color: 'white', fontSize: '42px', margin: 0 }}>{selectedRecord.plant}: {selectedRecord.diagnosis}</h2>
                </div>
              </div>

              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                  <div style={{ flex: 1, backgroundColor: theme.widget, padding: '20px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: '12px', color: theme.subtext, textTransform: 'uppercase', marginBottom: '5px' }}>{t('confidence')}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.accent }}>{selectedRecord.confidence}%</div>
                  </div>
                  <div style={{ flex: 2, backgroundColor: theme.widget, padding: '20px', borderRadius: '25px', border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: '12px', color: theme.subtext, textTransform: 'uppercase', marginBottom: '5px' }}>Status</div>
                    <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedRecord.diagnosis === 'Healthy' ? <Sparkles size={18} color="#27AE60" /> : <AlertCircle size={18} color={theme.error} />}
                      {selectedRecord.diagnosis}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '30px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Leaf size={18} color={theme.accent} /> Description</h4>
                    <p style={{ color: theme.subtext, lineHeight: '1.8', fontSize: '16px' }}>{selectedRecord.description}</p>
                  </div>

                  <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAF9', padding: '30px', borderRadius: '30px', border: `1px solid ${theme.border}` }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '15px', color: theme.warning, display: 'flex', alignItems: 'center', gap: '10px' }}><AlertCircle size={18} /> {t('symptomsLabel')}</h4>
                    <ul style={{ paddingLeft: '20px', color: theme.subtext, lineHeight: '1.8' }}>
                      {selectedRecord.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                    <div style={{ backgroundColor: isDark ? 'rgba(74, 103, 65, 0.1)' : '#F3F7E9', padding: '30px', borderRadius: '30px', border: `1px solid ${theme.accent}33` }}>
                      <h4 style={{ fontSize: '18px', marginBottom: '15px', color: theme.accent, display: 'flex', alignItems: 'center', gap: '10px' }}><Droplets size={18} /> {t('treatmentLabel')}</h4>
                      <ul style={{ paddingLeft: '20px', color: theme.text, lineHeight: '1.8' }}>
                        {selectedRecord.treatment.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', padding: '30px', borderRadius: '30px', border: `1px solid ${theme.border}` }}>
                      <h4 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={18} color={theme.accent} /> {t('preventionLabel')}</h4>
                      <ul style={{ paddingLeft: '20px', color: theme.subtext, lineHeight: '1.8' }}>
                        {selectedRecord.prevention.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => setSelectedRecord(null)} style={{ padding: '15px 40px', borderRadius: '30px', border: 'none', backgroundColor: theme.accent, color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} className="record-card">
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer style={{ marginTop: 'auto', paddingTop: '100px', color: theme.subtext, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}>
          {t('historyFooter')}
        </footer>
      </div>
    </div>
  )
}