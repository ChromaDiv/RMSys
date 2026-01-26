'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun, User, Bell, Shield, ChevronRight, LogOut, CreditCard, Lock, Mail, CreditCard as CardIcon, Settings as SettingsIcon } from 'lucide-react';
import Modal from '@/components/Modal';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';


export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'security', 'billing'

  const handleLogout = async () => {
    // 1. Clear Admin Bypass
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rms_admin_bypass');
    }

    // 2. Clear Supabase Session
    if (supabase) {
      await supabase.auth.signOut();
    }

    // 3. Redirect
    router.push('/');
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Update your name and email', onClick: () => setActiveModal('profile') },
        { icon: Shield, label: 'Security & Password', desc: 'Biometrics and 2FA', onClick: () => setActiveModal('security') },
        { icon: CreditCard, label: 'Billing Settings', desc: 'Manage your subscription', onClick: () => setActiveModal('billing') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Appearance',
          desc: `Currently in ${theme} mode`,
          action: (
            <button
              onClick={toggleTheme}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              Switch Theme
            </button>
          )
        },
        {
          icon: Bell,
          label: 'Notifications',
          desc: 'Email and push alerts',
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
        className="relative mb-8 px-6 py-6 md:px-10 md:py-8 rounded-[40px] bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">
              Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
              <SettingsIcon size={18} className="text-indigo-500" />
              Manage your account and preferences.
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

                  {item.action ? item.action : <ChevronRight size={18} className="text-gray-400" />}
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
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors">Sign Out</h3>
                <p className="text-xs text-gray-500 font-medium">Securely end your session</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-rose-500" />
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'profile' ? "Edit Profile" :
            activeModal === 'security' ? "Security Settings" :
              "Billing Management"
        }
      >
        {activeModal === 'profile' && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input defaultValue="Admin User" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input defaultValue="admin@papacoffee.com" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save Changes</button>
            </div>
          </form>
        )}

        {activeModal === 'security' && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center gap-4 mb-6">
              <Shield className="text-indigo-600 dark:text-indigo-400" size={24} />
              <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">Two-Factor Authentication is currently <strong>Enabled</strong>.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="••••••••" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="••••••••" className="w-full pl-12 p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Update Password</button>
            </div>
          </form>
        )}

        {activeModal === 'billing' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-black">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-white">Pro Plan</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-300">$29/month</p>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">Active</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-indigo-500" />
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">Next billing date: Feb 28, 2026</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Payment Method</h4>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                <span className="font-medium text-gray-700 dark:text-gray-300">•••• 4242</span>
                <button className="ml-auto text-sm font-bold text-indigo-600 hover:underline">Edit</button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-bold transition-all">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
}
