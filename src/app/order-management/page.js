'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, CheckCircle, Clock, Package, ChefHat, AlertCircle, Users, Activity, Heart, ShoppingBag, ClipboardList, MessageCircle, Phone } from 'lucide-react';
import Modal from '@/components/Modal';

function OrderManagementContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    phone: '',
    items: '',
    total: '',
    status: 'Preparing'
  });

  // --- MENU INTEGRATION START ---
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          const allItems = data.data.flatMap(cat => cat.items);
          setMenuItems(allItems);
        }
      } catch (e) { console.error(e); }
    };
    fetchMenu();
  }, []);

  const toggleItemSelection = (menuItem) => {
    const currentItems = newOrder.items ? newOrder.items.split(',').filter(Boolean).map(i => i.trim()) : [];
    const exists = currentItems.includes(menuItem.name);

    let updatedItems;
    let updatedTotal = parseFloat(newOrder.total) || 0;

    if (exists) {
      updatedItems = currentItems.filter(i => i !== menuItem.name);
      updatedTotal -= menuItem.price;
    } else {
      updatedItems = [...currentItems, menuItem.name];
      updatedTotal += menuItem.price;
    }

    setNewOrder({
      ...newOrder,
      items: updatedItems.join(', '),
      total: Math.max(0, updatedTotal)
    });
  };
  // --- MENU INTEGRATION END ---

  useEffect(() => {
    if (searchParams.get('action') === 'new-order') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- CUSTOMER ANALYSIS START ---
  const customerStats = useMemo(() => {
    const stats = {};
    orders.forEach(order => {
      if (!order || !order.customer) return;

      if (!stats[order.customer]) {
        stats[order.customer] = {
          name: order.customer,
          phone: order.phone || '',
          count: 0,
          totalSpent: 0,
          items: [],
          patterns: [],
          lastOrder: order.time || 'Unknown'
        };
      }
      stats[order.customer].count += 1;
      stats[order.customer].totalSpent += (order.total || 0);
      if (order.phone) stats[order.customer].phone = order.phone;

      const orderItemsRaw = order.items || [];
      const orderItems = Array.isArray(orderItemsRaw) ? orderItemsRaw : orderItemsRaw.split(',').map(i => i.trim());
      stats[order.customer].items.push(...orderItems);

      // Pattern Logic
      const orderTime = (order.time || '').toLowerCase();
      if (orderTime.includes('pm') || orderTime.includes('night')) {
        if (!stats[order.customer].patterns.includes('Late Night')) stats[order.customer].patterns.push('Late Night');
      }

      if (orderItems.some(i => (i || '').toLowerCase().includes('deal') || (i || '').toLowerCase().includes('offer'))) {
        if (!stats[order.customer].patterns.includes('Deal Seeker')) stats[order.customer].patterns.push('Deal Seeker');
      }
    });

    return Object.values(stats)
      .filter(c => c.count > 1) // Only show repeat customers
      .map(c => {
        // Find favorite item
        const itemCounts = {};
        c.items.forEach(i => itemCounts[i] = (itemCounts[i] || 0) + 1);
        const favorite = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        const patterns = [...c.patterns];
        if (c.count >= 3) patterns.push('Frequent Flyer');
        if (c.totalSpent > 2000) patterns.push('High Roller');

        return { ...c, favorite, patterns };
      })
      .sort((a, b) => b.count - a.count);
  }, [orders]);
  // --- CUSTOMER ANALYSIS END ---

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const orderToAdd = {
      id: Math.floor(Math.random() * 1000) + 200,
      customer: newOrder.customer,
      phone: newOrder.phone,
      items: newOrder.items.split(',').map(i => i.trim()),
      total: parseFloat(newOrder.total),
      status: newOrder.status,
      time: 'Just now'
    };
    setOrders([orderToAdd, ...orders]);
    setNewOrder({ customer: '', phone: '', items: '', total: '', status: 'Preparing' });
    setIsModalOpen(false);
    try { await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderToAdd) }); } catch (e) { }
  };

  const handleDeleteOrder = async (id) => {
    setOrders(orders.filter(o => o.id !== id));
    try { await fetch(`/api/orders?id=${id}`, { method: 'DELETE' }); } catch (e) { }
  };

  const handleCompleteOrder = async (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Delivered' } : o));
    try { await fetch(`/api/orders`, { method: 'PUT', body: JSON.stringify({ id, status: 'Delivered' }) }); } catch (e) { }
  };

  const statusConfig = {
    Preparing: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: ChefHat },
    Ready: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle },
    Delivered: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Package },
    Cancelled: { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: AlertCircle },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      {/* Header Section - Floating Glass Theme */}
      <motion.div
        className="relative px-6 py-6 md:px-10 md:py-8 rounded-[40px] bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden flex flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">Order Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            Active tracking and behavior analytics
          </p>
        </div>

        <div className="flex flex-row gap-4 w-auto relative z-10 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:scale-105 active:scale-95 w-auto shrink-0"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Order</span>
          </button>
        </div>
      </motion.div>

      {/* Customer Analysis Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Insights</h2>
          <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-full">Repeat Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {customerStats.map((customer, idx) => (
              <motion.div
                key={customer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-3xl border border-white/60 dark:border-white/5 shadow-lg flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white/10">
                      {customer.name[0]}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-gray-900 dark:text-white">{customer.count}x</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase">Visit Count</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate mb-1">{customer.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Phone size={10} />
                    <span className="font-medium tracking-wide">+{customer.phone || 'N/A'}</span>
                  </div>
                  <p className="text-xs text-indigo-500 font-bold mb-4 flex items-center gap-1">
                    <Heart size={10} fill="currentColor" />
                    Prefers {customer.favorite}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {customer.patterns.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Average LTV</span>
                    <span className="font-bold text-gray-900 dark:text-white">Rs.{(customer.totalSpent / customer.count).toFixed(0)}</span>
                  </div>
                  {customer.phone && (
                    <a
                      href={`https://wa.me/${customer.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 group-hover:scale-110 active:scale-95"
                      title="Message on WhatsApp"
                    >
                      <MessageCircle size={18} fill="currentColor" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Orders List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ClipboardList size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Grid</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="glass-card p-6 rounded-2xl h-48 animate-pulse bg-gray-200/50 dark:bg-white/5" />
              ))
            ) : orders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 rounded-3xl group hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${statusConfig[order.status]?.bg || 'bg-gray-100'} ${statusConfig[order.status]?.color || 'text-gray-500'} shadow-inner`}>
                        <StatusIcon size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{order.customer}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-0.5">
                          <Clock size={12} />
                          <span>{order.time}</span>
                          <span className="opacity-30">•</span>
                          <span>#{order.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 min-h-[50px]">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(order.items) ? order.items : (order.items?.split(',') || [])).map((item, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-5 border-t border-gray-100 dark:border-white/5">
                    <span className="font-black text-gray-900 dark:text-white text-2xl tracking-tighter">
                      <span className="text-xs text-gray-400 mr-1 uppercase">Rs.</span>
                      {order.total?.toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 rounded-xl transition-all shadow-sm"
                        title="Mark Delivered"
                      >
                        <CheckCircle size={22} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-all shadow-sm"
                        title="Cancel Order"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <form onSubmit={handleAddOrder} className="flex flex-col gap-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Customer Name</label>
                <input
                  className="w-full p-4 rounded-3xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={newOrder.customer}
                  onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })}
                  required
                  placeholder="Ahmed Khan"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Contact Number</label>
                <input
                  className="w-full p-4 rounded-3xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={newOrder.phone}
                  onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })}
                  required
                  placeholder="923001234567"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Items</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-xs rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-indigo-500 outline-none w-48 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-gray-100 dark:border-white/10 rounded-3xl bg-white dark:bg-black/10">
                {menuItems
                  .filter(item => item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()))
                  .map(item => {
                    const isSelected = newOrder.items && newOrder.items.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItemSelection(item)}
                        className={`p-4 rounded-full text-left border transition-all flex justify-between items-center ${isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                          : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-indigo-300'
                          }`}
                      >
                        <span className="text-xs font-black truncate max-w-[60%]">{item.name}</span>
                        <span className="text-[10px] font-black opacity-70">Rs.{item.price}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Total Amount</label>
                <input
                  type="number"
                  className="w-full p-4 rounded-3xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={newOrder.total}
                  onChange={e => setNewOrder({ ...newOrder, total: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Initial Status</label>
                <select
                  className="w-full p-4 rounded-3xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold"
                  value={newOrder.status}
                  onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-black transition-colors">Cancel</button>
            <button type="submit" className="px-10 py-3 bg-indigo-600 rounded-full text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">Create Order</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function OrderManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderManagementContent />
    </Suspense>
  );
}