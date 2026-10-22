import React, { useState, useRef, useEffect } from 'react';

// Quick suggestion buttons — common questions
const QUICK_SUGGESTIONS = [
  '🌾 Farmer schemes',
  '👩 Women schemes',
  '🎓 Student schemes',
  '💰 Low income schemes',
  '🏠 Housing schemes'
];

function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 👋 I am your AI Scheme Assistant.\n\nAsk me anything about Government schemes — in English, Hindi, or Marathi!\n\nYou can also use the quick buttons below 👇',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText, loading]);

  // ===== VOICE INPUT SETUP =====
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript) {
        setInterimText(interimTranscript);
        setInput(interimTranscript);
      }

      if (finalTranscript) {
        setInterimText('');
        setInput(finalTranscript);
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          setIsListening(false);
          sendMessage(finalTranscript.trim());
        }, 1500);
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || loading) return;
    setInput('');
    setInterimText('');
    setIsListening(true);
    try { recognitionRef.current.start(); } catch (e) { console.log(e); }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    clearTimeout(silenceTimerRef.current);
    setIsListening(false);
    setInterimText('');
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async (voiceText) => {
    const textToSend = (voiceText || input).trim();
    if (!textToSend || loading) return;

    setInterimText('');
    setInput('');
    setLoading(true);

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: textToSend, time: timeNow };
    setMessages(prev => [...prev, userMsg]);

    try {
      setMessages(prev => {
        const historyToSend = prev.slice(-6).map(m => ({
          role: m.role,
          content: m.content
        }));

        fetch('http://localhost:5000/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, history: historyToSend })
        })
          .then(r => r.json())
          .then(data => {
            const reply = data.reply || data.message || 'Something went wrong, please try again!';
            const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(current => [...current, { role: 'assistant', content: reply, time: replyTime }]);
            setLoading(false);
          })
          .catch(() => {
            setMessages(current => [...current, {
              role: 'assistant',
              content: 'Connection error! Please check if backend server is running.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setLoading(false);
          });

        return prev;
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! 🗑️ Ask me anything about Government schemes — in English, Hindi, or Marathi!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <>
      {/* Floating button with unread indicator */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '62px', height: '62px', borderRadius: '50%',
          backgroundColor: '#1a237e', color: 'white', border: 'none',
          fontSize: '1.6rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(26,35,126,0.45)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px',
          width: '380px', maxWidth: 'calc(100vw - 48px)',
          height: '580px', maxHeight: 'calc(100vh - 140px)',
          backgroundColor: 'white', borderRadius: '18px',
          boxShadow: '0 10px 50px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 999
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
            color: 'white', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem'
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Scheme Assistant</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block' }}></span>
                  Online • Replies in your language
                </div>
              </div>
            </div>

            {/* Clear chat button */}
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '8px', padding: '5px 10px',
                cursor: 'pointer', fontSize: '0.75rem',
                color: 'white', fontWeight: 'bold'
              }}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Language badge */}
          <div style={{
            backgroundColor: '#e8f5e9', padding: '6px 14px',
            fontSize: '0.75rem', color: '#2e7d32', fontWeight: '600',
            textAlign: 'center', borderBottom: '1px solid #c8e6c9'
          }}>
            🌐 English • हिंदी • मराठी — Ask in any language!
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            backgroundColor: '#f0f4f8'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '88%',
                  backgroundColor: msg.role === 'user' ? '#1a237e' : 'white',
                  color: msg.role === 'user' ? 'white' : '#222',
                  padding: '11px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                  fontSize: '0.875rem', lineHeight: '1.6',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)', whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
                {msg.time && (
                  <span style={{ fontSize: '0.68rem', color: '#aaa', marginTop: '3px', paddingLeft: '4px', paddingRight: '4px' }}>
                    {msg.time}
                  </span>
                )}
              </div>
            ))}

            {/* Interim text preview */}
            {isListening && interimText && (
              <div style={{
                alignSelf: 'flex-end', maxWidth: '88%',
                backgroundColor: '#e3f2fd', color: '#1565c0',
                padding: '10px 14px', borderRadius: '16px 16px 3px 16px',
                fontSize: '0.875rem', fontStyle: 'italic',
                border: '1.5px dashed #1565c0'
              }}>
                {interimText}...
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'white', padding: '12px 16px',
                borderRadius: '16px 16px 16px 3px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: '#1565c0',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            )}

            {isListening && !interimText && (
              <div style={{
                alignSelf: 'center', backgroundColor: '#ffebee',
                color: '#c62828', padding: '7px 16px', borderRadius: '20px',
                fontSize: '0.8rem', fontWeight: 'bold',
                animation: 'pulse 1.2s infinite'
              }}>
                🎙️ Listening... speak now
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && !loading && (
            <div style={{
              padding: '8px 12px', borderTop: '1px solid #eee',
              backgroundColor: 'white', display: 'flex', gap: '6px',
              flexWrap: 'wrap'
            }}>
              {QUICK_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(suggestion)}
                  style={{
                    backgroundColor: '#e3f2fd', color: '#1565c0',
                    border: '1px solid #bbdefb', borderRadius: '16px',
                    padding: '5px 10px', fontSize: '0.75rem',
                    cursor: 'pointer', fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            display: 'flex', gap: '8px', padding: '10px 12px',
            borderTop: '1px solid #eee', backgroundColor: 'white', alignItems: 'center'
          }}>
            {/* Mic button */}
            {voiceSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={loading}
                title={isListening ? 'Stop listening' : 'Speak your question'}
                style={{
                  backgroundColor: isListening ? '#c62828' : '#e3f2fd',
                  color: isListening ? 'white' : '#1565c0',
                  border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', minWidth: '40px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  animation: isListening ? 'pulse 1.2s infinite' : 'none'
                }}
              >
                {isListening ? '⏹️' : '🎤'}
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
              placeholder={isListening ? '🎙️ Listening...' : 'Type in English, Hindi, or Marathi...'}
              disabled={loading}
              maxLength={300}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px',
                border: '1.5px solid #ddd', fontSize: '0.87rem', outline: 'none',
                backgroundColor: isListening ? '#fff8f8' : 'white',
                transition: 'border 0.2s'
              }}
              onFocus={e => e.target.style.border = '1.5px solid #1565c0'}
              onBlur={e => e.target.style.border = '1.5px solid #ddd'}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? '#ddd' : '#ff6f00',
                color: loading || !input.trim() ? '#999' : 'white',
                border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', minWidth: '40px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(198,40,40,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(198,40,40,0); }
          100% { box-shadow: 0 0 0 0 rgba(198,40,40,0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

export default ChatAssistant;
