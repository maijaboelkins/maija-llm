"use client";
import { useState, useRef, useEffect } from "react";

function Sparkle({ size = 24, opacity = 1, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0, opacity, ...style }}>
      <path d="M16 0C17.6 6.4 25.6 14.4 32 16C25.6 17.6 17.6 25.6 16 32C14.4 25.6 6.4 17.6 0 16C6.4 14.4 14.4 6.4 16 0Z" fill="#FF78FB" />
    </svg>
  );
}

const SUGGESTED_PROMPTS = [
  "Tell me about your work at Department of Growth",
  "What have you learned as an AI Fellow?",
  "What makes your design approach unique?",
];

function renderMarkdown(text) {
  return text.split("\n\n").map((para, i, arr) => {
    const parts = [];
    const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(para)) !== null) {
      if (match.index > lastIndex) parts.push(para.slice(lastIndex, match.index));
      if (match[2]) parts.push(<strong key={match.index}><em>{match[2]}</em></strong>);
      else if (match[3]) parts.push(<strong key={match.index}>{match[3]}</strong>);
      else if (match[4]) parts.push(<em key={match.index}>{match[4]}</em>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < para.length) parts.push(para.slice(lastIndex));
    return <p key={i} style={{ margin: 0, marginBottom: i < arr.length - 1 ? 10 : 0 }}>{parts}</p>;
  });
}

function ChatMessage({ role, content }) {
  if (role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "75%", borderRadius: 16, padding: "12px 18px",
          backgroundColor: "#ecedf1", fontSize: 15, lineHeight: 1.6, color: "#1a1a1a",
        }}>{content}</div>
      </div>
    );
  }
  return (
    <div style={{ fontSize: 15, lineHeight: 1.7, color: "#2a2a2a" }}>
      {renderMarkdown(content)}
    </div>
  );
}

function FollowUpPrompts({ onSend }) {
  const prompts = [
    "What's your favorite part of building?",
    "How do you approach product strategy?",
    "How do you balance design and engineering?",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
      {prompts.map((p, i) => (
        <button key={i} onClick={() => onSend(p)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 4px",
          border: "none", background: "none", cursor: "pointer", fontSize: 14.5,
          color: "#777", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
          width: "100%", borderRadius: 8, transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.background = "rgba(0,0,0,0.025)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#777"; e.currentTarget.style.background = "none"; }}>
          <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.4 }}>
            <path d="M7 7l10 10M7 17V7h10" />
          </svg>
          {p}
        </button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ccc",
          animation: "dotBounce 1.2s ease-in-out infinite", animationDelay: `${i * 150}ms`,
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const send = async (content) => {
    if (!content.trim()) return;
    const userMsg = { role: "user", content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputValue("");
    setIsTyping(true);
    if (taRef.current) taRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n")
        || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again!" }]);
    }
    setIsTyping(false);
  };

  const showWelcome = messages.length === 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      backgroundColor: "#f7f8fa", fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #e5e5e5", backgroundColor: "#fff",
        padding: "0 24px", height: 60, display: "flex",
        alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkle size={22} />
          <span style={{
            fontSize: 20, fontWeight: 400, color: "#1a1a1a",
            fontFamily: "'IvyOra Text', 'Noto Serif', serif",
            letterSpacing: "-0.01em",
          }}>MaijaLLM</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { paths: ["M3 12a9 9 0 0 1 15-6.7L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-15 6.7L3 16", "M3 21v-5h5"], onClick: () => { setMessages([]); setInputValue(""); }, title: "Reset" },
            { paths: ["M12 16v-4", "M12 8h.01"], circle: true, title: "Info" },
            { paths: ["M18 6L6 18", "M6 6l12 12"], title: "Close" },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} title={btn.title} style={{
              width: 36, height: 36, border: "none", background: "none",
              borderRadius: 8, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <svg width={20} height={20} fill="none" stroke="#777" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                {btn.circle && <circle cx={12} cy={12} r={10} />}
                {btn.paths.map((d, j) => <path key={j} d={d} />)}
              </svg>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 28px", width: "100%" }}>
          {showWelcome ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <h2 style={{
                fontSize: 28, fontWeight: 400, color: "#2a2a2a",
                fontFamily: "'IvyOra Text', 'Noto Serif', serif",
                letterSpacing: "-0.01em", margin: 0,
              }}>Hey, ask away.</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => send(p)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 6px", border: "none", background: "none",
                    cursor: "pointer", fontSize: 15, color: "#666",
                    fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                    width: "100%", borderRadius: 8, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.background = "rgba(0,0,0,0.025)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#666"; e.currentTarget.style.background = "none"; }}>
                    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.45 }}>
                      <path d="M7 7l10 10M7 17V7h10" />
                    </svg>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {messages.map((m, i) => (
                <div key={i}>
                  <ChatMessage role={m.role} content={m.content} />
                  {m.role === "assistant" && i === messages.length - 1 && !isTyping && (
                    <FollowUpPrompts onSend={send} />
                  )}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div style={{
        borderTop: "1px solid #e5e5e5", backgroundColor: "#fff",
        padding: "16px 24px", flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center",
            borderRadius: 28, border: "1px solid #ddd",
            backgroundColor: "#fff", padding: "0 10px 0 0",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
            <textarea
              ref={taRef} value={inputValue}
              onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"; }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(inputValue); } }}
              placeholder="Ask about Maija..."
              rows={1}
              style={{
                flex: 1, resize: "none", border: "none",
                padding: "16px 12px 16px 22px", fontSize: 15,
                fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a",
                outline: "none", minHeight: 52, maxHeight: 200,
                lineHeight: 1.4, backgroundColor: "transparent", borderRadius: 28,
              }}
              onFocus={e => {
                const w = e.target.parentElement;
                w.style.borderColor = "#FF78FB";
                w.style.boxShadow = "0 0 0 3px rgba(255,120,251,0.12)";
              }}
              onBlur={e => {
                const w = e.target.parentElement;
                w.style.borderColor = "#ddd";
                w.style.boxShadow = "none";
              }}
            />
            <button onClick={() => send(inputValue)} disabled={!inputValue.trim()} style={{
              width: 36, height: 36, flexShrink: 0, borderRadius: 12,
              border: "none", backgroundColor: "#FF78FB", color: "#fff",
              cursor: inputValue.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: inputValue.trim() ? 1 : 0.4, transition: "all 0.2s",
            }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a href="https://maijaboelkins.com" target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: "#aaa", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#FF78FB"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
            >Curious to see more? Head to <span style={{ textDecoration: "underline" }}>maijaboelkins.com</span> ❤︎</a>
          </div>
        </div>
      </div>
    </div>
  );
}
