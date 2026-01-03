"use client";
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { lang, setLang, isDark, toggleTheme, theme, t } = useApp();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: theme.text }}>

      {/* BACKGROUND IMAGE LAYER */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/aes1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -2
      }} />

      {/* SOLID OVERLAY FOR READABILITY */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.9)',
        zIndex: -1
      }} />

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

      {/* CONTENT LAYER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '60px 20px' }}>

        <div style={{ width: '100%', maxWidth: '500px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', marginBottom: '40px', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('backHomeFull')}
          </Link>

          <h1 style={{ fontSize: '42px', color: theme.text, marginBottom: '30px' }}>{t('contactTitle')}</h1>

          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '40px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '35px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.accent, fontSize: '18px', marginBottom: '10px' }}>
                <Mail size={20} /> {t('emailLabel')}
              </h3>
              <p style={{ color: theme.subtext, fontSize: '16px', margin: 0 }}>support@nivara.com</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.accent, fontSize: '18px', marginBottom: '10px' }}>
                <MapPin size={20} /> {t('locationLabel')}
              </h3>
              <p style={{ color: theme.subtext, fontSize: '16px', margin: 0, lineHeight: '1.5' }}>
                {t('addressLine1')}<br />
                {t('addressLine2')}
              </p>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '100px', color: theme.subtext, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          {t('contactFooter')}
        </footer>
      </div>
    </div>
  );
}