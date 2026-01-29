'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({
  size = 'medium',
  color = 'indigo',
  text = '',
  fullPage = false
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} text-${color}-500 dark:text-${color}-400`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 animate-pulse uppercase tracking-wider">
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-md">
        <div className="glass-card p-10 rounded-3xl border border-white/20 shadow-2xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
