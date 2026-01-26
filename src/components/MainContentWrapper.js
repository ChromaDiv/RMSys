'use client';

import { useSidebar } from '@/context/SidebarContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';

export default function MainContentWrapper({ children }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const isPublic = ['/', '/login', '/signup'].includes(pathname);

  if (isPublic) {
    return <main className="flex-1 min-h-screen bg-white dark:bg-black">{children}</main>;
  }

  return (
    <motion.main
      className="flex-1 min-w-0 transition-all duration-300 ease-in-out pt-[140px] md:pt-10 md:pl-[120px]" // Aligned with sidebar top-10
    >
      <div className={clsx(
        "max-w-7xl mx-auto px-6 pb-6 md:px-12 md:pb-12 pt-0 transition-all duration-300",
      )}>
        {children}
      </div>
    </motion.main>
  );
}
