'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, CheckCircle, Clock, Package, ChefHat, AlertCircle } from 'lucide-react';
import Modal from '@/components/Modal';

export default function OperationsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    items: '',
    total: '',
    status: 'Preparing'
  });

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

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const orderToAdd = {
      id: Math.floor(Math.random() * 1000) + 200,
      customer: newOrder.customer,
      items: newOrder.items.split(',').map(i => String(i || '').trim()),
      total: parseFloat(newOrder.total),
      status: newOrder.status,
      time: 'Just now'
    };
    setOrders([orderToAdd, ...orders]);
    setNewOrder({ customer: '', items: '', total: '', status: 'Preparing' });
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kitchen Operations</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time order tracking and management</p>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter orders..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 rounded-2xl group hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl rounded-full" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${statusConfig[order.status]?.bg || 'bg-gray-100'} ${statusConfig[order.status]?.color || 'text-gray-500'}`}>
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{order.customer}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Clock size={12} />
                        <span>{order.time}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span>#{order.id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 relative z-10 min-h-[48px]">
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(order.items) ? order.items : order.items.split(',')).map((item, idx) => (
                      <span key={idx} className="text-sm px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5 relative z-10">
                  <span className="font-bold text-gray-900 dark:text-white text-xl">
                    ${order.total?.toFixed(2)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 rounded-lg transition-colors"
                      title="Mark Delivered"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="Cancel Order"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Status Strip */}
                <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${statusConfig[order.status]?.bg.replace('/10', '') || 'bg-gray-400'}`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <form onSubmit={handleAddOrder} className="flex flex-col gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Customer Name</label>
              <input
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={newOrder.customer}
                onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Items (comma separated)</label>
              <textarea
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
                rows="3"
                placeholder="e.g. Burger, Fries, Coke"
                value={newOrder.items}
                onChange={e => setNewOrder({ ...newOrder, items: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Total Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  onKeyDown={(e) => e.key === '-' && e.preventDefault()}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={newOrder.total}
                  onChange={e => setNewOrder({ ...newOrder, total: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Initial Status</label>
                <select
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
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

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">Create Order</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
