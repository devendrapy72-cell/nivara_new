"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2, Sun, Moon, Globe, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Visual Credit Card Component
const VisualCard = ({ cardNumber, cardName, expiry }: { cardNumber: string, cardName: string, expiry: string }) => (
  <div style={{
    width: '100%',
    height: '220px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #1A1C19 0%, #2D4A23 100%)',
    padding: '25px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
    <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" alt="chip" style={{ height: '40px', opacity: 0.9 }} />
      <span style={{ fontSize: '18px', fontWeight: '600', opacity: 0.8, fontStyle: 'italic' }}>VISA</span>
    </div>

    <div style={{ fontFamily: 'monospace', fontSize: '26px', letterSpacing: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
      {cardNumber || '•••• •••• •••• ••••'}
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.9 }}>
      <div>
        <div style={{ fontSize: '9px', marginBottom: '4px', opacity: 0.7 }}>Card Holder</div>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>{cardName || 'YOUR NAME'}</div>
      </div>
      <div>
        <div style={{ fontSize: '9px', marginBottom: '4px', opacity: 0.7 }}>Expires</div>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>{expiry || 'MM/YY'}</div>
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  const { lang, setLang, isDark, toggleTheme, theme, t, cart, products, clearCart } = useApp();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Calculate dynamic total
  const cartTotal = cart.reduce((total, id) => {
    const product = products.find(p => p.id === id);
    return total + (product ? product.price : 0);
  }, 0);

  // Form State for Visual Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart(); // Clear cart on successful order
    }, 3000);
  };

  if (orderComplete) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', padding: '20px', color: theme.text }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.88)', zIndex: -1 }} />

        <div style={{ textAlign: 'center', animation: 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', backgroundColor: theme.card, padding: '60px', borderRadius: '50px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: `1px solid ${theme.border}` }}>
          <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F7E9', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(74, 103, 65, 0.15)' }}>
            <CheckCircle2 size={45} color={theme.accent} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '42px', marginBottom: '16px', color: theme.text }}>{t('orderConfirmed')}</h1>
          <p style={{ color: theme.subtext, maxWidth: '320px', margin: '0 auto 40px', lineHeight: '1.6', fontSize: '18px' }}>{t('orderDesc')}</p>
          <Link href="/" style={{ backgroundColor: theme.accent, color: 'white', padding: '18px 40px', borderRadius: '40px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', boxShadow: '0 10px 25px rgba(45, 74, 35, 0.25)', transition: 'transform 0.2s' }} className="hover-scale">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: theme.text }}>
      <style jsx global>{`
        .hover-scale:hover { transform: scale(1.03); }
        .input-focus:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 4px rgba(45, 74, 35, 0.1); }
      `}</style>

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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'serif', padding: '60px 20px', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', marginBottom: '40px', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('returnShop')}
          </Link>

          <h1 style={{ fontSize: '56px', color: theme.text, marginBottom: '50px', letterSpacing: '-1px' }}>{t('checkoutTitle')}</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'start' }}>

            {/* Left Column: Form */}
            <div>
              <VisualCard cardNumber={cardNumber} cardName={cardName} expiry={expiry} />

              <form onSubmit={handlePayment} style={{ backgroundColor: theme.card, padding: '45px', borderRadius: '40px', border: `1px solid ${theme.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: theme.accent }}>
                  <CreditCard size={22} />
                  <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px' }}>{t('paymentDetails')}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: '-10px', left: '15px', backgroundColor: theme.card, padding: '0 8px', fontSize: '12px', color: theme.accent, fontWeight: '600' }}>{t('cardName')}</label>
                    <input
                      required
                      type="text"
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="input-focus"
                      style={{ width: '100%', padding: '18px', borderRadius: '18px', border: `1px solid ${theme.border}`, outline: 'none', backgroundColor: 'transparent', color: theme.text, fontSize: '16px' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: '-10px', left: '15px', backgroundColor: theme.card, padding: '0 8px', fontSize: '12px', color: theme.accent, fontWeight: '600' }}>{t('cardNumber')}</label>
                    <input
                      required
                      type="text"
                      maxLength={19}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      className="input-focus"
                      style={{ width: '100%', padding: '18px', borderRadius: '18px', border: `1px solid ${theme.border}`, outline: 'none', backgroundColor: 'transparent', color: theme.text, fontSize: '16px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '25px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{ position: 'absolute', top: '-10px', left: '15px', backgroundColor: theme.card, padding: '0 8px', fontSize: '12px', color: theme.accent, fontWeight: '600' }}>{t('expiry')}</label>
                      <input
                        required
                        type="text"
                        maxLength={5}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="input-focus"
                        placeholder="MM/YY"
                        style={{ width: '100%', padding: '18px', borderRadius: '18px', border: `1px solid ${theme.border}`, outline: 'none', backgroundColor: 'transparent', color: theme.text, fontSize: '16px' }}
                      />
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{ position: 'absolute', top: '-10px', left: '15px', backgroundColor: theme.card, padding: '0 8px', fontSize: '12px', color: theme.accent, fontWeight: '600' }}>{t('cvv')}</label>
                      <input
                        required
                        type="password"
                        maxLength={3}
                        className="input-focus"
                        style={{ width: '100%', padding: '18px', borderRadius: '18px', border: `1px solid ${theme.border}`, outline: 'none', backgroundColor: 'transparent', color: theme.text, fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="hover-scale"
                    style={{
                      width: '100%',
                      backgroundColor: theme.accent,
                      background: 'linear-gradient(135deg, #4A6741 0%, #2D4A23 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '22px',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginTop: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: '0 10px 25px rgba(45, 74, 35, 0.25)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    {isProcessing ? (
                      <span style={{ animation: 'pulse 1.5s infinite' }}>{t('verifying')}</span>
                    ) : (
                      <><Lock size={18} /> {t('paySecurely')}</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary (Dynamic) */}
            <div>
              <div style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '40px', border: `1px solid ${theme.border}` }}>
                <h3 style={{ margin: '0 0 30px 0', fontSize: '22px', color: theme.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {t('basketTitle')}
                  <ShoppingBag size={20} color={theme.subtext} />
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px', maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.length === 0 ? (
                    <p style={{ color: theme.subtext, fontStyle: 'italic' }}>{t('basketEmpty')}</p>
                  ) : (
                    cart.map((id, index) => {
                      const item = products.find(p => p.id === id);
                      if (!item) return null;
                      return (
                        <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ width: '60px', height: '60px', borderRadius: '15px', backgroundColor: theme.card, backgroundImage: `url(${item.image})`, backgroundSize: 'cover', border: `1px solid ${theme.border}` }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: '500', color: theme.text }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: theme.subtext }}>{item.category}</div>
                          </div>
                          <div style={{ fontWeight: '600', color: theme.text }}>₹{item.price}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={{ borderTop: `1px dashed ${theme.border}`, margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: theme.subtext }}>
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '14px', color: theme.subtext }}>
                  <span>Shipping</span>
                  <span style={{ color: theme.accent, fontWeight: 'bold' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: theme.text }}>
                  <span>{t('totalAmount')}</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'start', marginBottom: '15px' }}>
                    <ShieldCheck color={theme.accent} size={20} style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: theme.text }}>{t('dataProtection')}</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: theme.subtext, lineHeight: '1.5' }}>{t('dataProtectionDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <footer style={{ marginTop: 'auto', paddingTop: '80px', color: theme.subtext, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          {t('checkoutFooter')}
        </footer>
      </div>
    </div>
  );
}
