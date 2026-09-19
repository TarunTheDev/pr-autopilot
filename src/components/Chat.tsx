import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, AlertTriangle } from 'lucide-react';
import { VerdictData } from '../data/demoData';
import { askFollowUp } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const SUGGESTED = [
  { label: 'Why did requirement 3 fail?', color: '#3a86ff' },
  { label: 'How to fix failing requirements?', color: '#06d6a0' },
  { label: 'Generate additional test cases', color: '#ffbe0b' },
  { label: 'Explain the confidence score', color: '#ff5d8f' },
];

export const Chat: React.FC<{ verdict: VerdictData }> = ({ verdict }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKey = useAppStore((s) => s.settings.geminiApiKey);
  const addToast = useAppStore((s) => s.addToast);
  const isApiKeySet = Boolean(apiKey && apiKey !== 'YOUR_API_KEY');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!isApiKeySet) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: 'To use the chat feature, please add your Gemini API key in Settings. Without it, I can only provide limited guidance based on the current analysis.',
            timestamp: new Date(),
          }]);
          setIsLoading(false);
        }, 500);
        return;
      }

      const reply = await askFollowUp({ question: text, verdict, apiKey });
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: reply,
        timestamp: new Date(),
      }]);
    } catch {
      setError('Failed to get response. Please try again.');
      addToast('Failed to send message', 'error');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[480px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 border-2 border-ink rounded-2xl bg-retro-pink flex items-center justify-center shadow-retro-sm rotate-3 mb-4">
              <Bot size={26} className="text-ink" />
            </div>
            <h3 className="font-display-retro text-base text-ink">ASK THE AGENT</h3>
            <p className="font-mono text-xs text-ink/50 mt-2 mb-5 max-w-[240px] leading-relaxed">
              Interrogate the verdict — why something failed and how to fix it.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleSend(q.label)}
                  className="retro-chip !text-[11px]"
                >
                  <span className="w-2 h-2 rounded-full border border-ink" style={{ background: q.color }} />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, rotate: msg.role === 'user' ? 1 : -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 border-2 border-ink rounded-lg flex items-center justify-center shrink-0 shadow-retro-sm ${
                  msg.role === 'agent' ? 'bg-retro-pink text-ink' : 'bg-retro-blue text-paper'
                }`}
              >
                {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className={`group relative max-w-[85%] border-2 border-ink rounded-xl p-3.5 shadow-retro-sm ${
                  msg.role === 'agent' ? 'bg-[#fffdf6] rounded-tl-sm' : 'bg-retro-blue text-paper rounded-tr-sm'
                }`}
              >
                <p className={`font-mono text-xs leading-relaxed ${msg.role === 'agent' ? 'text-ink' : 'text-paper'}`}>
                  {msg.content}
                </p>
                <div className={`flex items-center justify-between mt-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className={`font-mono text-[10px] ${msg.role === 'agent' ? 'text-ink/40' : 'text-paper/60'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyMessage(msg.id, msg.content)}
                    aria-label="Copy message"
                    className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded ${
                      msg.role === 'agent' ? 'hover:bg-paper-dim text-ink/50' : 'hover:bg-white/20 text-paper/70'
                    }`}
                  >
                    {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-9 h-9 border-2 border-ink rounded-lg bg-retro-pink flex items-center justify-center shrink-0 shadow-retro-sm">
              <Bot size={16} className="text-ink" />
            </div>
            <div className="bg-[#fffdf6] border-2 border-ink rounded-xl rounded-tl-sm p-4 shadow-retro-sm">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full border border-ink"
                    animate={{ y: [0, -7, 0], backgroundColor: ['#16130e', '#ff5d8f', '#16130e'] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
                <span className="font-mono text-xs text-ink/50 ml-2">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center font-mono text-xs font-bold text-ink p-3 bg-retro-red/25 rounded-xl border-2 border-ink flex items-center justify-center gap-2"
          >
            <AlertTriangle size={14} />
            {error}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="p-3.5 border-t-2 border-ink bg-paper-dim">
        <div className="flex gap-2.5">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
              placeholder="Ask a follow-up about this PR..."
              className="w-full bg-[#fffdf6] border-2 border-ink rounded-xl px-4 py-3 font-mono text-xs text-ink focus:outline-none focus:ring-4 focus:ring-retro-yellow/40 transition-shadow placeholder:text-ink/35 shadow-retro-sm"
              disabled={isLoading}
              maxLength={500}
            />
            <motion.span
              animate={{ opacity: input.length > 0 ? 1 : 0 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-ink/40"
            >
              {input.length}/500
            </motion.span>
          </div>
          <button
            type="button"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="retro-btn retro-btn-yellow px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="font-mono text-[10px] text-ink/40 mt-2 text-center">
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};