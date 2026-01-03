"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Leaf, ShoppingCart, X, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShopPage() {
  const { lang, setLang, isDark, toggleTheme, theme, t, products, cart, addToCart, removeFromCart } = useApp();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const router = useRouter();

  const cartTotal = cart.reduce((total, id) => {
    const product = products.find(p => p.id === id);
    return total + (product ? product.price : 0);
  }, 0);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', color: theme.text }}>

      {/* 1. BACKGROUND IMAGE LAYER */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/aes1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2
      }} />

      {/* 2. SOLID OVERLAY FOR READABILITY */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
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

      {/* 3. CONTENT LAYER */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'serif',
        padding: '40px 20px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Header Section */}
        <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ color: theme.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('backHomeFull')}
          </Link>

          <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}>
            <button
              onClick={() => setShowCartDropdown(!showCartDropdown)}
              className="hover-scale"
              style={{ background: theme.accent, border: `none`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '65px', height: '65px', borderRadius: '50%', boxShadow: '0 10px 30px rgba(45, 74, 35, 0.4)', color: 'white' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={28} color="white" />
                {cart.length > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#E74C3C', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', fontWeight: 'bold' }}>
                    {cart.length}
                  </span>
                )}
              </div>
            </button>

            {showCartDropdown && (
              <div style={{ position: 'absolute', right: 0, bottom: '80px', width: '340px', backgroundColor: theme.card, borderRadius: '25px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '25px', zIndex: 100, border: `1px solid ${theme.border}`, animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: theme.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {t('basketTitle')}
                  <button onClick={() => setShowCartDropdown(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subtext }}><X size={18} /></button>
                </h4>
                {cart.length === 0 ? (
                  <p style={{ fontSize: '14px', color: theme.subtext, textAlign: 'center', padding: '20px 0' }}>{t('basketEmpty')}</p>
                ) : (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                      {cart.map((id, index) => {
                        const item = products.find(p => p.id === id);
                        return (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundImage: `url(${item?.image})`, backgroundSize: 'cover' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: theme.text }}>{item?.name}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: theme.accent }}>₹{item?.price}</p>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: theme.subtext, cursor: 'pointer' }}><X size={16} /></button>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ borderTop: `2px solid ${theme.border}`, paddingTop: '15px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: theme.text }}>
                        <span>{t('totalAmount')}</span>
                        <span style={{ color: theme.accent }}>₹{cartTotal}</span>
                      </div>
                    </div>
                    <Link href="/checkout" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', backgroundColor: theme.accent, color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: '600', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        {t('checkoutBtn')}
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <h1 style={{ fontSize: '42px', color: theme.text, marginBottom: '10px', fontWeight: '600' }}>{t('shopTitle')}</h1>
        <p style={{ color: theme.subtext, marginBottom: '50px', fontSize: '18px' }}>{t('shopDesc')}</p>

        {/* Product Grid */}
        <div key={lang} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', width: '100%', maxWidth: '1200px' }}>
          {products.map((p) => (
            <div key={p.id} className="product-card" style={{
              backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${theme.border}`,
              display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              position: 'relative'
            }}>
              {/* Image Container with Hover Zoom Effect */}
              <div style={{ width: '100%', height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '5px 12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#1A1C19' }}>
                  {p.category}
                </div>
              </div>

              {/* Product Details */}
              <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text, lineHeight: '1.3' }}>{p.name}</h3>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: theme.accent, whiteSpace: 'nowrap' }}>₹{p.price}</span>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                  <button onClick={() => addToCart(p.id)} style={{
                    width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: theme.accent, color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(74, 103, 65, 0.2)'
                  }}>
                    <ShoppingBag size={16} /> {t('addToBasket')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '80px', color: theme.subtext, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          {t('shopFooter')}
        </footer>
      </div>
    </div>
  );
}