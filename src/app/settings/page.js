'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Moon, Sun, User, Bell, Shield, ChevronRight, LogOut, CreditCard, Lock, Mail, CreditCard as CardIcon, Settings as SettingsIcon, DollarSign, Languages } from 'lucide-react';
import Modal from '@/components/Modal';
import { signOut } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SubscriptionModal from '@/components/SubscriptionModal';
import { Crown, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';

// ...

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const { isDemo } = useDemo();
  const [activeModal, setActiveModal] = useState(null);

  // Subscription State
  const [subscription, setSubscription] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/status');
      const data = await res.json();
      if (data.success) {
        setSubscription(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {

    // 2. Clear Session
    signOut({ callbackUrl: '/' });
  };

  const sections = [
    {
      title: t('settings.subscription.title'),
      items: [
        {
          icon: Crown,
          label: t('settings.subscription.currentPlan'),
          desc: isDemo
            ? t('settings.subscription.demoMode')
            : (subscription?.subscription === 'Pro' ? t('settings.subscription.proPlanUnlimited') : t('settings.subscription.freePlanLimited')),
          action: (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${subscription?.subscription === 'Pro'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 animate-pulse'
                }`}
            >
              {subscription?.subscription === 'Pro' ? t('settings.subscription.manageSubscription') : t('settings.subscription.upgradeToPro')}
            </button>
          )
        },
        ...((subscription?.subscription !== 'Pro' && !isDemo) ? [{
          icon: Zap,
          label: t('settings.subscription.planUsage'),
          desc: t('settings.subscription.viewLimits'),
          action: (
            <div className="flex flex-col gap-1 text-xs text-right text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              <span>{t('settings.subscription.usage.menuItems')}: {subscription?.usage?.menuItems || 0} / 5</span>
              <span>{t('settings.subscription.usage.inventory')}: {subscription?.usage?.inventory || 0} / 5</span>
              <span>{t('settings.subscription.usage.suppliers')}: {subscription?.usage?.suppliers || 0} / 5</span>
              <span>{t('settings.subscription.usage.orders')}: {subscription?.usage?.orders || 0} / 5</span>
            </div>
          )
        }] : [])
      ]
    },
    {
      title: t('settings.account'),
      items: [
        { icon: User, label: t('settings.profileInfo'), desc: t('settings.profileDesc'), onClick: () => setActiveModal('profile') },
        { icon: Shield, label: t('settings.security'), desc: t('settings.securityDesc'), onClick: () => setActiveModal('security') },
        { icon: CreditCard, label: t('settings.billing'), desc: t('settings.billingDesc'), onClick: () => setActiveModal('billing') },
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: t('settings.appearance'),
          desc: `${t('settings.currentlyIn')} ${theme} ${t('settings.mode')}`,
          action: (
            <div className="flex bg-gray-100 dark:bg-white/10 rounded-full p-1 border border-gray-200 dark:border-white/10">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'light' ? 'bg-white shadow-sm text-amber-500' : 'text-gray-400'}`}
              >
                <Sun size={16} fill={theme === 'light' ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-gray-700 shadow-sm text-indigo-400' : 'text-gray-400'}`}
              >
                <Moon size={16} fill={theme === 'dark' ? "currentColor" : "none"} />
              </button>
            </div>
          )
        },
        {
          icon: DollarSign,
          label: t('settings.currency'),
          desc: `${t('settings.activeCurrency')} ${currency.name}`,
          action: (
            <select
              value={currency.code}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.symbol}</option>
              ))}
            </select>
          )
        },
        {
          icon: Languages,
          label: t('settings.language'),
          desc: language === 'en' ? 'English' : 'العربية',
          action: (
            <div className="flex bg-gray-100 dark:bg-white/10 rounded-full p-1 border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${language === 'ar' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                عربي
              </button>
            </div>
          )
        },
        {
          icon: Bell,
          label: t('settings.notifications'),
          desc: t('settings.notificationsDesc'),
          action: (
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          )
        },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header - Floating Glass Theme */}
      <motion.div
        className="relative mb-8 px-6 py-6 md:px-10 md:py-8 rounded-3xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">
              {t('settings.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
              <SettingsIcon size={18} className="text-indigo-500" />
              {t('settings.subtitle')}
            </p>
          </div>
        </div>

        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">{section.title}</h2>
            <div className="glass-card overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 mx-auto">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  onClick={item.onClick}
                  className={`flex items-center gap-4 p-5 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors group ${item.onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <item.icon size={20} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>

                  {item.action ? item.action : <ChevronRight size={18} className="text-gray-400 rtl:rotate-180" />}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="pt-8">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20 border border-rose-500/20 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                <LogOut size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors">{t('settings.signOut')}</h3>
                <p className="text-xs text-gray-500 font-medium">{t('settings.signOutDesc')}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform group-hover:text-rose-500" />
          </motion.button>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={subscription?.subscription}
      />

      {/* Modals */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'profile' ? t('settings.editProfile') :
            activeModal === 'security' ? t('settings.securitySettings') :
              t('settings.billingManagement')
        }
      >
        {activeModal === 'profile' && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('settings.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input defaultValue="Admin User" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('settings.emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input defaultValue="admin@papacoffee.com" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-6 py-2 text-gray-500 font-bold">{t('common.cancel')}</button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">{t('settings.saveChanges')}</button>
            </div>
          </form>
        )}

        {activeModal === 'security' && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center gap-4 mb-6">
              <Shield className="text-indigo-600 dark:text-indigo-400" size={24} />
              <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">{t('settings.twoFactorEnabled')}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('settings.newPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="••••••••" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('settings.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="••••••••" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-6 py-2 text-gray-500 font-bold">{t('common.cancel')}</button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">{t('settings.updatePassword')}</button>
            </div>
          </form>
        )}

        {activeModal === 'billing' && (
          <div className="space-y-6">
            <div className={`glass-card p-6 rounded-2xl border transition-all ${subscription?.subscription === 'Pro'
              ? 'border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-black'
              : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {subscription?.subscription === 'Pro' ? t('settings.proPlan') : 'Free Plan'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {subscription?.subscription === 'Pro' ? '$29/month' : '$0/month'}
                  </p>
                </div>
                <span className={`px-3 py-1 text-white text-xs font-bold rounded-full ${subscription?.subscription === 'Pro' ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                  {t('settings.activePlan')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${subscription?.subscription === 'Pro' ? 'bg-indigo-500 w-full' : 'bg-gray-400 w-1/4'}`} />
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {subscription?.subscription === 'Pro' ? t('settings.nextBilling') : 'Upgrade to unlock all features'}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t('settings.paymentMethod')}</h4>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                <span className="font-medium text-gray-700 dark:text-gray-300">•••• 4242</span>
                <button className="ml-auto text-sm font-bold text-indigo-600 hover:underline">{t('settings.edit')}</button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-bold transition-all">{t('common.close')}</button>
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
}
