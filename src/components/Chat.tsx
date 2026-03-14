import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { VerdictData } from '../data/demoData';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

const suggestedQuestions = [
  "Why did requirement 3 fail?",
  "How do I fix the failing requirement?",
  "What tests should I add?"
];

export const Chat: React.FC<{ verdict: VerdictData }> = ({ verdict }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = text;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "YOUR_API_KEY") {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'agent', 
            content: "⚠️ API Key not configured. Please add your Gemini API key to the .env file to use the chat feature." 
          }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const systemPrompt = `You are PR Autopilot, an expert AI code reviewer. The user just evaluated a PR. Evaluation result: ${JSON.stringify(verdict)}. Answer the developer's follow-up question in under 80 words. Be direct, specific, mention file names if relevant. Sound like a senior engineer.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${userMsg}` }] }]
        })
      });

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { role: 'agent', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'agent', content: "Error connecting to AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-card border border-white/10 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-textMuted text-sm mt-10">
            Ask me anything about this evaluation.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-dark border border-white/10 text-textPrimary rounded-tl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-dark border border-white/10 rounded-2xl rounded-tl-none p-3 text-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-dark/50">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-textMuted hover:text-textPrimary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
