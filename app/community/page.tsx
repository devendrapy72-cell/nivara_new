"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, ThumbsUp, Share2, Plus, UserCircle2, Sun, Moon, Globe, CheckCircle2, X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CommunityPage() {
  const { lang, setLang, isDark, toggleTheme, theme, t, communityPosts, addPost } = useApp();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim()) {
      addPost({
        author: "You",
        role: "User",
        title: newPostTitle,
        content: newPostContent,
        tag: "Question"
      });
      setShowNewPost(false);
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: theme.text }}>

      {/* BACKGROUND IMAGE LAYER */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/aes1.png')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(253, 252, 251, 0.9)', zIndex: -1 }} />

      {/* TOP CONTROLS */}
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

        {/* Navigation */}
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('backHomeFull')}
          </Link>
          <button onClick={() => setShowNewPost(true)} style={{
            backgroundColor: theme.accent, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', boxShadow: '0 4px 12px rgba(45, 74, 35, 0.2)'
          }}>
            <Plus size={18} /> {t('newPost')}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '42px', color: theme.text, marginBottom: '10px' }}>{t('forumTitle')}</h1>
          <p style={{ color: theme.subtext, marginBottom: '50px', fontSize: '18px' }}>{t('forumSubtitle')}</p>

          {/* Forum Feed - Threaded Layout */}
          <div key={lang} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {communityPosts.map((post) => (
              <div key={post.id} style={{
                position: 'relative'
              }}>
                {/* Thread Line */}
                {post.expertReply && <div style={{ position: 'absolute', top: '40px', left: '35px', bottom: '40px', width: '2px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', zIndex: 0 }} />}

                {/* Main Post Card */}
                <div style={{
                  backgroundColor: theme.card, padding: '30px', borderRadius: '30px', border: `1px solid ${theme.border}`, boxShadow: '0 5px 20px rgba(0,0,0,0.03)', position: 'relative', zIndex: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.success} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{post.author.charAt(0)}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: theme.text }}>{post.author}</h4>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', backgroundColor: post.role === 'User' ? (isDark ? 'rgba(255,255,255,0.1)' : '#eee') : theme.accent, color: post.role === 'User' ? theme.subtext : 'white' }}>{post.role}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: theme.subtext }}>{post.time}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '5px 12px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F7E9', color: theme.accent, borderRadius: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {post.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '22px', marginBottom: '10px', color: theme.text, fontWeight: '500', lineHeight: '1.3' }}>{post.title}</h3>
                  <p style={{ color: theme.subtext, lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>{post.content}</p>

                  <div style={{ display: 'flex', gap: '25px', paddingTop: '15px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}` }}>
                    <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: theme.subtext, cursor: 'pointer' }}>
                      <ThumbsUp size={18} /> <span style={{ fontSize: '14px' }}>{post.likes}</span>
                    </button>
                    <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: theme.subtext, cursor: 'pointer' }}>
                      <MessageSquare size={18} /> <span style={{ fontSize: '14px' }}>{post.replies}</span>
                    </button>
                    <button style={{ background: 'none', border: 'none', marginLeft: 'auto', color: theme.subtext, cursor: 'pointer' }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expert Reply Card */}
                {post.expertReply && (
                  <div style={{
                    marginLeft: '40px', marginTop: '-15px', position: 'relative', zIndex: 0
                  }}>
                    <div style={{
                      backgroundColor: isDark ? 'rgba(30, 35, 30, 0.8)' : '#F8FBF8', padding: '25px', paddingLeft: '40px',
                      borderRadius: '0 0 30px 30px', border: `1px solid ${theme.border}`, borderTop: 'none'
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <CheckCircle2 size={16} color={theme.accent} fill={isDark ? theme.text : "white"} />
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Expert Answer</span>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
                        <img src={`https://ui-avatars.com/api/?name=${post.expertReply.author}&background=random`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.text }}>{post.expertReply.author}</span>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', backgroundColor: theme.accent, color: 'white' }}>{post.expertReply.role}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: theme.subtext }}>{post.expertReply.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer style={{ marginTop: '80px', color: theme.subtext, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          {t('communityFooter')}
        </footer>
      </div>

      {/* NEW POST MODAL */}
      {showNewPost && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: theme.card, width: '90%', maxWidth: '600px', borderRadius: '40px', padding: '40px', border: `1px solid ${theme.border}`, position: 'relative' }}>
            <button onClick={() => setShowNewPost(false)} style={{ position: 'absolute', right: '30px', top: '30px', border: 'none', background: 'none', cursor: 'pointer', color: theme.text }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '32px', marginBottom: '30px', color: theme.text, fontWeight: '300' }}>{t('newPost')}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: theme.subtext }}>Topic / Question</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. White spots on Basil..."
                  style={{ width: '100%', padding: '15px', borderRadius: '15px', border: `1px solid ${theme.border}`, backgroundColor: theme.widget, color: theme.text, fontSize: '16px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: theme.subtext }}>Details</label>
                <textarea
                  rows={5}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  style={{ width: '100%', padding: '15px', borderRadius: '15px', border: `1px solid ${theme.border}`, backgroundColor: theme.widget, color: theme.text, fontSize: '16px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" style={{ marginTop: '10px', padding: '15px', borderRadius: '20px', backgroundColor: theme.accent, color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Send size={18} /> Post Question
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}