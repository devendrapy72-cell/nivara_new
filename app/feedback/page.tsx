"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Star, CheckCircle2, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FeedbackPage() {
  const { lang, setLang, isDark, toggleTheme, theme, t } = useApp();
  const [rating, setRating] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [hover, setHover] = useState(0);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    // Safety redirect after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  // Success View with Background Consistency
  if (isSent) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', padding: '20px', color: theme.text }}>
        {/* Background Layers */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.9)', zIndex: -1 }} />

        <div style={{ textAlign: 'center', backgroundColor: theme.card, padding: '50px', borderRadius: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', animation: 'fadeIn 0.8s ease-out', border: `1px solid ${theme.border}` }}>
          <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F7E9', padding: '30px', borderRadius: '50%', marginBottom: '25px', display: 'inline-block' }}>
            <CheckCircle2 size={60} color={theme.accent} />
          </div>
          <h1 style={{ fontSize: '38px', color: theme.text, marginBottom: '10px' }}>{t('feedbackReceivedTitle')}</h1>
          <p style={{ color: theme.subtext, fontSize: '18px', maxWidth: '400px', lineHeight: '1.6', margin: '0 auto' }}>
            {t('feedbackReceivedDesc')}
          </p>
          <Link href="/" style={{ marginTop: '30px', display: 'inline-block', color: theme.accent, fontWeight: '600', textDecoration: 'underline' }}>
            {t('returnHome')}
          </Link>
        </div>
      </div>
    );
  }

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '60px 20px', minHeight: '100vh' }}>

        <div style={{ width: '100%', maxWidth: '600px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', marginBottom: '40px', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('backHomeFull')}
          </Link>

          <h1 style={{ fontSize: '46px', color: theme.text, marginBottom: '15px' }}>{t('feedbackTitle')}</h1>
          <p style={{ color: theme.subtext, fontSize: '18px', marginBottom: '45px' }}>{t('feedbackSubtitle')}</p>

          <form onSubmit={handleSubmit} style={{ backgroundColor: theme.card, padding: '45px', borderRadius: '50px', border: `1px solid ${theme.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>

            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: theme.subtext, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>{t('rateLabel')}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                  >
                    <Star
                      size={36}
                      fill={(hover || rating) >= star ? "#F1C40F" : "none"}
                      color={(hover || rating) >= star ? "#F1C40F" : isDark ? "#444" : "#E5E7EB"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '14px', color: theme.text, fontWeight: '600', display: 'block', marginBottom: '10px' }}>{t('commentsLabel')}</label>
              <textarea
                placeholder={t('commentsPlaceholder')}
                required
                style={{ width: '100%', height: '160px', padding: '20px', borderRadius: '25px', border: `1px solid ${theme.border}`, fontSize: '16px', outline: 'none', resize: 'none', fontFamily: 'sans-serif', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FAFAFA', color: theme.text }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', backgroundColor: theme.accent, color: 'white', border: 'none', padding: '20px', borderRadius: '35px', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(45, 74, 35, 0.15)' }}
            >
              <Send size={18} /> {t('sendFeedbackBtn')}
            </button>
          </form>
        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '60px', color: theme.subtext, fontSize: '10px', letterSpacing: '3px' }}>
          {t('feedbackFooter')}
        </footer>
      </div>
    </div>
  );
}