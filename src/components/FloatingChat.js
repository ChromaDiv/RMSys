'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Brain, X, MessageCircle } from 'lucide-react';

export default function FloatingChat() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I analyzed your recent sales. Revenue is up 15% this week, but cheese stock is critical. How can I help?' }
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages([...messages, { role: 'user', text: query }]);
    setQuery('');
    setIsAnalyzing(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsAnalyzing(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "Based on historical trends, I recommend increasing the price of 'Special Chicken Karahi' by Rs. 200. Demand is high on weekends, so revenue should increase by approx Rs. 15,000/week."
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-card rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto bg-white/90 dark:bg-[#121212]/95 backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={18} />
                <span>Ask RestroAI</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                    {msg.role === 'ai' ? <Brain size={14} /> : <span className="font-bold text-xs">U</span>}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'ai'
                    ? 'bg-white dark:bg-[#1a1a1d] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5'
                    : 'bg-indigo-600 text-white'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                    <Brain size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#1a1a1d] border border-gray-100 dark:border-white/5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white dark:bg-[#0f0f11] border-t border-gray-100 dark:border-white/5">
              <form onSubmit={handleSend} className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 font-medium text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isAnalyzing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="pointer-events-auto p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center relative group"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={28} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip on Hover */}
        {!isChatOpen && (
          <span className="absolute right-full mr-4 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask AI
          </span>
        )}
      </motion.button>
    </div>
  );
}
