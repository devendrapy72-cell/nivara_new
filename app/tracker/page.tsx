"use client";
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, History, Leaf, Clock,
  ChevronRight, Globe, Moon, Sun, Camera,
  Sprout, CheckCircle2, RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TrackerPage() {
  const { lang, setLang, isDark, toggleTheme, theme, t, tracker, updateTrackerItem } = useApp();



  // Function to handle dose completion
  const handleMarkDone = (id: number) => {
    const item = tracker.find((t: any) => t.id === id);
    if (item && !item.isDone) {
      updateTrackerItem(id, {
        progress: Math.min(item.progress + 10, 100),
        isDone: true
      });
    }
  };

  // Function to reset the dose for the next day
  const handleReset = (id: number) => {
    updateTrackerItem(id, { isDone: false });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', color: theme.text }}>

      {/* BACKGROUND & OVERLAY */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

      {/* TOP CONTROLS (Using Home Page Style Capsule) */}
      <div className="glass-panel" style={{ position: 'fixed', top: '30px', right: '30px', padding: '10px 20px', borderRadius: '50px', display: 'flex', gap: '15px', alignItems: 'center', zIndex: 999, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)', border: `1px solid ${theme.border}` }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, padding: '5px', display: 'flex' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{ width: '1px', height: '20px', backgroundColor: theme.border }} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setLang('EN')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'EN' ? 'bold' : 'normal', color: lang === 'EN' ? theme.accent : theme.subtext }}>EN</button>
          <button onClick={() => setLang('HI')} style={{ background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: lang === 'HI' ? 'bold' : 'normal', color: lang === 'HI' ? theme.accent : theme.subtext }}>HI</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '40px 24px' }}>

        <Link href="/" style={{ alignSelf: 'flex-start', color: theme.accent, textDecoration: 'none', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
          <ArrowLeft size={18} /> {t('back')}
        </Link>

        {/* HEADER SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: theme.card, borderRadius: '25px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <History size={40} color={theme.accent} />
          </div>
          <h1 style={{ fontSize: '42px', margin: '0', color: theme.text }}>{t('trackerTitle')}</h1>
          <p style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: theme.accent, marginTop: '10px', fontWeight: 'bold' }}>{t('trackerSubtitle')}</p>
        </div>

        {/* FEATURE GRID */}
        <div key={lang} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px', width: '100%', maxWidth: '1000px' }}>
          {tracker.map((item: any) => (
            <div key={item.id} style={{
              backgroundColor: theme.card,
              padding: '35px',
              borderRadius: '40px',
              boxShadow: item.progress === 100 ? `0 20px 50px ${isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 215, 0, 0.3)'}` : '0 15px 35px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              opacity: 1,
              transition: 'all 0.3s ease',
              border: item.progress === 100 ? `2px solid #FFD700` : `1px solid ${theme.border}`,
              position: 'relative',
              overflow: 'hidden'
            }}>

              {item.progress === 100 && (
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 20px', backgroundColor: '#FFD700', borderBottomLeftRadius: '25px', color: '#000', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  RECOVERY COMPLETE
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ backgroundColor: item.progress === 100 ? 'rgba(255, 215, 0, 0.1)' : (isDark ? 'rgba(255,255,255,0.05)' : '#F3F7E9'), borderRadius: '15px', padding: '15px' }}>
                  {item.progress === 100 ? <CheckCircle2 size={24} color="#FFD700" /> : <Leaf size={24} color={theme.accent} />}
                </div>
                <div style={{ textAlign: 'right', marginTop: item.progress === 100 ? '20px' : '0' }}>
                  <span style={{ fontSize: '10px', padding: '5px 12px', backgroundColor: item.progress === 100 ? '#FFD700' : (item.isDone ? theme.accent : (isDark ? 'rgba(255,255,255,0.05)' : '#F3F7E9')), color: item.progress === 100 ? '#000' : (item.isDone ? '#FFF' : theme.accent), borderRadius: '15px', fontWeight: 'bold', transition: '0.3s' }}>
                    {item.progress === 100 ? 'FULLY HEALED' : (item.isDone ? t('doseCompleted') : item.severity)}
                  </span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.progress === 100 ? '#FFD700' : theme.accent, marginTop: '5px' }}>{item.progress}%</div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '26px', color: theme.text }}>{item.plant}</h3>
                <p style={{ margin: '5px 0 0', color: item.progress === 100 ? theme.subtext : '#E67E22', fontWeight: 'bold', fontSize: '14px' }}>
                  {item.progress === 100 ? 'Treatment Successful' : `${t('issueLabel')} ${item.issue}`}
                </p>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: isDark ? '#333' : '#F0F0F0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: item.progress === 100 ? '#FFD700' : theme.accent, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
              </div>

              {item.progress !== 100 && (
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Sprout size={20} color={theme.accent} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: theme.text }}>{t('howToCure')}:</strong>
                      <div style={{ marginTop: '5px' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {item.cure.split(/(?:\. |\n)/).filter((s: string) => s.trim().length > 0).map((point: string, idx: number) => (
                            <li key={idx} style={{ fontSize: '14px', color: theme.subtext, lineHeight: '1.5', marginBottom: '4px' }}>
                              {point.trim().endsWith('.') ? point.trim() : `${point.trim()}.`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Clock size={20} color={theme.accent} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: theme.text }}>{t('whenToTreat')}:</strong>
                      <p style={{ margin: '3px 0 0', fontSize: '14px', color: theme.subtext, lineHeight: '1.5' }}>{item.schedule}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              {item.progress === 100 ? (
                <div style={{ width: '100%', padding: '15px', backgroundColor: isDark ? 'rgba(255, 215, 0, 0.1)' : '#FFF9C4', borderRadius: '20px', color: '#AF8F00', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #FFD700' }}>
                  <CheckCircle2 size={18} fill="#FFD700" color={isDark ? '#000' : '#FFF'} /> Plant Fully Recovered
                </div>
              ) : (
                item.isDone ? (
                  <button
                    onClick={() => handleReset(item.id)}
                    style={{ width: '100%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa', border: '1px dashed #ccc', padding: '15px', borderRadius: '20px', color: theme.subtext, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <RotateCcw size={18} /> {t('undoDose')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkDone(item.id)}
                    style={{ width: '100%', backgroundColor: theme.accent, border: 'none', padding: '15px', borderRadius: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(74, 103, 65, 0.2)' }}>
                    <CheckCircle2 size={18} /> {t('markDose')}
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '80px', fontSize: '10px', color: theme.subtext, letterSpacing: '3px', fontWeight: 'bold' }}>© 2025 NIVARA</footer>
      </div>
    </div>
  );
}