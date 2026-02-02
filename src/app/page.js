'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Truck, Users, ChevronRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const { setDemo } = useDemo();
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const { scrollY } = useScroll();
  // Ultra-responsive smoothing: Low mass = instant start, High damping = no bounce
  const smoothScrollY = useSpring(scrollY, {
    mass: 0.1,
    stiffness: 120,
    damping: 20,
    restDelta: 0.001
  });

  // Map the smoothed scroll value to animation properties
  // Range [0, 700] is faster than 1200 but still gradual and smooth
  const width = useTransform(smoothScrollY, [0, 700], ['95%', '92%']);
  const maxWidth = useTransform(smoothScrollY, [0, 700], ['1400px', '1000px']);
  const height = useTransform(smoothScrollY, [0, 700], [80, 60]);
  const y = useTransform(smoothScrollY, [0, 700], [20, 35]); // Move down slightly as we scroll
  // Removed backgroundColor transform to allow CSS dark mode classes to work

  // Removed backgroundColor transform to allow CSS dark mode classes to work

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };
  const handleDemoClick = () => {
    setDemo(true);
    router.push('/dashboard');
  };

  const openAuth = (view) => {
    setAuthView(view);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-indigo-500/30">

      {/* Navbar */}
      {/* Navbar */}
      <motion.nav
        initial={{ width: '95%', maxWidth: '1400px', y: 20, borderRadius: 50 }}
        style={{
          width,
          maxWidth,
          height,
          y,
          borderRadius: 50,
        }}
        className="fixed z-[1000] left-0 right-0 mx-auto border border-transparent backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 overflow-hidden bg-white/90 dark:bg-white/10 shadow-xl shadow-black/10 dark:shadow-none border-black/10 dark:border-white/10"
      >
        <div className="w-full mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">RMSys</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-6">
            <button
              onClick={toggleLanguage}
              className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-[10px] md:text-sm transition-all flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={() => openAuth('login')} className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2 shrink-0">
              {t('landing.nav.logIn')}
            </button>
            <button onClick={() => openAuth('signup')} className="px-3 py-1.5 md:px-5 md:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-xs md:text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap shrink-0">
              {t('landing.nav.getStarted')}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              {t('landing.hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              {t('landing.hero.titlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t('landing.hero.titlePart2')}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 md:max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openAuth('signup')}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {t('landing.hero.startTrial')} <ArrowRight size={20} className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
              <button
                onClick={handleDemoClick}
                className="px-8 py-3.5 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold backdrop-blur-md transition-all flex items-center gap-2 group"
              >
                {t('landing.hero.viewDemo')}
                <ChevronRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BarChart3}
            title={t('landing.features.analyticsTitle')}
            desc={t('landing.features.analyticsDesc')}
            delay={0.1}
          />
          <FeatureCard
            icon={Truck}
            title={t('landing.features.supplyTitle')}
            desc={t('landing.features.supplyDesc')}
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title={t('landing.features.insightsTitle')}
            desc={t('landing.features.insightsDesc')}
            delay={0.3}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">{t('landing.pricing.title')}</h2>
            <p className="text-gray-400 text-lg">{t('landing.pricing.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Starter */}
            <PricingCard
              title={t('landing.pricing.starter.title')}
              price="$0"
              period={t('landing.pricing.month')}
              desc={t('landing.pricing.starter.desc')}
              features={t('landing.pricing.starter.features')}
              buttonText={t('landing.pricing.startTrial')}
              onAction={() => openAuth('signup')}
            />

            {/* Pro */}
            <PricingCard
              title={t('landing.pricing.pro.title')}
              price="$29"
              period={t('landing.pricing.month')}
              desc={t('landing.pricing.pro.desc')}
              popular
              mostPopularText={t('landing.pricing.mostPopular')}
              features={t('landing.pricing.pro.features')}
              buttonText={t('landing.pricing.startTrial')}
              onAction={() => openAuth('signup')}
            />

            {/* Enterprise */}
            <PricingCard
              title={t('landing.pricing.enterprise.title')}
              price={t('landing.pricing.custom')}
              period=""
              desc={t('landing.pricing.enterprise.desc')}
              features={t('landing.pricing.enterprise.features')}
              buttonText={t('landing.pricing.contactSales')}
              onAction={() => window.open('https://wa.me/923465410115', '_blank')}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-white/5 text-center text-gray-500 text-sm">
        <p>{t('landing.footer')}</p>
      </footer>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authView}
      />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors group"
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingCard({ title, price, period, desc, features, popular, mostPopularText, buttonText, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-3xl border flex flex-col relative overflow-hidden ${popular ? 'bg-indigo-600 border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20 z-10' : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20 transition-colors'}`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 text-xs font-bold rounded-bl-xl text-white">
          {mostPopularText}
        </div>
      )}

      <h3 className={`text-xl font-bold mb-2 ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
      <p className={`text-sm mb-6 ${popular ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>{desc}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{price}</span>
        {period && <span className={`text-sm font-bold ${popular ? 'text-indigo-200' : 'text-gray-500'}`}>{period}</span>}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium">
            <CheckCircle size={18} className={popular ? 'text-white' : 'text-indigo-500'} />
            <span className={popular ? 'text-indigo-50' : 'text-gray-600 dark:text-gray-300'}>{feat}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onAction}
        className={`w-full py-4 rounded-xl font-bold text-sm transition-all relative z-20 cursor-pointer ${popular ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20'}`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}
