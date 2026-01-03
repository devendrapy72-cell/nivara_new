'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, CheckCircle2, AlertTriangle, Droplets, Shield,
  ArrowRight, Home, Camera, Loader2, Thermometer, Activity,
  Stethoscope, Sprout
} from 'lucide-react'
import { useApp } from '../context/AppContext'

interface AnalysisResult {
  disease: string
  confidence: string
  description: string
  treatment: string
  prevention: string
  image?: string
}

export default function ResultPage() {
  const { theme, t, isDark, addToTracker } = useApp()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult')
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult)
        setResult(parsed)
      } catch (err) {
        console.error('Error parsing result:', err)
      }
    }
    // Simulate a small delay for "processing" feel if needed, or just set loading false
    setTimeout(() => setLoading(false), 800)
  }, [])

  const handleNewScan = () => {
    sessionStorage.removeItem('analysisResult')
    router.push('/scan')
  }

  const handleGoHome = () => {
    sessionStorage.removeItem('analysisResult')
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(18, 20, 18, 0.92)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />
        <div style={{ textAlign: 'center', color: theme.accent }}>
          <Loader2 size={48} style={{ animation: 'spin 1.5s linear infinite', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>{t('finalizing')}</h2>
        </div>
        <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
      </div>
    )
  }

  if (!result) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(18, 20, 18, 0.92)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

        <div style={{ backgroundColor: theme.card, borderRadius: '40px', padding: '50px', maxWidth: '500px', width: '100%', textAlign: 'center', border: `1px solid ${theme.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <AlertTriangle size={48} color={theme.subtext} style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', color: theme.text, marginBottom: '15px' }}>{t('noResultTitle')}</h2>
          <p style={{ color: theme.subtext, marginBottom: '30px' }}>{t('noResultDesc')}</p>
          <button onClick={handleNewScan} style={{ backgroundColor: theme.accent, color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
            <Camera size={18} /> {t('scanAgain')}
          </button>
        </div>
      </div>
    )
  }

  const isHealthy = result.disease.toLowerCase().includes('healthy') ||
    result.disease.toLowerCase().includes('no disease')

  const statusColor = isHealthy ? theme.success : theme.error
  const StatusIcon = isHealthy ? CheckCircle2 : Activity

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'serif', color: theme.text }}>
      <style jsx global>{`
        .hover-bulge { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important; }
        .hover-bulge:hover { transform: scale(1.01) translateY(-4px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important; }
        .btn-bulge { transition: transform 0.2s ease !important; }
        .btn-bulge:hover { transform: scale(1.05) !important; }
        .glass-panel { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(18, 20, 18, 0.92)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* HEADER */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <button onClick={handleGoHome} className="btn-bulge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.subtext, fontSize: '14px', cursor: 'pointer' }}>
            <Home size={16} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('reportTitle')}</span>
          </div>
        </div>

        {/* MAIN DIAGNOSIS CARD */}
        <div className="hover-bulge" style={{ width: '100%', backgroundColor: theme.card, borderRadius: '40px', padding: '40px', border: `1px solid ${theme.border}`, marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', backgroundColor: statusColor }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: isHealthy ? '#E8F5E9' : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <StatusIcon size={40} color={statusColor} />
            </div>

            <h1 style={{ fontSize: '42px', fontWeight: '600', margin: '0 0 10px 0', color: theme.text }}>
              {result.disease}
            </h1>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: theme.widget, borderRadius: '20px', marginBottom: '30px' }}>
              <span style={{ fontSize: '13px', color: theme.subtext, fontWeight: '500' }}>{t('confidence')}:</span>
              <span style={{ fontSize: '13px', color: theme.accent, fontWeight: '700' }}>{result.confidence}</span>
            </div>

            <p style={{ fontSize: '18px', lineHeight: '1.8', color: theme.subtext, maxWidth: '700px' }}>
              {result.description}
            </p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', width: '100%' }}>

          {/* TREATMENT (Only if diseased) */}
          {!isHealthy && (
            <div className="hover-bulge" style={{ backgroundColor: theme.card, borderRadius: '35px', padding: '30px', border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', backgroundColor: '#E3F2FD', borderRadius: '15px' }}>
                  <Stethoscope size={24} color="#1E88E5" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{t('treatmentTitle')}</h2>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: theme.subtext, whiteSpace: 'pre-line' }}>
                {result.treatment}
              </p>
            </div>
          )}

          {/* PREVENTION */}
          <div className="hover-bulge" style={{ backgroundColor: theme.card, borderRadius: '35px', padding: '30px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#FFF3E0', borderRadius: '15px' }}>
                <Shield size={24} color="#FB8C00" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{t('preventionTitle')}</h2>
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: theme.subtext, whiteSpace: 'pre-line' }}>
              {result.prevention}
            </p>
          </div>

          {/* CARE TIPS (Generic or Specific) */}
          <div className="hover-bulge" style={{ backgroundColor: theme.card, borderRadius: '35px', padding: '30px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: theme.widget, borderRadius: '15px' }}>
                <Sprout size={24} color={theme.accent} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{t('careTitle')}</h2>
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, color: theme.subtext, fontSize: '15px', lineHeight: '1.8' }}>
              <li>{t('care1')}</li>
              <li>{t('care2')}</li>
              <li>{t('care3')}</li>
              <li>{t('care4')}</li>
            </ul>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div style={{ marginTop: '50px', width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button onClick={handleNewScan} className="btn-bulge" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: theme.card, color: theme.subtext, border: `1px solid ${theme.border}`, padding: '20px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            <Camera size={20} />
            <span>{t('scanAgain')}</span>
          </button>

          <button onClick={() => {
            addToTracker({
              plant: 'Diagnosed Plant',
              issue: result.disease,
              progress: 0,
              severity: result.confidence === 'High' ? 'High' : 'Moderate',
              cure: result.treatment,
              schedule: 'Daily treatment required',
              isDone: false
            });
            router.push('/tracker');
          }} className="btn-bulge" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: theme.accent, color: 'white', border: 'none', padding: '20px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 10px 25px rgba(74, 103, 65, 0.3)' }}>
            <Activity size={20} />
            <span>Track Recovery</span>
          </button>
        </div>

      </div>
    </div>
  )
}
