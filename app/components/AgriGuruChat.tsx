'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Sprout, Minimize2, User, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AgriGuruChat() {
    const { theme, isDark } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
        { role: 'bot', content: "Namaste! I'm AgriGuru. Ask me anything about your plants or crops! 🌿" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Hide greeting after 10 seconds or when opened
    useEffect(() => {
        if (isOpen) {
            setShowGreeting(false);
        } else {
            const timer = setTimeout(() => setShowGreeting(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API (excluding initial greet for simplicity or mapping it correctly if needed)
            const apiHistory = messages.slice(1).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: apiHistory }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'bot', content: `⚠️ ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I couldn't reach the fields right now. Try again? 🌧️" }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'bot', content: "Connection error. Please check your internet. 📶" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>

            {/* Greeting Bubble */}
            {!isOpen && showGreeting && (
                <div style={{
                    marginBottom: '15px',
                    background: theme.card,
                    color: theme.text,
                    padding: '12px 20px',
                    borderRadius: '20px 20px 0 20px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.border}`,
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'float 3s ease-in-out infinite',
                    pointerEvents: 'auto'
                }}>
                    <span>Hi, have any doubts? 🌾</span>
                    <button onClick={() => setShowGreeting(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, opacity: 0.5 }}>
                        <X size={12} color={theme.text} />
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '25px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '20px',
                    pointerEvents: 'auto',
                    transformOrigin: 'bottom right',
                    animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.accent, color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: 'white', padding: '6px', borderRadius: '50%' }}>
                                <Sprout size={18} color={theme.accent} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>AgriGuru AI</h3>
                                <span style={{ fontSize: '10px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={10} /> Online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {msg.role === 'bot' && (
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Bot size={16} color="white" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                    backgroundColor: msg.role === 'user' ? theme.accent : (isDark ? 'rgba(255,255,255,0.1)' : '#F0F2F5'),
                                    color: msg.role === 'user' ? 'white' : theme.text,
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: theme.subtext, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <User size={16} color="white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Bot size={16} color="white" />
                                </div>
                                <div style={{ padding: '12px 16px', borderRadius: '20px 20px 20px 0', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F0F2F5', color: theme.subtext, fontSize: '12px', fontStyle: 'italic' }}>
                                    Thinking... 🌿
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '15px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '10px', alignItems: 'center', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about crops, pests..."
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '25px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.bg,
                                color: theme.text,
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: input.trim() ? theme.accent : theme.subtext,
                                border: 'none',
                                color: 'white',
                                cursor: input.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.3s'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover-scale"
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: theme.accent,
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(45, 74, 35, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    transition: 'transform 0.3s'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

        </div>
    );
}
