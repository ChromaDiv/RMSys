'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, User, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { setDemo } = useDemo();

  const [view, setView] = useState(initialView); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset state when modal opens or view changes
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError(null);
      setLoading(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setSuccess(null);
    }
  }, [isOpen, initialView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDemo(false); // Clear demo mode


    try {
      if (view === 'login') {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result.error) {
          const msg = result.error.includes('Email not verified')
            ? t('auth.errors.emailNotConfirmed')
            : (t('auth.errors.invalidCredentials') || 'Invalid email or password');
          setError(msg);
        } else {
          router.push('/dashboard');
          onClose();
        }
      } else {
        // Signup
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: fullName,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.message.includes("already exists")) {
            setError(t('auth.errors.emailTaken'));
          } else {
            setError(data.message || t('auth.errors.unexpected'));
          }
        } else {
          setSuccess(t('auth.errors.accountCreated'));
          setEmail('');
          setPassword('');
          setFullName('');
        }
      }
    } catch (err) {
      setError(t('auth.errors.unexpected'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[2001]"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl bg-[#111] border border-white/10 relative">

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {view === 'login' ? t('auth.login.title') : t('auth.signup.title')}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {view === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-start gap-3">
                    <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {view === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('auth.signup.fullNameLabel')}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-indigo-500 outline-none transition-all"
                          placeholder={t('auth.signup.namePlaceholder')}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('auth.login.emailLabel')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-indigo-500 outline-none transition-all"
                        placeholder={t('auth.login.emailPlaceholder')}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('auth.login.passwordLabel')}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-indigo-500 outline-none transition-all"
                        placeholder={t('auth.login.passwordPlaceholder')}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : (view === 'login' ? t('auth.login.signInButton') : t('auth.signup.createButton'))}
                  </button>
                </form>

                {/* Google login removed */}

                <div className="text-center mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-500">
                    {view === 'login' ? t('auth.login.noAccount') : t('auth.signup.hasAccount')}{' '}
                    <button
                      onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                      className="text-white font-bold hover:underline ml-1"
                    >
                      {view === 'login' ? t('auth.login.createAccount') : t('auth.signup.logIn')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
