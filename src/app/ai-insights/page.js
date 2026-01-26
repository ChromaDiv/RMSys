'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, Brain, ArrowRight } from 'lucide-react';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function AIInsightsPage() {

  // Mock Predictive Data
  const forecastData = [
    { day: 'Mon', actual: 140000, predicted: 141000 },
    { day: 'Tue', actual: 130000, predicted: 132000 },
    { day: 'Wed', actual: 120000, predicted: 124000 },
    { day: 'Thu', actual: 127800, predicted: 129000 },
    { day: 'Fri', actual: 189000, predicted: 195000 },
    { day: 'Sat', actual: 239000, predicted: 231000 },
    { day: 'Sun', actual: 349000, predicted: 348000 },
  ];

  // Simulator State
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  const baseRevenue = 1500000;
  const projectedRev = baseRevenue * (1 + (priceAdjustment / 100) * 0.8); // Simple elasticity model

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 p-2 min-h-screen relative pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      {/* Header - Floating Glass Theme */}
      <motion.div
        variants={itemVariants}
        className="flex flex-row items-center justify-between gap-4 px-6 py-6 md:px-10 md:py-8 rounded-[40px] bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden relative"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">
            Intelligence Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            Predictive analytics and business intelligence.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-sm border border-indigo-500/20 shrink-0">
          <Brain size={16} />
          <span className="hidden sm:inline">Model v4.0 Active</span>
        </div>

        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </motion.div>

      {/* Main Grid */}
      <div className="space-y-8">

        {/* Predictive Chart */}
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border border-white/40 dark:border-white/5 shadow-2xl shadow-indigo-500/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="text-emerald-500" size={28} />
              Revenue Forecast
            </h2>
            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full uppercase tracking-wider">
              +12% Projected
            </span>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={14} dy={15} />
                <YAxis width={100} axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={14} tickFormatter={v => `Rs.${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 25, 0.95)', border: 'none', borderRadius: '16px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" name="Actual Sales" />
                <Area type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={4} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" name="AI Prediction" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pricing Optimization & Order Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Optimization */}
          <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border border-white/40 dark:border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Price Optimization</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Zinger Burger</span>
                  <span className="text-emerald-500 font-bold text-sm">+5% Suggested</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">High demand with low price elasticity. Projected profit increase: +Rs. 12,500/mo.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Cold Coffee</span>
                  <span className="text-blue-500 font-bold text-sm">Bundle Suggested</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Combine with 'Club Sandwich' to increase average order value by 18%.</p>
              </div>
            </div>

            {/* Price Simulator */}
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Revenue Impact Simulator</h4>
              <div className="space-y-6">
                <input
                  type="range" min="-10" max="20" step="1"
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Price Change: <span className="text-indigo-600 font-bold">{priceAdjustment}%</span></span>
                  <div className="text-right">
                    <span className="block text-xs text-gray-400 uppercase font-bold">Projected Monthly Revenue</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">Rs. {projectedRev.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Pairings & Suggestions */}
          <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border border-white/40 dark:border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Order Correlation</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="text-orange-600 font-bold">85%</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Top Combo Pair</h4>
                  <p className="text-sm text-gray-500">Customers who buy **Fajita Pizza** also buy **Small Coke**. Create a "Pizza Party" combo.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-bold">12:00</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Peak Hour Logic</h4>
                  <p className="text-sm text-gray-500">Lactose-free milk demand peaks between **12 PM - 2 PM**. Ensure Prep-stock is ready by 11 AM.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Upsell Opportunity</h4>
                <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <p className="text-sm font-medium mb-3">Add 'Extra Cheese' prompt to all Burgers. Conversion rate: 24%.</p>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all text-xs">Configure Upsell Logic</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Existing Critical Alerts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border-l-8 border-l-amber-500 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={100} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Stock Alert</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-6 leading-relaxed">
              Premium Arabica Beans reaching low limit (`5kg`). Based on weekend orders, you need at least 15kg.
            </p>
            <button className="px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Restock Now <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border-l-8 border-l-indigo-500 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={100} className="text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Service Insight</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-6 leading-relaxed">
              "Fajita Pizza" prep time is increasing. Consider pre-batching topping mix during non-peak hours.
            </p>
            <button className="px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Review Ops <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
