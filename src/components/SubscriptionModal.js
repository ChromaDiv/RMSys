'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function SubscriptionModal({ isOpen, onClose, currentPlan = 'Free' }) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const isPro = currentPlan === 'Pro';

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/upgrade', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        // Refresh page after a short delay to show success state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (data.error === 'Unauthorized') {
        alert('Please log in to upgrade your plan.');
        onClose();
      } else {
        alert(data.error || 'Failed to upgrade. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isPro ? t('subscriptionModal.yourProPlan') : t('subscriptionModal.unlockProFeatures')}>
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${isPro ? 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-orange-500/30' : 'bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-500/30'}`}>
          <Sparkles className="text-white w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isPro ? t('subscriptionModal.proMemberTitle') : t('subscriptionModal.upgradeToProTitle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium px-4">
            {isPro
              ? t('subscriptionModal.proMemberDesc')
              : t('subscriptionModal.freeMemberDesc')}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-bold">{t('subscriptionModal.features.menuCategories')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-bold">{t('subscriptionModal.features.menuItems')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-bold">{t('subscriptionModal.features.supplyChain')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-bold">{t('subscriptionModal.features.ordersCustomers')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-bold">{t('subscriptionModal.features.prioritySupport')}</span>
          </div>
        </div>

        {isPro ? (
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            {t('subscriptionModal.close')}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading || isSuccess}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group ${isSuccess
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {loading ? (
              <span className="animate-pulse text-sm">{t('subscriptionModal.processing')}</span>
            ) : isSuccess ? (
              <>
                <Check size={20} strokeWidth={3} />
                {t('subscriptionModal.success')}
              </>
            ) : (
              <>
                <Zap size={20} className="fill-white" />
                {t('subscriptionModal.upgradeNow')}
              </>
            )}
          </button>
        )}
      </div>
    </Modal>
  );
}
