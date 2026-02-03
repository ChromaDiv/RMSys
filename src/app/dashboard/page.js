'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { demoData } from '@/lib/demoData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, DollarSign, Sparkles, MessageCircle, ArrowRight, ShoppingCart, Activity, Truck, LayoutDashboard } from 'lucide-react';
import DemoSignupModal from '@/components/DemoSignupModal';

export default function Dashboard() {
  const { formatAmount } = useCurrency();
  const { t, language } = useLanguage();
  const { isDemo } = useDemo();
  const [stats, setStats] = useState([
    { title: t('dashboard.totalRevenue'), value: formatAmount(0), change: '+0%', icon: DollarSign, color: '#00b894' },
    { title: t('dashboard.activeOrders'), value: '0', change: '0', icon: TrendingUp, color: '#6c5ce7' },
    { title: t('dashboard.newCustomers'), value: '0', change: '+0%', icon: Users, color: '#0984e3' },
    { title: t('dashboard.lowStockItems'), value: '0', change: '0', icon: AlertTriangle, color: '#ff7675' },
  ]);

  const [topItems, setTopItems] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [supplyHealth, setSupplyHealth] = useState({ health: 0, lowStock: 0, activePartners: 0 });

  // Raw Data State for I18n reactivity
  const [rawOrders, setRawOrders] = useState([]);
  const [rawInventory, setRawInventory] = useState([]);
  const [rawSuppliers, setRawSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Mock Graph Data for now (can be made dynamic later if needed)
  const [graphData] = useState([
    { name: 'Mon', sales: 12000 },
    { name: 'Tue', sales: 15500 },
    { name: 'Wed', sales: 11000 },
    { name: 'Thu', sales: 18000 },
    { name: 'Fri', sales: 24000 },
    { name: 'Sat', sales: 32000 },
    { name: 'Sun', sales: 28000 },
  ]);

  async function fetchData() {
    if (isDemo) {
      // Use static demo data
      setRawOrders(demoData.orders);
      setRawInventory(demoData.inventory);
      setRawSuppliers(demoData.suppliers);
      setLoading(false);
    } else {
      // Fetch real data via API
      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/supply-chain')
        ]);

        const ordersData = await ordersRes.json();
        const inventoryData = await inventoryRes.json();

        if (ordersData.success && inventoryData.success) {
          const suppliersRes = await fetch('/api/suppliers');
          const suppliersData = await suppliersRes.json();

          setRawOrders(ordersData.data || []);
          setRawInventory(inventoryData.data || []);
          setRawSuppliers(suppliersData.success ? suppliersData.data : []);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error", error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [isDemo]);


  // Re-process data when raw data or language changes
  useEffect(() => {
    if (rawOrders.length > 0 || rawInventory.length > 0) {
      processDashboardData(rawOrders, rawInventory, rawSuppliers);
    }
  }, [rawOrders, rawInventory, rawSuppliers, t, formatAmount]);

  const processDashboardData = (orders, inventory, suppliers) => {
    try {
      // 1. Calculate Total Revenue
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

      // 2. Calculate Active Orders (Preparing or Ready)
      const activeOrders = orders.filter(o => ['Preparing', 'Ready'].includes(o.status)).length;

      // 3. New Customers (Mock logic: unique names count)
      const uniqueCustomers = new Set(orders.map(o => o.customer)).size;

      // 4. Low Stock Items (Stock < 20)
      const lowStockCount = inventory.filter(i => i.quantity < 20).length;

      // 5. Top Selling Items
      const itemCounts = {};
      orders.forEach(order => {
        const items = Array.isArray(order.items) ? order.items : order.items.split(',');
        items.forEach(i => {
          const cleanName = i.trim();
          itemCounts[cleanName] = (itemCounts[cleanName] || 0) + 1;
        });
      });

      const sortedItems = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({
          name: name,
          sold: count.toString(),
          progress: Math.min(100, count * 10), // Arbitrary scale for progress bar
          color: ['bg-orange-500', 'bg-red-500', 'bg-yellow-500'][Math.floor(Math.random() * 3)]
        }));

      setTopItems(sortedItems);

      setStats([
        { title: t('dashboard.totalRevenue'), value: formatAmount(totalRevenue), change: '+12%', icon: DollarSign, color: '#00b894' },
        { title: t('dashboard.activeOrders'), value: activeOrders.toString(), change: '+5', icon: TrendingUp, color: '#6c5ce7' },
        { title: t('dashboard.newCustomers'), value: uniqueCustomers.toString(), change: '+8%', icon: Users, color: '#0984e3' },
        { title: t('dashboard.lowStockItems'), value: lowStockCount.toString(), change: lowStockCount > 0 ? '-Alert' : 'OK', icon: AlertTriangle, color: '#ff7675' },
      ]);

      // 6. Generate AI Suggestions
      const suggestions = [];

      // Customer Outreach Suggestion
      const customerCounts = {};
      orders.forEach(o => customerCounts[o.customer] = (customerCounts[o.customer] || 0) + 1);
      const regularCustomers = Object.entries(customerCounts).filter(([_, count]) => count >= 2);

      if (regularCustomers.length > 0) {
        const topCust = regularCustomers[0][0];
        const custData = orders.find(o => o.customer === topCust);
        suggestions.push({
          type: 'outreach',
          title: t('data.suggestions.retentionTitle'),
          content: t('data.suggestions.retentionBody').replace('{name}', `<span dir="ltr" class="font-bold text-left inline-block">${topCust}</span>`),
          action: t('dashboard.contactWhatsapp'),
          link: `https://wa.me/${custData.phone || ''}`,
          icon: Users,
          color: 'text-rose-500'
        });
      }

      // Supply Chain Suggestion
      const criticalItems = inventory.filter(i => i.status === 'Critical');
      if (criticalItems.length > 0) {
        suggestions.push({
          type: 'supply',
          title: t('data.suggestions.procurementTitle'),
          content: t('data.suggestions.procurementBody')
            .replace('{item}', `<span dir="ltr" class="font-bold text-left inline-block">${criticalItems[0].item}</span>`)
            .replace('{supplier}', criticalItems[0].supplier),
          action: t('common.edit'),
          link: '/supply-chain',
          icon: ShoppingCart,
          color: 'text-amber-500'
        });
      } else {
        suggestions.push({
          type: 'supply',
          title: t('data.suggestions.optimizationTitle'),
          content: t('data.suggestions.optimizationBody'),
          action: t('common.edit'),
          link: '/ai-insights',
          icon: Activity,
          color: 'text-indigo-500'
        });
      }

      setAiSuggestions(suggestions);

      // 7. Supply Chain Strategic Metrics
      const goodItems = inventory.filter(i => i.status === 'Good').length;
      const totalInventory = inventory.length;
      const health = totalInventory > 0 ? Math.round((goodItems / totalInventory) * 100) : 0;

      setSupplyHealth({
        health,
        lowStock: lowStockCount,
        activePartners: suppliers.length
      });

    } catch (error) {
      console.error("Error processing dashboard data:", error);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header - Floating Glass Theme */}
      <motion.div
        className="glass-panel relative mb-8 px-6 py-6 md:px-10 md:py-8 rounded-3xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 flex flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
              <LayoutDashboard size={18} className="text-indigo-500" />
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden md:flex items-center gap-2 px-4 py-2 ${isDemo ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'} rounded-full text-xs font-bold uppercase tracking-widest border border-white/10`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDemo ? 'bg-indigo-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemo ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
              </span>
              {isDemo ? 'Demo Mode' : t('common.liveSystem')}
            </span>
            <span className="text-sm font-bold text-gray-400">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div
                className="p-3 rounded-xl bg-opacity-20 flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stat.value}</span>
                  <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <motion.div
          className="glass-card lg:col-span-2 p-6 rounded-3xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{t('dashboard.revenueOverview')}</h2>
            <select className="bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="w-full h-[250px] md:h-[300px] min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={graphData.map(d => ({ ...d, name: t(`dates.${d.name.toLowerCase()}`) || d.name }))}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatAmount(value, false)} />
                <Tooltip
                  formatter={(value) => [formatAmount(value), 'Sales']}
                  contentStyle={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6c5ce7" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Suggestion Widget */}
        <motion.div
          className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col min-h-[400px]"
          variants={itemVariants}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Sparkles size={24} className="animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">{t('dashboard.proactiveInsights')}</h2>
          </div>

          <div className="space-y-6 flex-1">
            <AnimatePresence mode="popLayout">
              {aiSuggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white dark:bg-white/10 ${s.color}`}>
                      <s.icon size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{s.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>') }} />

                  {s.type === 'outreach' ? (
                    <button
                      onClick={() => {
                        if (isDemo) setShowDemoModal(true);
                        else window.open(s.link, '_blank');
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <MessageCircle size={14} fill="currentColor" />
                      {t('dashboard.contactWhatsapp')}
                    </button>
                  ) : (
                    <Link
                      href={s.link}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                      {s.action}
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {aiSuggestions.length === 0 && !loading && (
              <p className="text-sm text-gray-400 text-center py-10">Running pattern analysis...</p>
            )}
          </div>

          <button className="mt-6 text-xs font-bold text-gray-400 hover:text-indigo-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
            {t('dashboard.refreshAnalysis')}
          </button>
        </motion.div>
      </div>

      {/* Strategic Supply Chain Insights Section */}
      <motion.div
        className="mt-8 mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Activity size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.supplyChainInsights')}</h2>
          <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full animate-pulse">Live Dashboard</span>
        </div>

        <div className="glass-card p-6 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-6 border border-white/60 dark:border-white/5">
          {/* Inventory Health */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between h-32 relative overflow-hidden group">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">{t('dashboard.inventoryHealth')}</span>
            <div className="z-10">
              <span className="text-4xl font-black text-emerald-500">{supplyHealth.health}%</span>
              <p className="text-xs text-gray-500 font-bold mt-1">Operational Efficiency</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={80} className="text-emerald-500 transform translate-x-4 translate-y-4" />
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden absolute bottom-0 left-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${supplyHealth.health}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          {/* Critical Stock */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between h-32 relative overflow-hidden group">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">{t('dashboard.criticalAlerts')}</span>
            <div className="z-10">
              <span className="text-4xl font-black text-rose-500">{supplyHealth.lowStock}</span>
              <p className="text-xs text-gray-500 font-bold mt-1">Items Below Threshold</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={80} className="text-rose-500 transform translate-x-4 translate-y-4" />
            </div>
          </div>

          {/* Active Partners */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between h-32 relative overflow-hidden group">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">{t('dashboard.activeNetwork')}</span>
            <div className="z-10">
              <span className="text-4xl font-black text-indigo-500">{supplyHealth.activePartners}</span>
              <p className="text-xs text-gray-500 font-bold mt-1">Verified Suppliers</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <Truck size={80} className="text-indigo-500 transform translate-x-4 translate-y-4" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Row 3: Quick Actions & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Quick Actions */}
        <motion.div
          className="glass-card p-8 rounded-2xl"
          variants={itemVariants}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('settings.quickActions.newOrder'), icon: TrendingUp, color: 'bg-indigo-500', href: '/supply-chain?action=new-order' },
              { label: t('settings.quickActions.addItem'), icon: DollarSign, color: 'bg-emerald-500', href: '/menu?action=add-item' },
              { label: t('settings.quickActions.reports'), icon: AlertTriangle, color: 'bg-amber-500', href: '/ai-insights' },
              { label: t('settings.quickActions.settings'), icon: Users, color: 'bg-gray-500', href: '/settings' },
            ].map((action, i) => (
              <div key={i} className="block w-full">
                {['/menu?action=add-item'].includes(action.href) ? (
                  <motion.button
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (isDemo && action.href.includes('add-item')) {
                        setShowDemoModal(true);
                      } else {
                        window.location.href = action.href;
                      }
                    }}
                    className="w-full h-full flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group"
                  >
                    <div className={`p-3 rounded-full text-white shadow-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{action.label}</span>
                  </motion.button>
                ) : (
                  <Link href={action.href} className="block w-full h-full">
                    <motion.button
                      whileHover={{ y: -5 }}
                      className="w-full h-full flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group"
                    >
                      <div className={`p-3 rounded-full text-white shadow-lg ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{action.label}</span>
                    </motion.button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div
          className="glass-card p-8 rounded-2xl"
          variants={itemVariants}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.topSellingItems')}</h2>
          <div className="space-y-6" dir="ltr">
            {loading ? (
              <p className="text-gray-500">Loading top items...</p>
            ) : topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-left" dir="ltr">{item.name}</span>
                    <span className="text-xs font-bold text-gray-400">{item.sold} sold</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full ${item.color} rounded-full shadow-[0_0_10px_currentColor]`}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!loading && topItems.length === 0 && <p className="text-gray-500">No sales data yet.</p>}
          </div>
        </motion.div>
      </div>

      <DemoSignupModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </motion.div>
  );
}
