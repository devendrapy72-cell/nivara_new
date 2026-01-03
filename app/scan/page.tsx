'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Camera, X, Upload, Sparkles, ArrowLeft,
  CheckCircle2, AlertCircle, Loader2, Image as ImageIcon,
  Video, Circle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ScanPage() {
  const { theme, t, isDark, addToHistory } = useApp()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }
    setSelectedImage(file)
    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleScan = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      // This communicates with your app/api/analyze/route.ts
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API Error')
      }

      const data = await response.json()

      // Persist to History
      addToHistory({
        plant: 'Unknown Plant', // The API doesn't currently return plant name, might need to extract or default
        diagnosis: data.disease,
        confidence: data.confidence === 'High' ? 92 : data.confidence === 'Medium' ? 75 : 45,
        image: preview, // Use the local data URL
        description: data.description,
        symptoms: [], // API doesn't return structured symptoms yet, might need to parse description or leave empty
        treatment: [data.treatment], // API returns single string, wrap in array
        prevention: [data.prevention]  // API returns single string, wrap in array
      })

      sessionStorage.setItem('analysisResult', JSON.stringify(data))
      router.push('/result')
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image')
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreview(null)
    setError(null)
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      setShowCamera(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported')
      }

      await new Promise(resolve => setTimeout(resolve, 200))

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      setStream(mediaStream)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied.'
      setCameraError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
            processFile(file)
            stopCamera()
          }
        }, 'image/jpeg', 0.95)
      }
    }
  }

  const handleScanNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await startCamera()
  }

  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(err => console.error('Play error:', err))
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [stream, showCamera])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .hover-bulge { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important; }
          .hover-bulge:hover { transform: scale(1.02) translateY(-4px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
          .btn-bulge { transition: transform 0.2s ease !important; }
          .btn-bulge:hover { transform: scale(1.05) !important; }
          .upload-zone { transition: all 0.3s ease !important; }
          .upload-zone.dragging { border-color: #4A6741 !important; background: #F3F7E9 !important; transform: scale(1.02) !important; }
        `
      }} />

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(18, 20, 18, 0.92)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '40px 24px', minHeight: '100vh', color: theme.text }}>

        {/* HEADER */}
        <div style={{ width: '100%', maxWidth: '900px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="btn-bulge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.accent, fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
            <ArrowLeft size={18} /> {t('backHome')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.accent }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('aiAnalysis')}</span>
          </div>
        </div>

        {/* MAIN SCAN CARD */}
        <div className="hover-bulge" style={{ width: '100%', maxWidth: '900px', backgroundColor: theme.card, borderRadius: '40px', padding: '50px', border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: theme.widget, borderRadius: '25px', marginBottom: '20px' }}>
              <Camera size={36} color={theme.accent} />
            </div>
            <h1 style={{ fontSize: '42px', margin: '0 0 10px 0', fontWeight: '600', color: theme.text }}>{t('scanTitle')}</h1>
            <p style={{ fontSize: '15px', color: theme.subtext, margin: 0 }}>{t('scanSubtitle')}</p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{ marginBottom: '30px', padding: '18px 24px', backgroundColor: '#FEE', border: `1px solid ${theme.error}`, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
              <AlertCircle size={20} color={theme.error} />
              <div style={{ flex: 1 }}>
                <span style={{ color: theme.error, fontSize: '14px', fontWeight: '500', display: 'block' }}>{error}</span>
                <button onClick={() => setError(null)} style={{ marginTop: '8px', padding: '4px 12px', backgroundColor: theme.error, color: 'white', border: 'none', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>Dismiss</button>
              </div>
            </div>
          )}

          {/* UPLOAD ZONE */}
          <div style={{ marginBottom: '40px' }}>
            {!preview ? (
              <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ border: `2px dashed ${theme.border}`, borderRadius: '30px', padding: '60px 40px', textAlign: 'center', backgroundColor: isDragging ? theme.widget : 'transparent', cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} id="image-upload" />
                <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '100px', height: '100px', backgroundColor: theme.widget, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={48} color={theme.accent} />
                  </div>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: theme.text, margin: '0 0 8px 0' }}>{t('clickUpload')}</p>
                    <p style={{ fontSize: '13px', color: theme.subtext, margin: 0 }}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: theme.widget, borderRadius: '20px', marginTop: '10px' }}>
                    <ImageIcon size={16} color={theme.accent} />
                    <span style={{ fontSize: '12px', color: theme.accent, fontWeight: '600' }}>{t('chooseFile')}</span>
                  </div>
                </label>
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', border: `2px solid ${theme.border}`, backgroundColor: theme.widget }}>
                <div style={{ position: 'relative', width: '100%', maxHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                  <img src={preview} alt="Selected plant" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }} />
                </div>
                <button onClick={handleRemoveImage} className="btn-bulge" style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: `1px solid ${theme.border}`, borderRadius: '50%', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <X size={20} color={theme.text} />
                </button>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: theme.card }}>
                  <CheckCircle2 size={20} color={theme.success} />
                  <span style={{ fontSize: '14px', color: theme.text, fontWeight: '500' }}>{t('imageReady')}</span>
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            {!preview && (
              <button type="button" onClick={handleScanNow} className="btn-bulge" style={{ width: '100%', maxWidth: '400px', backgroundColor: theme.accent, color: 'white', padding: '20px 40px', borderRadius: '600px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 8px 20px rgba(74, 103, 65, 0.3)', transition: 'all 0.3s ease' }}>
                <Video size={20} />
                <span>{t('scanCamera')}</span>
              </button>
            )}

            {!preview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', maxWidth: '400px', margin: '10px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }}></div>
                <span style={{ fontSize: '12px', color: theme.subtext }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }}></div>
              </div>
            )}

            {preview && (
              <button type="button" onClick={handleScan} disabled={!selectedImage || loading} className="btn-bulge" style={{ width: '100%', maxWidth: '400px', backgroundColor: selectedImage && !loading ? theme.success : '#AAB3A8', color: 'white', padding: '20px 40px', borderRadius: '600px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: selectedImage && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: selectedImage && !loading ? '0 8px 20px rgba(45, 74, 35, 0.3)' : 'none', transition: 'all 0.3s ease' }}>
                {loading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>{t('analyzing')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>{t('analyzeImage')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* INFO CARDS */}
          <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: theme.widget, padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔬</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: theme.text }}>AI Analysis</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, margin: 0 }}>Powered by Google Gemini</p>
            </div>
            <div style={{ backgroundColor: theme.widget, padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: theme.text }}>Fast Results</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, margin: 0 }}>Get diagnosis in seconds</p>
            </div>
            <div style={{ backgroundColor: theme.widget, padding: '25px', borderRadius: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: theme.text }}>Accurate</h3>
              <p style={{ fontSize: '12px', color: theme.subtext, margin: 0 }}>Expert-level detection</p>
            </div>
          </div>

          {/* TIPS SECTION */}
          <div style={{ marginTop: '40px', padding: '25px', backgroundColor: theme.widget, borderRadius: '25px', border: `1px solid ${theme.border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 15px 0', color: theme.text, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color={theme.accent} />
              {t('tipsTitle')}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: theme.subtext, lineHeight: '1.8' }}>
              <li>{t('tip1')}</li>
              <li>{t('tip2')}</li>
              <li>{t('tip3')}</li>
              <li>{t('tip4')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CAMERA MODAL */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={stopCamera}>
          <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={stopCamera} className="btn-bulge" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} color={theme.text} />
            </button>
            <div style={{ position: 'relative', width: '100%', borderRadius: '30px', overflow: 'hidden', backgroundColor: '#000', aspectRatio: '4/3', minHeight: '300px' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {!stream && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
                  <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '10px' }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>Starting camera...</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
              <button type="button" onClick={stopCamera} style={{ padding: '12px 30px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '2px solid rgba(255, 255, 255, 0.5)', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={capturePhoto} className="btn-bulge" style={{ width: '80px', height: '80px', backgroundColor: 'white', border: '5px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', cursor: stream ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: stream ? 1 : 0.5 }} disabled={!stream}>
                <Circle size={60} color={theme.accent} fill={theme.accent} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}