'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Truck, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[1000] border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">RMSys</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              Enterprise Restaurant OS
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              Manage your Restaurant Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tech Company.</span>
            </h1>
            <p className="text-xl text-gray-400 md:max-w-2xl mx-auto mb-10 leading-relaxed">
              RMSys brings AI-powered supply chain optimization, real-time analytics, and seamless order management to modern culinary businesses.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all">
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BarChart3}
            title="Live Analytics"
            desc="Real-time revenue tracking, sales forecasting, and peak hour analysis."
            delay={0.1}
          />
          <FeatureCard
            icon={Truck}
            title="Smart Supply Chain"
            desc="Automated inventory alerts, supplier management, and procurement AI."
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title="Customer Insights"
            desc="Track repeat customers, retention rates, and personalized marketing opportunities."
            delay={0.3}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the perfect plan for your culinary business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Starter */}
            <PricingCard
              title="Starter"
              price="$0"
              period="/mo"
              desc="Perfect for small cafes."
              features={['Basic POS', 'Inventory Tracking', '5 Staff Accounts', 'Email Support']}
            />

            {/* Pro */}
            <PricingCard
              title="Pro"
              price="$29"
              period="/mo"
              desc="For growing restaurants."
              popular
              features={['Everything in Starter', 'AI Analytics', 'Supply Chain Alerts', 'Unlimited Staff', 'WhatsApp Integration', 'Priority Support']}
            />

            {/* Enterprise */}
            <PricingCard
              title="Enterprise"
              price="Custom"
              period=""
              desc="For multi-location chains."
              features={['Everything in Pro', 'Custom API Access', 'Dedicated Account Manager', 'SLA', 'On-premise Deployment']}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 RMSys Inc. All rights reserved.</p>
      </footer>
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
      className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group"
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingCard({ title, price, period, desc, features, popular }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-3xl border flex flex-col relative overflow-hidden ${popular ? 'bg-indigo-600 border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20 z-10' : 'bg-white/5 border-white/10 hover:border-white/20 transition-colors'}`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 text-xs font-bold rounded-bl-xl text-white">
          MOST POPULAR
        </div>
      )}

      <h3 className={`text-xl font-bold mb-2 ${popular ? 'text-white' : 'text-white'}`}>{title}</h3>
      <p className={`text-sm mb-6 ${popular ? 'text-indigo-100' : 'text-gray-400'}`}>{desc}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black">{price}</span>
        {period && <span className={`text-sm font-bold ${popular ? 'text-indigo-200' : 'text-gray-500'}`}>{period}</span>}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium">
            <CheckCircle size={18} className={popular ? 'text-white' : 'text-indigo-500'} />
            <span className={popular ? 'text-indigo-50' : 'text-gray-300'}>{feat}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${popular ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        {price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
      </button>
    </motion.div>
  );
}
