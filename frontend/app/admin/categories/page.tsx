'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Edit2, 
  Loader2, 
  X, 
  FolderOpen, 
  Eye, 
  EyeOff,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Layers,
  Home,
  GripVertical,
  Check,
} from 'lucide-react';
import { getBackendApiUrl, authFetch } from '@/lib/api';

interface CategoryData {
  id: string;
  name: string;
  nameGu: string;
  nameHi: string;
  slug: string;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  isActive: boolean;
  showInHome?: boolean;
  showInHeader?: boolean;
  headerType?: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

  // Form states
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [name, setName] = useState('');
  const [nameGu, setNameGu] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#000000');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showInHome, setShowInHome] = useState(true);
  const [showInHeader, setShowInHeader] = useState(true);
  const [headerType, setHeaderType] = useState('GLOBAL');
  const [formLang, setFormLang] = useState<'en' | 'gu' | 'hi'>('en');

  // Temporary list state for Reorder Modal
  const [orderList, setOrderList] = useState<CategoryData[]>([]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const res = await authFetch(getBackendApiUrl('/api/admin/categories'));
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch categories');
        const sorted = (json.data || []).sort((a: CategoryData, b: CategoryData) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
        setCategories(sorted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Handle Generate Slug automatically
  const generateSlugFromName = (nameVal: string) => {
    return nameVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special chars
      .replace(/[\s_]+/g, '-')  // replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
  };

  // Open modal for Create
  const openCreate = () => {
    setSelectedCategory(null);
    setName('');
    setNameGu('');
    setNameHi('');
    setSlug('');
    setIcon('');
    setColor('#10b981'); // default color emerald
    const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.displayOrder ?? 0)) : 0;
    setDisplayOrder(maxOrder + 1);
    setIsActive(true);
    setShowInHome(true);
    setShowInHeader(true);
    setHeaderType('GLOBAL');
    setFormLang('en');
    setModalOpen(true);
  };

  // Open modal for Edit
  const openEdit = (cat: CategoryData) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setNameGu(cat.nameGu || '');
    setNameHi(cat.nameHi || '');
    setSlug(cat.slug);
    setIcon(cat.icon || '');
    setColor(cat.color || '#10b981');
    setDisplayOrder(cat.displayOrder ?? 0);
    setIsActive(cat.isActive ?? true);
    setShowInHome(cat.showInHome !== undefined ? cat.showInHome : true);
    setShowInHeader(cat.showInHeader !== undefined ? cat.showInHeader : true);
    setHeaderType(cat.headerType || 'GLOBAL');
    setFormLang('en');
    setModalOpen(true);
  };

  // Open Order Manager Modal
  const openOrderManager = () => {
    const sorted = [...categories].sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
    setOrderList(sorted);
    setOrderModalOpen(true);
  };

  // Move item in order manager modal
  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderList.length) return;
    const nextList = [...orderList];
    const temp = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = temp;

    // Recalculate displayOrder indexes descending (highest at top)
    const count = nextList.length;
    const updated = nextList.map((item, idx) => ({ ...item, displayOrder: count - idx }));
    setOrderList(updated);
  };

  // Direct order input change in order manager modal
  const handleOrderInputChange = (id: string, newOrder: number) => {
    const validOrder = Math.max(0, newOrder || 0);
    setOrderList((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, displayOrder: validOrder } : c))
        .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0))
    );
  };

  // Save Batch Order from Modal
  const handleSaveAllOrders = async () => {
    setSavingOrder(true);
    try {
      const itemsPayload = orderList.map((item, idx) => ({
        id: item.id,
        displayOrder: Math.max(0, item.displayOrder ?? (orderList.length - idx)),
      }));

      const res = await authFetch(getBackendApiUrl('/api/admin/categories/reorder'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update section orders');

      const sorted = (json.data || []).sort((a: CategoryData, b: CategoryData) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
      setCategories(sorted);
      setOrderModalOpen(false);
    } catch (err: any) {
      alert('Error saving section orders: ' + err.message);
    } finally {
      setSavingOrder(false);
    }
  };

  // Submit create or edit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return alert('Name and Slug are required');
    if (displayOrder < 0) {
      return alert('Display order must be a non-negative number (0 કે તેથી વધુ ધન સંખ્યા આપો).');
    }
    setSaving(true);

    const payload = {
      name,
      nameGu: nameGu || name,
      nameHi: nameHi || name,
      slug,
      icon,
      color,
      displayOrder: Math.max(0, Number(displayOrder) || 0),
      isActive,
      showInHome,
      showInHeader,
      headerType,
    };

    try {
      const url = selectedCategory ? `/api/admin/categories/${selectedCategory.id}` : '/api/admin/categories';
      const method = selectedCategory ? 'PUT' : 'POST';

      const res = await authFetch(getBackendApiUrl(url), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Failed to save category');

      if (selectedCategory) {
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? json.data : c).sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0)));
      } else {
        setCategories(prev => [...prev, json.data].sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0)));
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (cat: CategoryData) => {
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/categories/${cat.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cat,
          isActive: !cat.isActive
        }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle Show in Home directly
  const handleToggleShowInHome = async (cat: CategoryData) => {
    const nextVal = !(cat.showInHome !== undefined ? cat.showInHome : true);
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/categories/${cat.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cat,
          showInHome: nextVal
        }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, showInHome: nextVal } : c));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle Show in Header directly
  const handleToggleShowInHeader = async (cat: CategoryData) => {
    const nextVal = !(cat.showInHeader !== undefined ? cat.showInHeader : true);
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/categories/${cat.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cat,
          showInHeader: nextVal
        }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, showInHeader: nextVal } : c));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Change Category Order (Move Up / Move Down)
  const handleMoveOrder = async (cat: CategoryData, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === cat.id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const otherCat = categories[targetIndex];
    const newOrderCurrent = otherCat.displayOrder ?? targetIndex;
    const newOrderOther = cat.displayOrder ?? index;

    try {
      await authFetch(getBackendApiUrl(`/api/admin/categories/${cat.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, displayOrder: newOrderCurrent }),
      });
      await authFetch(getBackendApiUrl(`/api/admin/categories/${otherCat.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherCat, displayOrder: newOrderOther }),
      });

      setCategories((prev) => {
        const nextList = [...prev];
        nextList[index] = { ...cat, displayOrder: newOrderCurrent };
        nextList[targetIndex] = { ...otherCat, displayOrder: newOrderOther };
        return nextList.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      });
    } catch (err: any) {
      alert('Failed to reorder categories: ' + err.message);
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All articles in it will become uncategorized.')) return;
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/categories/${id}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter local categories by search query
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.slug.toLowerCase().includes(query.toLowerCase()) ||
    (c.nameGu && c.nameGu.includes(query)) ||
    (c.nameHi && c.nameHi.includes(query))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Categories Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create categories, change position order for Home Page & Header navigation, and manage visibility.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openOrderManager}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-750 transition-all shadow-xs"
            title="Reorder Home Page and Header Sections"
          >
            <ArrowUpDown className="h-4 w-4 text-red-600" />
            <span>Order Home Sections</span>
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white transition-all hover:bg-red-700 shadow-sm"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white"
          />
        </div>
      </div>

      {/* Category List Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
          <span className="mt-2 text-sm">Querying categories...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border rounded-2xl border-dashed bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-400">
          <FolderOpen className="h-12 w-12 text-zinc-300 mb-2" />
          <p className="text-sm font-semibold">No categories found</p>
          <p className="text-xs text-zinc-550">Create a category to begin sorting articles.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-450 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-950/40">
                  <th className="px-5 py-4 text-center">Order Position</th>
                  <th className="px-5 py-4">Category Name</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Translations</th>
                  <th className="px-5 py-4 text-center">Header Nav</th>
                  <th className="px-5 py-4 text-center">Home Page</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                {filteredCategories.map((cat, idx) => {
                  const inHeader = cat.showInHeader !== undefined ? cat.showInHeader : true;
                  const inHome = cat.showInHome !== undefined ? cat.showInHome : true;

                  return (
                    <tr key={cat.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-colors">
                      {/* Order Position & Move Controls */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono font-black text-xs bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900/40">
                            #{cat.displayOrder ?? idx + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleMoveOrder(cat, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move Up in order"
                            >
                              <ArrowUp className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(cat, 'down')}
                              disabled={idx === filteredCategories.length - 1}
                              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move Down in order"
                            >
                              <ArrowDown className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Name & Badge */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span 
                            className="h-3.5 w-3.5 rounded-full ring-2 ring-white shadow-xs shrink-0" 
                            style={{ backgroundColor: cat.color || '#10b981' }}
                          />
                          <span className="font-extrabold text-zinc-900 dark:text-white">{cat.name}</span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500 select-all">
                        {cat.slug}
                      </td>

                      {/* Regional Translations */}
                      <td className="px-5 py-4 text-xs space-y-0.5 text-zinc-550 dark:text-zinc-400 font-semibold">
                        <div>GU: {cat.nameGu || cat.name}</div>
                        <div>HI: {cat.nameHi || cat.name}</div>
                      </td>

                      {/* Header Visibility Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleShowInHeader(cat)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            inHeader 
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-blue-500/20' 
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                          }`}
                          title={inHeader ? 'Visible in Header Nav (Click to hide)' : 'Hidden from Header Nav (Click to show)'}
                        >
                          <Layers className="h-3 w-3" />
                          <span>{inHeader ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Home Visibility Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleShowInHome(cat)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            inHome 
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 ring-1 ring-purple-500/20' 
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                          }`}
                          title={inHome ? 'Visible on Home Page (Click to hide)' : 'Hidden from Home Page (Click to show)'}
                        >
                          <Home className="h-3 w-3" />
                          <span>{inHome ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            cat.isActive 
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300 ring-1 ring-green-500/20' 
                              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                          title={cat.isActive ? 'Active Category' : 'Inactive Category'}
                        >
                          {cat.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(cat)}
                            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Category & Visibility Options"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── DEDICATED REORDER SECTIONS MODAL ─── */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-150 dark:border-zinc-850 shrink-0">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-red-600" />
                  Order Home Page & Header Sections
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Change section positions. Top items appear first on the Home Page and Navigation Bar.
                </p>
              </div>
              <button 
                onClick={() => setOrderModalOpen(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of sections to reorder */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {orderList.map((item, idx) => {
                const inHome = item.showInHome !== undefined ? item.showInHome : true;
                const inHeader = item.showInHeader !== undefined ? item.showInHeader : true;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40 hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GripVertical className="h-4 w-4 text-zinc-400 shrink-0 cursor-grab" />
                      <span className="h-7 w-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        #{idx + 1}
                      </span>
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color || '#10b981' }}
                      />
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                          {item.name} <span className="font-semibold text-zinc-500">({item.nameGu || item.name})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          {inHome && <span className="text-purple-600 dark:text-purple-400 font-bold">• Home Section</span>}
                          {inHeader && <span className="text-blue-600 dark:text-blue-400 font-bold">• Header Nav</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Direct position number input */}
                      <input
                        type="number"
                        value={item.displayOrder ?? idx + 1}
                        onChange={(e) => handleOrderInputChange(item.id, Number(e.target.value))}
                        className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-center text-xs font-mono font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        title="Set exact order position index"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveOrderItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                          title="Move section UP"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveOrderItem(idx, 'down')}
                          disabled={idx === orderList.length - 1}
                          className="p-1.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                          title="Move section DOWN"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-150 dark:border-zinc-850 shrink-0">
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllOrders}
                disabled={savingOrder}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 shadow-sm transition-colors cursor-pointer"
              >
                {savingOrder ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{savingOrder ? 'Saving Positions...' : 'Save Section Positions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT CATEGORY MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-150 dark:border-zinc-850">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-red-600" />
                {selectedCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Language switcher tabs */}
              <div className="flex border-b border-zinc-150 dark:border-zinc-800 mb-2">
                {(['en', 'gu', 'hi'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setFormLang(lang)}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                      formLang === lang 
                        ? 'border-red-600 text-red-600 font-black' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिन्दी'}
                  </button>
                ))}
              </div>

              {formLang === 'en' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Category Name (EN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technology"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!selectedCategory) {
                        setSlug(generateSlugFromName(e.target.value));
                      }
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                    required
                  />
                </div>
              )}

              {formLang === 'gu' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Name (GU)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ટેકનોલોજી"
                    value={nameGu}
                    onChange={(e) => setNameGu(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  />
                </div>
              )}

              {formLang === 'hi' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Name (HI)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. टेक्नोलॉजी"
                    value={nameHi}
                    onChange={(e) => setNameHi(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Slug (URL suffix) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="technology"
                  value={slug}
                  onChange={(e) => setSlug(generateSlugFromName(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white font-mono"
                  required
                />
              </div>

              {/* Display Order */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white font-mono"
                    title="Higher number = visible first, lower number = visible last"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Controls position on Home & Header</p>
                </div>
              </div>

              {/* Visibility and Active Toggles */}
              <div className="space-y-2.5 border-t border-zinc-150 dark:border-zinc-800 pt-3">
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Heading Placement
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="headerType" 
                        value="GLOBAL" 
                        checked={headerType === 'GLOBAL'} 
                        onChange={() => setHeaderType('GLOBAL')} 
                        className="accent-red-600"
                      />
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Global (First Heading)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="headerType" 
                        value="GUJARAT" 
                        checked={headerType === 'GUJARAT'} 
                        onChange={() => setHeaderType('GUJARAT')} 
                        className="accent-red-600"
                      />
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Gujarat (Second Heading)</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Select where this category should appear in the navigation bar.</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showInHeaderCheck"
                    checked={showInHeader}
                    onChange={(e) => setShowInHeader(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="showInHeaderCheck" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Show in Navigation Header
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showInHomeCheck"
                    checked={showInHome}
                    onChange={(e) => setShowInHome(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="showInHomeCheck" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-purple-600" />
                    Show as Section on Home Page
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="isActiveCheck" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-green-600" />
                    Active Category
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-150 dark:border-zinc-850">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 shadow-sm transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


