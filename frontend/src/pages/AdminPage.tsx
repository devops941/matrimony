import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Settings, Briefcase, Star, MapPin } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n';
import { CommunityInfo } from '../types';
import { CustomNakshatra } from '../api/nakshatra_api';
import { PoruthamConfig } from '../api/porutham_api';
import { JobCategory } from '../api/job_category_api';
import { motion, AnimatePresence } from 'motion/react';

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps { title: string; initialValue: string; onSave: (v: string) => void; onClose: () => void; }
function EditModal({ title, initialValue, onSave, onClose }: EditModalProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Value</label>
          <input autoFocus value={value} onChange={e => setValue(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-xl h-11 px-4 text-sm font-medium transition-all shadow-sm"
            placeholder="Enter name…" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm px-5 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => { if (value.trim()) onSave(value.trim()); }} className="flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all">
            <Check className="h-4 w-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
interface DeleteConfirmProps { name: string; onConfirm: () => void; onClose: () => void; }
function DeleteConfirm({ name, onConfirm, onClose }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-rose-600 tracking-tight">Confirm Deletion</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
          <p className="text-sm text-rose-800 font-medium leading-relaxed">Are you sure you want to delete <span className="font-extrabold text-rose-900">"{name}"</span>? This cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm px-5 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20 transition-all">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Add Category Modal ───────────────────────────────────────────────────────
function AddJobCategoryModal({ onClose }: { onClose: () => void }) {
  const { newJobCategoryName, setNewJobCategoryName, handleCreateJobCategory } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Add Job Category</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleCreateJobCategory} className="space-y-6">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Category Name</label>
            <input
              autoFocus
              required
              value={newJobCategoryName}
              onChange={e => setNewJobCategoryName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-xl h-11 px-4 text-sm font-medium transition-all shadow-sm"
              placeholder="e.g. Healthcare / Nursing"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm px-5 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} title={active ? 'Disable' : 'Enable'} className="transition hover:scale-105 active:scale-95">
      {active ? <ToggleRight className="h-7 w-7 text-indigo-500 drop-shadow-sm" /> : <ToggleLeft className="h-7 w-7 text-slate-300" />}
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-slate-50 border-b border-slate-200/60">
        {cols.map((c, i) => <th key={i} className={`text-left px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === cols.length - 1 ? 'rounded-tr-2xl' : ''}`}>{c}</th>)}
      </tr>
    </thead>
  );
}

type SubTab = 'communities' | 'nakshatras' | 'poruthams' | 'jobcategories';

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminPage: React.FC = () => {
  const { t } = useI18n();
  const {
    communities, setIsNewCommunityOpen, handleUpdateCommunity, handleDeleteCommunity,
    customNakshatras, setIsNewNakshatraOpen, handleUpdateNakshatra, handleDeleteNakshatra,
    poruthams, handleTogglePorutham,
    jobCategories, setIsNewJobCategoryOpen, isNewJobCategoryOpen,
    handleUpdateJobCategory, handleDeleteJobCategory,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('communities');
  const [editTarget, setEditTarget] = useState<{ id: string; name: string; type: 'community' | 'nakshatra' | 'jobcategory' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'community' | 'nakshatra' | 'jobcategory' } | null>(null);

  const handleSaveEdit = async (newName: string) => {
    if (!editTarget) return;
    if (editTarget.type === 'community') await handleUpdateCommunity(editTarget.id, { name: newName });
    else if (editTarget.type === 'nakshatra') await handleUpdateNakshatra(editTarget.id, { name: newName });
    else await handleUpdateJobCategory(editTarget.id, { name: newName });
    setEditTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'community') await handleDeleteCommunity(deleteTarget.id);
    else if (deleteTarget.type === 'nakshatra') await handleDeleteNakshatra(deleteTarget.id);
    else await handleDeleteJobCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  // ── Table rows ────────────────────────────────────────────────────────────────
  const communityRow = (comm: CommunityInfo) => (
    <tr key={comm.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 text-sm font-bold text-slate-800">{comm.name}</td>
      <td className="px-6 py-4"><StatusBadge active={comm.isActive !== false} /></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Toggle active={comm.isActive !== false} onToggle={() => handleUpdateCommunity(comm.id, { isActive: !(comm.isActive !== false) })} />
          <button onClick={() => setEditTarget({ id: comm.id, name: comm.name, type: 'community' })} className="text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-2 rounded-lg transition-all"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => setDeleteTarget({ id: comm.id, name: comm.name, type: 'community' })} className="text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 p-2 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
        </div>
      </td>
    </tr>
  );

  const nakshatraRow = (star: CustomNakshatra) => (
    <tr key={star.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 text-sm font-bold text-slate-800">{star.name}</td>
      <td className="px-6 py-4"><StatusBadge active={star.isActive !== false} /></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Toggle active={star.isActive !== false} onToggle={() => handleUpdateNakshatra(star.id, { isActive: !(star.isActive !== false) })} />
          <button onClick={() => setEditTarget({ id: star.id, name: star.name, type: 'nakshatra' })} className="text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-2 rounded-lg transition-all"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => setDeleteTarget({ id: star.id, name: star.name, type: 'nakshatra' })} className="text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 p-2 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
        </div>
      </td>
    </tr>
  );

  const jobCategoryRow = (cat: JobCategory) => (
    <tr key={cat.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 text-sm font-bold text-slate-800">{cat.name}</td>
      <td className="px-6 py-4"><StatusBadge active={cat.isActive} /></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Toggle active={cat.isActive} onToggle={() => handleUpdateJobCategory(cat.id, { isActive: !cat.isActive })} />
          <button onClick={() => setEditTarget({ id: cat.id, name: cat.name, type: 'jobcategory' })} className="text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 p-2 rounded-lg transition-all"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name, type: 'jobcategory' })} className="text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 p-2 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
        </div>
      </td>
    </tr>
  );

  const poruthamRow = (p: PoruthamConfig) => (
    <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 text-xs font-extrabold text-slate-400 w-12">{p.orderIndex}</td>
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-800">{p.label}</p>
        <p className="text-xs text-slate-500 font-medium mt-1">{p.description}</p>
      </td>
      <td className="px-6 py-4"><StatusBadge active={p.isEnabled} /></td>
      <td className="px-6 py-4"><Toggle active={p.isEnabled} onToggle={() => handleTogglePorutham(p.id, !p.isEnabled)} /></td>
    </tr>
  );

  const TABS: { key: SubTab; label: string; icon: any }[] = [
    { key: 'communities', label: t('tabCommunities'), icon: MapPin },
    { key: 'nakshatras', label: t('tabBirthStars'), icon: Star },
    { key: 'poruthams', label: t('tabPoruthamSettings'), icon: Settings },
    { key: 'jobcategories', label: t('tabJobCategories'), icon: Briefcase },
  ];

  const cardTitle: Record<SubTab, string> = {
    communities: t('cardTitleCommunities'),
    nakshatras: t('cardTitleNakshatras'),
    poruthams: t('cardTitlePoruthams'),
    jobcategories: t('cardTitleJobCategories'),
  };
  const cardSub: Record<SubTab, string> = {
    communities: t('cardSubCommunities'),
    nakshatras: t('cardSubNakshatras'),
    poruthams: t('cardSubPoruthams'),
    jobcategories: t('cardSubJobCategories'),
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full min-h-screen bg-slate-50/50">
      {/* Modals */}
      <AnimatePresence>
        {editTarget && <EditModal title={editTarget.type === 'community' ? 'Edit Community Name' : editTarget.type === 'nakshatra' ? 'Edit Birth Star Name' : 'Edit Job Category'} initialValue={editTarget.name} onSave={handleSaveEdit} onClose={() => setEditTarget(null)} />}
        {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleConfirmDelete} onClose={() => setDeleteTarget(null)} />}
        {isNewJobCategoryOpen && <AddJobCategoryModal onClose={() => setIsNewJobCategoryOpen(false)} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4`}>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{t('adminTitle')}</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">{t('adminSubtitle')}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveSubTab(t.key)}
              className={`flex items-center gap-2 py-2.5 px-5 font-bold text-sm rounded-xl whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60' 
                  : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'
              }`}>
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
              {t.label}
            </button>
          )
        })}
      </motion.div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 md:px-8 py-6 border-b border-slate-100 gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">{cardTitle[activeSubTab]}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">{cardSub[activeSubTab]}</p>
          </div>
          {activeSubTab !== 'poruthams' && (
            <button
              onClick={() => {
                if (activeSubTab === 'communities') setIsNewCommunityOpen(true);
                else if (activeSubTab === 'nakshatras') setIsNewNakshatraOpen(true);
                else if (activeSubTab === 'jobcategories') setIsNewJobCategoryOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>
                {activeSubTab === 'communities' ? t('addCommunity')
                  : activeSubTab === 'nakshatras' ? t('addBirthStar')
                  : t('addJobCategory')}
              </span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            {activeSubTab === 'communities' && (
              <>
                <TableHead cols={['#', t('colCommunityName'), t('colStatus'), t('colActions')]} />
                <tbody>
                  {communities.length === 0 ? (
                    <tr><td colSpan={3} className="py-16 text-center text-sm font-medium text-slate-500">No communities yet.</td></tr>
                  ) : communities.map(communityRow)}
                </tbody>
              </>
            )}

            {activeSubTab === 'nakshatras' && (
              <>
                <TableHead cols={['#', t('tabBirthStars'), t('colStatus'), t('colActions')]} />
                <tbody>
                  {customNakshatras.length === 0 ? (
                    <tr><td colSpan={3} className="py-16 text-center text-sm font-medium text-slate-500">No custom Birth Stars yet.</td></tr>
                  ) : customNakshatras.map(nakshatraRow)}
                </tbody>
              </>
            )}

            {activeSubTab === 'poruthams' && (
              <>
                <TableHead cols={['#', t('colPorutham'), t('colStatus'), t('colToggle')]} />
                <tbody>
                  {poruthams.length === 0 ? (
                    <tr><td colSpan={4} className="py-16 text-center text-sm font-medium text-slate-500">Loading...</td></tr>
                  ) : poruthams.map(poruthamRow)}
                </tbody>
              </>
            )}

            {activeSubTab === 'jobcategories' && (
              <>
                <TableHead cols={[t('colJobCategory'), t('colStatus'), t('colActions')]} />
                <tbody>
                  {jobCategories.length === 0 ? (
                    <tr><td colSpan={3} className="py-16 text-center text-sm font-medium text-slate-500">No job categories yet. Click Add Job Category to start.</td></tr>
                  ) : jobCategories.map(jobCategoryRow)}
                </tbody>
              </>
            )}
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;
