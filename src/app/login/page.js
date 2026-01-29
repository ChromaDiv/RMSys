'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { setDemo } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');

    if (errorParam) {
      if (errorParam === 'TokenExpired') setError(t('auth.errors.tokenExpired') || 'Link expired');
      else if (errorParam === 'InvalidToken') setError(t('auth.errors.invalidToken') || 'Invalid link');
      else if (errorParam === 'SystemError') setError(t('auth.errors.systemError') || 'System error');
    }

    if (successParam === 'EmailVerified') {
      setSuccess(t('auth.errors.emailVerified') || 'Email verified!');
    }
  }, [searchParams, t]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Clear demo mode for authenticated users
    setDemo(false);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        // Map common errors if needed
        const msg = result.error.includes('Email not verified')
          ? t('auth.errors.emailNotConfirmed')
          : (t('auth.errors.invalidCredentials') || 'Invalid email or password');
        setError(msg);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(t('auth.errors.unexpected'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold">{t('auth.login.title')}</h2>
        <p className="text-gray-400 text-sm mb-6">{t('auth.login.subtitle')}</p>

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

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : t('auth.login.signInButton')}
          </button>
        </form>

        {/* Google login removed */}

        <p className="text-center mt-8 text-sm text-gray-500">
          {t('auth.login.noAccount')}{' '}
          <Link href="/signup" className="text-white font-bold hover:underline">
            {t('auth.login.createAccount')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
