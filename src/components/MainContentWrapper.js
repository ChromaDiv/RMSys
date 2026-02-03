'use client';

import { useSidebar } from '@/context/SidebarContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';

export default function MainContentWrapper({ children }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  // Normalize pathname to handle trailing slashes or case sensitivity
  const normalizedPath = pathname?.toLowerCase().replace(/\/$/, '') || '/';
  const isPublic = ['/', '/login', '/signup'].includes(normalizedPath);

  if (isPublic) {
    return <main className="flex-1 min-h-screen bg-transparent">{children}</main>;
  }

  return (
    <motion.main
      className="flex-1 min-w-0 transition-all duration-300 ease-in-out pt-[140px] md:pt-10 ltr:md:pl-[120px] rtl:md:pr-[120px]" // Aligned with sidebar top-10
    >
      <div className={clsx(
        "max-w-7xl mx-auto px-6 pb-6 md:px-12 md:pb-12 pt-0",
      )}>
        {children}
      </div>
    </motion.main>
  );
}
