import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AuthModal from './AuthModal';

const DemoSignupModal = ({ isOpen, onClose }) => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[1001]"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-white dark:bg-[#0f0f11] border border-gray-300 dark:border-white/10">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <div className="relative z-10 p-6 flex flex-col items-center text-center">
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    onClick={onClose}
                  >
                    <X size={20} />
                  </button>

                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-6 mt-2">
                    <Sparkles size={32} />
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Unlock Full Access
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                    You are currently in Demo Mode. To create real orders, manage inventory, and save your data, please create a free account.
                  </p>

                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => setShowAuth(true)}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                      Create Free Account
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
                    >
                      Continue Exploring
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
          onClose(); // Optional: Close the demo prompt when auth modal closes? Maybe keep demo prompt open? 
          // User likely wants to signup. If they close auth modal, they might want to go back to demo.
          // Let's just close auth modal. If they succeed, auth modal handles redirect and demo mode clearing.
        }}
        initialView="signup"
      />
    </>
  );
};

export default DemoSignupModal;
