'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Truck, ClipboardList, Settings, Sparkles, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/context/SidebarContext';
import { supabase } from '@/lib/supabaseClient';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [userName, setUserName] = useState('Sohaib Latif');

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Use metadata name if available, else email username, else default
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Sohaib Latif';
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  // Sidebar is open if strictly expanded (pinned) OR hovered OR mobile menu is active
  const isSidebarOpen = !isCollapsed || isHovered || isMobileMenuOpen;

  // Interaction Lock to prevent accidental re-expansion after clicking
  const [isLocked, setIsLocked] = useState(false);

  if (['/', '/login', '/signup'].includes(pathname)) return null;

  const handleMouseEnter = () => {
    if (!isLocked) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Order Management', path: '/order-management', icon: ClipboardList },
    { name: 'Menu', path: '/menu', icon: Menu },
    { name: 'Supply Chain', path: '/supply-chain', icon: Truck },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    collapsed: { width: '90px', transition: { duration: 0.2, ease: 'easeInOut' } }, // Instant close
  };

  const SidebarContent = () => (
    <div className="flex flex-col p-4 transition-colors">
      <div className="hidden md:flex items-center gap-3 px-2 mb-6 mt-2">
        {/* Premium RMSys SVG Logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-2xl font-black whitespace-nowrap overflow-hidden tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-indigo-300">RMSys</span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "relative group flex items-center gap-3 rounded-full transition-all duration-300",
                isSidebarOpen ? "px-4 py-3" : "justify-center p-3 aspect-square mx-auto", // Circular when closed, pill when open
                isActive ? "text-indigo-900 dark:text-white font-bold bg-indigo-600/20 shadow-inner" : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white"
              )}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHovered(false);
                setIsLocked(true); // Lock hover expansion
                setTimeout(() => setIsLocked(false), 800); // Unlock after a moment
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon size={24} className={clsx("relative z-10 transition-transform duration-300 shrink-0", isActive && "scale-110 text-indigo-700 dark:text-indigo-300")} />

              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="relative z-10 font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className={clsx("flex items-center gap-3 rounded-full bg-white/5 transition-all", isSidebarOpen ? "p-2" : "p-2 justify-center aspect-square mx-auto")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase">
            {userName.charAt(0)}
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{userName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Admin Access</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-10 left-4 right-4 h-16 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full z-[100] flex items-center justify-between px-6 shadow-xl">
        {/* Mobile Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-indigo-300">RMSys</span>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-900 dark:text-white shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden md:block"
            onClick={() => setIsHovered(false)} // Optional: click to close if needed
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col fixed top-10 left-4 z-50 shadow-2xl rounded-[50px] border border-white/20 dark:border-white/10 overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-2xl max-h-[90vh]"
        // Height is auto (fit-content)
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        initial={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarContent />

      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-24 left-4 right-4 bottom-auto max-h-[calc(100vh-120px)] z-50 md:hidden bg-white dark:bg-[#0f0f11] shadow-2xl rounded-[40px] flex flex-col overflow-hidden origin-top"
              initial={{ opacity: 0, scaleY: 0.8, y: -20 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.8, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
