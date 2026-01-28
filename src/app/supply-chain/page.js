'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, Star, Plus, Trash2, Box, Activity, TrendingUp, AlertCircle, CheckCircle2, ChevronDown, Check, Sparkles, Minus, Edit3 } from 'lucide-react';
import Modal from '@/components/Modal';
import DemoSignupModal from '@/components/DemoSignupModal';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { demoData } from '@/lib/demoData';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.95 }
};

export default function SupplyChainPage() {
  const { t } = useLanguage();
  const { isDemo } = useDemo();
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // Fetched from API

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [modalMode, setModalMode] = useState('item'); // 'item' or 'supplier'
  const [newItem, setNewItem] = useState({ item: '', quantity: '', unit: 'kg', supplier: '', status: 'Good', min_threshold: 15 });
  const [newSupplier, setNewSupplier] = useState({ name: '', type: '', rating: '5.0', status: 'Active' });
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        if (isDemo) {
          setInventory(demoData.inventory);
          setSuppliers(demoData.suppliers);
        } else {
          const [invRes, supRes] = await Promise.all([
            fetch('/api/supply-chain'),
            fetch('/api/suppliers')
          ]);
          const invData = await invRes.json();
          const supData = await supRes.json();

          if (invData.success) setInventory(invData.data);
          if (supData.success) setSuppliers(supData.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isDemo]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const tempId = Date.now();
    const itemToAdd = { ...newItem, quantity: Number(newItem.quantity) };

    // Optimistic update


    setInventory([{ id: tempId, ...itemToAdd }, ...inventory]);
    setIsModalOpen(false);
    setNewItem({ item: '', quantity: '', unit: 'kg', supplier: '', status: 'Good' });

    if (!isDemo) {
      try {
        const res = await fetch('/api/supply-chain', {
          method: 'POST',
          body: JSON.stringify(itemToAdd)
        });
        const data = await res.json();
        if (data.success) {
          // Replace temp item with real one from DB
          setInventory(prev => prev.map(item => item.id === tempId ? data.data : item));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdateQuantity = async (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(0, Number(item.quantity) + delta);

    const threshold = item.min_threshold || 15;

    // Status auto-adjustment based on dynamic threshold
    let newStatus = 'Good';
    if (newQuantity < (threshold * 0.5)) newStatus = 'Critical'; // < 50% of threshold
    else if (newQuantity < threshold) newStatus = 'Low Risk'; // < threshold

    // Optimistic update
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity, status: newStatus } : i));

    if (!isDemo) {
      try {
        await fetch('/api/supply-chain', {
          method: 'PUT',
          body: JSON.stringify({ id, quantity: newQuantity, status: newStatus, min_threshold: threshold })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return console.error('No editing item!');

    const id = editingItem.id;
    const updates = { ...newItem, quantity: Number(newItem.quantity), min_threshold: Number(newItem.min_threshold) };

    // Optimistic update
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    setIsModalOpen(false);
    setEditingItem(null);

    if (!isDemo) {
      try {
        await fetch('/api/supply-chain', {
          method: 'PUT',
          body: JSON.stringify({ id, ...updates })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    if (!isDemo) {
      try {
        await fetch(`/api/supply-chain?id=${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [editingItem, setEditingItem] = useState(null);

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({
      item: item.item,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
      status: item.status,
      min_threshold: item.min_threshold || 15
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!isDemo) {
      try {
        const res = await fetch('/api/suppliers', {
          method: 'POST',
          body: JSON.stringify(newSupplier)
        });
        const data = await res.json();
        if (data.success) {
          setSuppliers([...suppliers, data.data]);
          setIsModalOpen(false);
          setNewSupplier({ name: '', type: '', rating: '5.0', status: 'Active' });
        }
      } catch (e) { console.error(e); }
    } else {
      // Demo Mode
      setSuppliers([...suppliers, { id: Date.now(), ...newSupplier }]);
      setIsModalOpen(false);
      setNewSupplier({ name: '', type: '', rating: '5.0', status: 'Active' });
    }
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const id = editingItem.id;

    // Optimistic
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...newSupplier } : s));
    setIsModalOpen(false);
    setEditingItem(null);

    if (!isDemo) {
      try {
        await fetch('/api/suppliers', {
          method: 'PUT',
          body: JSON.stringify({ id, ...newSupplier })
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteSupplier = async (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    if (!isDemo) {
      try { await fetch(`/api/suppliers?id=${id}`, { method: 'DELETE' }); } catch (error) { console.error(error); }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Good': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, ring: 'ring-emerald-500/30' };
      case 'Critical': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle, ring: 'ring-rose-500/30' };
      case 'Low Risk': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: TrendingUp, ring: 'ring-amber-500/30' };
      default: return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Activity, ring: 'ring-gray-500/30' };
    }
  };

  const openSupplierEditModal = (supplier) => {
    setEditingItem(supplier);
    setNewSupplier({
      name: supplier.name,
      type: supplier.type,
      rating: supplier.rating,
      status: supplier.status
    });
    setModalMode('edit-supplier');
    setIsModalOpen(true);
  };

  const openModal = (mode) => {
    setEditingItem(null);
    setNewItem({ item: '', quantity: '', unit: 'kg', supplier: '', status: 'Good' });
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-10 p-2"
    >
      {/* Page Header */}
      {/* Page Header - Floating Glass Theme */}
      <motion.div
        className="flex flex-row items-center justify-between gap-4 px-6 py-6 md:px-10 md:py-8 rounded-3xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <motion.h1
            className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('supplyChain.title')}
          </motion.h1>
          <motion.p
            className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Package size={18} className="text-indigo-500" />
            {t('supplyChain.subtitle')}
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isDemo) setShowDemoModal(true);
            else openModal('item');
          }}
          className="relative z-10 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">{t('supplyChain.newItem')}</span>
        </motion.button>

        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </motion.div>

      {/* Analytics & Strategic Insights Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Activity size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('supplyChain.strategicInsights')}</h2>
          <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full animate-pulse">{t('supplyChain.procurementAI')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Metrics */}
          <div className="glass-card p-6 rounded-3xl grid grid-cols-2 lg:grid-cols-3 gap-4 border border-white/60 dark:border-white/5">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('supplyChain.inventoryHealth')}</span>
              <div>
                <span className="text-2xl font-black text-emerald-500">82%</span>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[82%]" />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('supplyChain.lowStockItems')}</span>
              <div>
                <span className="text-2xl font-black text-rose-500">
                  {inventory.filter(i => i.status === 'Critical' || i.status === 'Low Risk').length}
                </span>
                <p className="text-[10px] text-gray-500 font-bold mt-1">{t('supplyChain.requiresAttention')}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 flex flex-col justify-between group hidden lg:flex">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('supplyChain.activePartners')}</span>
              <div>
                <span className="text-2xl font-black text-indigo-500">{suppliers.length}</span>
                <p className="text-[10px] text-gray-500 font-bold mt-1">{t('supplyChain.globalNetwork')}</p>
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={48} className="text-indigo-500" />
            </div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" />
              {t('supplyChain.procurementSuggestions')}
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                    <span className="font-bold text-gray-900 dark:text-white">{t('data.suggestions.bulkBuy').split(':')[0]}:</span> {t('data.suggestions.bulkBuy').split(':')[1]}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                    <span className="font-bold text-gray-900 dark:text-white">{t('data.suggestions.vendorTrust').split(':')[0]}:</span> {t('data.suggestions.vendorTrust').split(':')[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
            <Package size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('supplyChain.inventoryGrid')}</h2>
        </div>

        {/* --- NEW GRID CARD LAYOUT --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse" />
              ))
            ) : inventory.map(item => {
              const status = getStatusConfig(item.status);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="glass-card relative p-6 rounded-[32px] flex flex-col justify-between h-[280px] group border border-white/40 dark:border-white/5 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-white/0"
                >
                  {/* Top Row: Icon & Status */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                      <Box size={22} />
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon size={12} />
                      {item.status}
                    </span>
                  </div>

                  {/* Middle: Content */}
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={item.item}>
                      {item.item}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                          {item.quantity}
                        </span>
                        <span className="text-sm font-semibold text-gray-400 uppercase">{item.unit}</span>
                      </div>

                      {/* +/- Adjustment Buttons */}
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDemo) setShowDemoModal(true);
                            else handleUpdateQuantity(item.id, -1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:text-indigo-600 transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDemo) setShowDemoModal(true);
                            else handleUpdateQuantity(item.id, 1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:text-indigo-600 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Supplier & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-auto relative z-10">
                    <div className="flex items-center gap-2 max-w-[60%]">
                      <Truck size={14} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {item.supplier}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDemo) setShowDemoModal(true);
                          else openEditModal(item);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        title={t('supplyChain.editItem')}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDemo) setShowDemoModal(true);
                          else handleDeleteItem(item.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title={t('supplyChain.deleteItem')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Decorative Background Blob */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors z-0 pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Suppliers Section */}
      <div className="space-y-8 pt-10 border-t border-gray-200/50 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Truck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('supplyChain.activePartners')}</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isDemo) setShowDemoModal(true);
              else openModal('supplier');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold shadow-lg shadow-purple-500/20 transition-all text-sm w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>{t('supplyChain.addPartner')}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {suppliers.map((s, idx) => (
              <motion.div
                key={s.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-[32px] flex flex-col justify-between h-[240px] border border-white/40 dark:border-white/5 relative overflow-hidden group bg-gradient-to-br from-white/60 to-white/20 dark:from-white/5 dark:to-white/0"
              >
                {/* Header: Category & Rating */}
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                    {s.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{s.rating}</span>
                  </div>
                </div>

                {/* Body: Avatar & Name */}
                <div className="flex flex-col items-center text-center gap-3 z-10 mt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-4 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                    {s.name[0]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1" title={s.name}>
                    {s.name}
                  </h3>
                </div>

                {/* Footer: Status & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-white/10 z-10 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{s.status}</span>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDemo) setShowDemoModal(true);
                        else openSupplierEditModal(s);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      title={t('supplyChain.editPartner')}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDemo) setShowDemoModal(true);
                        else handleDeleteSupplier(s.id);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title={t('supplyChain.deletePartner')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'supplier' ? t('supplyChain.addPartner') : (modalMode === 'edit-supplier' ? t('supplyChain.editPartner') : (modalMode === 'edit' ? t('supplyChain.editItem') : t('supplyChain.newItem')))}
      >
        <form onSubmit={(modalMode === 'supplier' || modalMode === 'edit-supplier') ? (modalMode === 'edit-supplier' ? handleEditSupplier : handleAddSupplier) : (modalMode === 'edit' ? handleEditItem : handleAddItem)} className="space-y-6">
          {(modalMode !== 'supplier' && modalMode !== 'edit-supplier') ? (
            // ITEM FORM (Add or Edit)
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.itemName')}</label>
                <input
                  value={newItem.item}
                  onChange={e => setNewItem({ ...newItem, item: e.target.value })}
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="e.g. Tomatoes"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.quantity')}</label>
                  <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.minAmount')}</label>
                  <input type="number" value={newItem.min_threshold} onChange={e => setNewItem({ ...newItem, min_threshold: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" placeholder="15" title="Alert when below this amount" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.unit')}</label>
                  <select value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium">
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.supplier')}</label>
                <input value={newItem.supplier} onChange={e => setNewItem({ ...newItem, supplier: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" placeholder="Supplier Name" required />
              </div>
            </div>
          ) : (
            // SUPPLIER FORM
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.partnerName')}</label>
                <input
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="e.g. Ali Brothers"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.category')}</label>
                  <input
                    value={newSupplier.type}
                    onChange={e => setNewSupplier({ ...newSupplier, type: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="e.g. Dairy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('supplyChain.rating')}</label>
                  <input
                    type="number" step="0.1" max="5"
                    value={newSupplier.rating}
                    onChange={e => setNewSupplier({ ...newSupplier, rating: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="5.0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('common.status')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Active', 'Delayed'].map(status => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => setNewSupplier({ ...newSupplier, status })}
                      className={`p-2 rounded-full text-sm font-bold border transition-all ${newSupplier.status === status
                        ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                        : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-bold transition-colors">{t('common.cancel')}</button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-8 py-2 rounded-full text-white font-bold hover:shadow-lg transition-all ${modalMode === 'supplier'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30'
                }`}
            >
              {modalMode === 'supplier' ? t('supplyChain.addPartner') : (modalMode === 'edit-supplier' ? t('supplyChain.editPartner') : (modalMode === 'edit' ? t('supplyChain.editItem') : t('common.save')))}
            </motion.button>
          </div>
        </form>
      </Modal>

      <DemoSignupModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </motion.div>
  );
}