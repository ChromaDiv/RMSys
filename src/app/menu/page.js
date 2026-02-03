'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Coffee, UtensilsCrossed, ChevronRight, Pencil, Utensils } from 'lucide-react';
import Modal from '@/components/Modal';
import DemoSignupModal from '@/components/DemoSignupModal';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useDemo } from '@/context/DemoContext';
import { demoData } from '@/lib/demoData';
import LoadingSpinner from '@/components/LoadingSpinner';
import SubscriptionModal from '@/components/SubscriptionModal';

function MenuContent() {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();
  const { isDemo } = useDemo();
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [modalType, setModalType] = useState('item'); // 'category' or 'item'
  const [editingId, setEditingId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // ...



  // Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [oldCategoryName, setOldCategoryName] = useState(''); // Tracking old name for API
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    fetchMenu();
  }, [isDemo]);

  useEffect(() => {
    if (searchParams.get('action') === 'add-item') {
      openModal('item');
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory && menu.length > 0) {
      const updated = menu.find(c => c.id === selectedCategory.id);
      if (updated) setSelectedCategory(updated);
      else if (menu.length > 0) setSelectedCategory(menu[0]);
    }
  }, [menu]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setMenu(demoData.menu || []);
        if (!selectedCategory && demoData.menu?.length > 0) {
          setSelectedCategory(demoData.menu[0]);
        }
      } else {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          setMenu(data.data);
          if (!selectedCategory && data.data.length > 0) {
            setSelectedCategory(data.data[0]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    setActionError(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = {
        type: 'category',
        data: {
          newName: newCategoryName,
          oldName: oldCategoryName,
          id: editingId // This is now the numerical ID from the DB
        }
      };

      const res = await fetch('/api/menu', {
        method,
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        await fetchMenu();
        resetForms();
      } else {
        if (data.error === 'LIMIT_REACHED') {
          setShowSubscriptionModal(true);
        }
        setActionError(data.error || data.message || 'Failed to save category');
      }
    } catch (e) {
      console.error(e);
      setActionError(e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsActionLoading(true);
    setActionError(null);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = {
        type: 'item',
        data: { ...newItem, categoryName: selectedCategory.name, id: editingId }
      };

      const res = await fetch('/api/menu', {
        method,
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        await fetchMenu();
        resetForms();
      } else {
        if (data.error === 'LIMIT_REACHED') {
          setShowSubscriptionModal(true);
        }
        setActionError(data.error || data.message || 'Failed to save item');
      }
    } catch (e) {
      console.error(e);
      setActionError(e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const resetForms = () => {
    setNewCategoryName('');
    setNewItem({ name: '', price: '', description: '' });
    setEditingId(null);
    setIsModalOpen(false);
    setActionError(null);
  };

  const openEditCategory = (e, cat) => {
    e.stopPropagation();
    setNewCategoryName(cat.name);
    setOldCategoryName(cat.name); // Capture original name
    setEditingId(cat.id);
    setModalType('category');
    setIsModalOpen(true);
  };

  const openEditItem = (item) => {
    setNewItem({ name: item.name, price: item.price, description: item.description });
    setEditingId(item.id);
    setModalType('item');
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`/api/menu?type=item&id=${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMenu();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteCategory = async (catId) => {
    // Note: catId is generated ID, but backend expects Name. 
    // We need to find the category object to get the name.
    const cat = menu.find(c => c.id === catId);
    if (!cat) return;

    if (!confirm(`Are you sure you want to delete "${cat.name}" and all its items?`)) return;

    try {
      const res = await fetch(`/api/menu?type=category&categoryName=${encodeURIComponent(cat.name)}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMenu();
      }
    } catch (e) { console.error(e); }
  };

  const openModal = (type) => {
    setModalType(type);
    setEditingId(null);
    setNewCategoryName('');
    setNewItem({ name: '', price: '', description: '' });
    setIsModalOpen(true);
  };

  const getCategoryColor = (index) => {
    const colors = [
      { from: 'from-blue-500/80', to: 'to-cyan-500/80', bg: 'bg-blue-500/5', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-100' },
      { from: 'from-emerald-500/80', to: 'to-teal-500/80', bg: 'bg-emerald-500/5', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100' },
      { from: 'from-rose-500/80', to: 'to-pink-500/80', bg: 'bg-rose-500/5', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-100' },
      { from: 'from-amber-500/80', to: 'to-orange-500/80', bg: 'bg-amber-500/5', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-100' },
      { from: 'from-violet-500/80', to: 'to-purple-500/80', bg: 'bg-violet-500/5', text: 'text-violet-600', light: 'bg-violet-50', border: 'border-violet-100' },
      { from: 'from-indigo-500/80', to: 'to-blue-600/80', bg: 'bg-indigo-500/5', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-100' },
    ];
    return colors[index % colors.length];
  };




  return (
    <div className="max-w-7xl mx-auto min-h-screen md:h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header */}
      <motion.div
        className="glass-panel flex flex-row items-center justify-between gap-4 shrink-0 px-6 py-6 md:px-10 md:py-8 rounded-3xl shadow-xl overflow-hidden relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 w-full">
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x uppercase tracking-wider">
            {t('menu.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium hidden md:flex items-center gap-2">
            <Utensils size={18} className="text-indigo-500" />
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      </motion.div>

      {/* Content Area - Premium Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-visible md:overflow-hidden" dir="ltr">

        {/* Categories Sidebar - Vertical Premium Tabs */}
        <motion.div
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full md:w-72 flex flex-col gap-4 shrink-0 h-[300px] md:h-full overflow-hidden glass-card p-4 rounded-3xl border border-white/60 dark:border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('menu.categories')}</h3>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold">{menu.length}</span>
            </div>
            <button
              onClick={() => {
                if (isDemo) setShowDemoModal(true);
                else openModal('category');
              }}
              className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 rounded-full transition-all"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-4">
            {menu.map((cat, idx) => {
              const color = getCategoryColor(idx);
              const isSelected = selectedCategory?.id === cat.id;
              const displayName = cat.name;

              return (
                <motion.div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-full cursor-pointer flex items-center gap-3 group transition-all relative border overflow-hidden ${isSelected
                    ? 'bg-transparent border-gray-900 dark:border-white text-indigo-900 dark:text-indigo-300 shadow-xl border-2'
                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-900 dark:hover:border-white transition-colors duration-200'
                    }`}
                >
                  {/* Active Indicator Glow */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 rounded-full blur-sm -z-10"
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-300' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                    {cat.name.includes('Coffee') ? <Coffee size={18} /> : <UtensilsCrossed size={18} />}
                  </div>

                  <span className={`font-bold text-base flex-1 transition-colors min-w-0 ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>
                    {displayName}
                  </span>

                  {/* Actions - Right Aligned & Always interactable if hovered */}
                  <div className={`flex gap-1 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <button
                      onClick={(e) => {
                        if (isDemo) {
                          e.stopPropagation();
                          setShowDemoModal(true);
                        } else {
                          openEditCategory(e, cat);
                        }
                      }}
                      className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 highlight-hover"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDemo) setShowDemoModal(true);
                        else handleDeleteCategory(cat.id);
                      }}
                      className="p-1.5 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 highlight-hover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}


          </div>
        </motion.div>

        {/* Items Canvas */}
        <div className="flex-1 glass-card p-8 rounded-[32px] overflow-visible md:overflow-hidden flex flex-col relative border border-white/60 dark:border-white/10 shadow-2xl min-h-[500px]">
          {selectedCategory ? (
            <div className="h-full flex flex-col">
              {/* Canvas Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">{selectedCategory.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {selectedCategory.items.length} {t('menu.items')}
                  </p>
                </div>
                {/* Contextual Action - Add Item Button right here */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isDemo) setShowDemoModal(true);
                    else openModal('item');
                  }}
                  className="p-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              <div
                className="flex-1 md:overflow-y-auto pr-2 no-scrollbar"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
                  <AnimatePresence mode="popLayout">
                    {selectedCategory.items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group relative p-6 pb-24 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full min-h-[240px]"
                      >
                        <div className="mb-4 relative z-0">
                          <h3 className="font-extrabold text-gray-900 dark:text-white text-2xl leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-left min-w-0 pr-12" dir="ltr">
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex-1">
                          {item.description ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
                              {item.description}
                            </p>
                          ) : (
                            <p className="text-gray-400 dark:text-gray-600 text-xs italic">No description provided.</p>
                          )}
                        </div>

                        {/* Price - Bottom Right Pill */}
                        <div className="absolute bottom-6 right-6">
                          <span className="inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-6 py-2.5 rounded-full shadow-sm group-hover:shadow-md transition-all">
                            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                              {formatAmount(item.price)}
                            </span>
                          </span>
                        </div>

                        {/* Action Strip - Top Right */}
                        <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 z-20">
                          <button
                            onClick={() => {
                              if (isDemo) setShowDemoModal(true);
                              else openEditItem(item);
                            }}
                            className="p-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-full hover:text-indigo-600 hover:shadow-lg transition-all border border-gray-100 dark:border-white/10"
                            title={t('common.edit')}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (isDemo) setShowDemoModal(true);
                              else handleDeleteItem(item.id);
                            }}
                            className="p-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-full hover:text-rose-600 hover:shadow-lg transition-all border border-gray-100 dark:border-white/10"
                            title={t('common.delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-32 h-32 bg-indigo-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <UtensilsCrossed size={48} className="text-indigo-300 dark:text-white/20" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('menu.readyToCurate', 'Ready to curate?')}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">{t('menu.selectCategoryDesc', 'Select a category from the left to manage your items, or create a fresh category to get started.')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForms}
        title={modalType === 'category' ? (editingId ? t('common.edit') : t('menu.newCategory')) : (editingId ? t('common.edit') : t('menu.newItem'))}
      >
        <form onSubmit={modalType === 'category' ? handleSaveCategory : handleSaveItem} className="space-y-6">
          {actionError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {actionError}
            </div>
          )}
          {modalType === 'category' ? (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('menu.categoryName', 'Category Name')}</label>
              <input
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="w-full p-4 rounded-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none font-medium"
                placeholder={t('menu.categoryPlaceholder', 'e.g. Desserts')}
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('menu.itemName', 'Item Name')}</label>
                <input
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-4 rounded-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none font-medium"
                  placeholder={t('menu.itemPlaceholder', 'e.g. Chocolate Cake')}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('menu.price', 'Price')} (PKR)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full p-4 rounded-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none font-medium"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('menu.description', 'Description')}</label>
                <textarea
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-4 rounded-3xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-indigo-500 outline-none font-medium resize-none"
                  rows="3"
                  placeholder={t('menu.descriptionPlaceholder', 'Short description...')}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={resetForms}
              disabled={isActionLoading}
              className="px-6 py-2 text-gray-500 hover:text-gray-700 font-bold disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isActionLoading}
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg disabled:opacity-70 flex items-center gap-2 min-w-[100px] justify-center"
            >
              {isActionLoading ? (
                <LoadingSpinner size="small" color="white" text={editingId ? 'Updating...' : 'Adding...'} />
              ) : (
                t('common.save')
              )}
            </button>
          </div>
        </form>
      </Modal>

      <DemoSignupModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}
