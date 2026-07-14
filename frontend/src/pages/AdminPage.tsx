import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Primary, Surface, Composites, Static } from '../theme';
import { CommunityInfo } from '../types';
import { CustomNakshatra } from '../api/nakshatra_api';
import { PoruthamConfig } from '../api/porutham_api';
import { JobCategory } from '../api/job_category_api';

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps { title: string; initialValue: string; onSave: (v: string) => void; onClose: () => void; }
function EditModal({ title, initialValue, onSave, onClose }: EditModalProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`${Static.white} rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm ${Surface.text[900]}`}>{title}</h3>
          <button onClick={onClose} className={`${Surface.text[400]} hover:${Surface.text[700]}`}><X className="h-4 w-4" /></button>
        </div>
        <input autoFocus value={value} onChange={e => setValue(e.target.value)}
          className={`w-full text-xs px-3 py-2 rounded-lg border ${Surface.opacity.bd_200_60} ${Surface[50]} ${Surface.text[800]} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          placeholder="Enter name…" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className={`text-xs px-4 py-1.5 rounded-lg border ${Surface.opacity.bd_200_60} ${Surface.text[600]} hover:bg-gray-50 transition`}>Cancel</button>
          <button onClick={() => { if (value.trim()) onSave(value.trim()); }} className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg ${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} font-bold transition`}>
            <Check className="h-3.5 w-3.5" />Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
interface DeleteConfirmProps { name: string; onConfirm: () => void; onClose: () => void; }
function DeleteConfirm({ name, onConfirm, onClose }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`${Static.white} rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-red-600">Delete Confirmation</h3>
          <button onClick={onClose} className={`${Surface.text[400]} hover:${Surface.text[700]}`}><X className="h-4 w-4" /></button>
        </div>
        <p className={`text-xs ${Surface.text[600]}`}>Are you sure you want to delete <span className="font-bold text-red-500">"{name}"</span>? This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className={`text-xs px-4 py-1.5 rounded-lg border ${Surface.opacity.bd_200_60} ${Surface.text[600]} hover:bg-gray-50 transition`}>Cancel</button>
          <button onClick={onConfirm} className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition">
            <Trash2 className="h-3.5 w-3.5" />Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Category Modal ───────────────────────────────────────────────────────
function AddJobCategoryModal({ onClose }: { onClose: () => void }) {
  const { newJobCategoryName, setNewJobCategoryName, handleCreateJobCategory } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`${Static.white} rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm ${Surface.text[900]}`}>Add Job Category</h3>
          <button onClick={onClose} className={`${Surface.text[400]} hover:${Surface.text[700]}`}><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleCreateJobCategory} className="space-y-4">
          <input
            autoFocus
            required
            value={newJobCategoryName}
            onChange={e => setNewJobCategoryName(e.target.value)}
            className={`w-full text-xs px-3 py-2 rounded-lg border ${Surface.opacity.bd_200_60} ${Surface[50]} ${Surface.text[800]} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g. Healthcare / Nursing"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className={`text-xs px-4 py-1.5 rounded-lg border ${Surface.opacity.bd_200_60} ${Surface.text[600]} hover:bg-gray-50 transition`}>Cancel</button>
            <button type="submit" className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg ${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} font-bold transition`}>
              <Plus className="h-3.5 w-3.5" />Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} title={active ? 'Disable' : 'Enable'} className="transition">
      {active ? <ToggleRight className="h-5 w-5 text-indigo-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
    </button>
  );
}
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className={`border-b ${Surface.border[100]} bg-gray-50`}>
        {cols.map(c => <th key={c} className={`text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider ${Surface.text[500]}`}>{c}</th>)}
      </tr>
    </thead>
  );
}

type SubTab = 'communities' | 'nakshatras' | 'poruthams' | 'jobcategories';

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminPage: React.FC = () => {
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
    <tr key={comm.id} className={`border-b ${Surface.border[100]} last:border-0 hover:bg-gray-50 transition`}>
      <td className={`px-4 py-3 text-xs font-semibold ${Surface.text[800]}`}>{comm.name}</td>
      <td className="px-4 py-3"><StatusBadge active={comm.isActive !== false} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Toggle active={comm.isActive !== false} onToggle={() => handleUpdateCommunity(comm.id, { isActive: !(comm.isActive !== false) })} />
          <button onClick={() => setEditTarget({ id: comm.id, name: comm.name, type: 'community' })} className={`${Surface.text[500]} hover:text-indigo-600 transition`}><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => setDeleteTarget({ id: comm.id, name: comm.name, type: 'community' })} className={`${Surface.text[500]} hover:text-red-500 transition`}><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </td>
    </tr>
  );

  const nakshatraRow = (star: CustomNakshatra) => (
    <tr key={star.id} className={`border-b ${Surface.border[100]} last:border-0 hover:bg-gray-50 transition`}>
      <td className={`px-4 py-3 text-xs font-semibold ${Surface.text[800]}`}>{star.name}</td>
      <td className="px-4 py-3"><StatusBadge active={star.isActive !== false} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Toggle active={star.isActive !== false} onToggle={() => handleUpdateNakshatra(star.id, { isActive: !(star.isActive !== false) })} />
          <button onClick={() => setEditTarget({ id: star.id, name: star.name, type: 'nakshatra' })} className={`${Surface.text[500]} hover:text-indigo-600 transition`}><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => setDeleteTarget({ id: star.id, name: star.name, type: 'nakshatra' })} className={`${Surface.text[500]} hover:text-red-500 transition`}><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </td>
    </tr>
  );

  const jobCategoryRow = (cat: JobCategory) => (
    <tr key={cat.id} className={`border-b ${Surface.border[100]} last:border-0 hover:bg-gray-50 transition`}>
      <td className={`px-4 py-3 text-xs font-semibold ${Surface.text[800]}`}>{cat.name}</td>
      <td className="px-4 py-3"><StatusBadge active={cat.isActive} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Toggle active={cat.isActive} onToggle={() => handleUpdateJobCategory(cat.id, { isActive: !cat.isActive })} />
          <button onClick={() => setEditTarget({ id: cat.id, name: cat.name, type: 'jobcategory' })} className={`${Surface.text[500]} hover:text-indigo-600 transition`}><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name, type: 'jobcategory' })} className={`${Surface.text[500]} hover:text-red-500 transition`}><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </td>
    </tr>
  );

  const poruthamRow = (p: PoruthamConfig) => (
    <tr key={p.id} className={`border-b ${Surface.border[100]} last:border-0 hover:bg-gray-50 transition`}>
      <td className={`px-4 py-3 text-[10px] font-bold ${Surface.text[500]} w-8`}>{p.orderIndex}</td>
      <td className="px-4 py-3">
        <p className={`text-xs font-bold ${Surface.text[800]}`}>{p.label}</p>
        <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>{p.description}</p>
      </td>
      <td className="px-4 py-3"><StatusBadge active={p.isEnabled} /></td>
      <td className="px-4 py-3"><Toggle active={p.isEnabled} onToggle={() => handleTogglePorutham(p.id, !p.isEnabled)} /></td>
    </tr>
  );

  const TABS: { key: SubTab; label: string }[] = [
    { key: 'communities', label: 'Communities' },
    { key: 'nakshatras', label: 'Birth Stars (Nakshatra)' },
    { key: 'poruthams', label: 'Porutham Settings' },
    { key: 'jobcategories', label: 'Job Categories' },
  ];

  const cardTitle: Record<SubTab, string> = {
    communities: 'Active Matrimony Franchises',
    nakshatras: 'Custom Birth Stars (Nakshatras)',
    poruthams: 'Porutham Compatibility Checks',
    jobcategories: 'Job Categories',
  };
  const cardSub: Record<SubTab, string> = {
    communities: 'Each community is linked with a regional franchise center.',
    nakshatras: 'Define custom astrological Nakshatras for candidate registration.',
    poruthams: 'Enable or disable individual Porutham checks used in compatibility matching.',
    jobcategories: 'Manage job categories available in candidate registration forms.',
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Modals */}
      {editTarget && <EditModal title={editTarget.type === 'community' ? 'Edit Community Name' : editTarget.type === 'nakshatra' ? 'Edit Birth Star Name' : 'Edit Job Category'} initialValue={editTarget.name} onSave={handleSaveEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleConfirmDelete} onClose={() => setDeleteTarget(null)} />}
      {isNewJobCategoryOpen && <AddJobCategoryModal onClose={() => setIsNewJobCategoryOpen(false)} />}

      {/* Header */}
      <div className={Composites.pageHeader}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Settings Console</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>Configure astrological communities, franchise branches, and candidate configurations.</p>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${Surface.border[100]} overflow-x-auto`}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveSubTab(t.key)}
            className={`py-2.5 px-5 font-bold text-xs border-b-2 whitespace-nowrap transition ${
              activeSubTab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className={`${Static.white} rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm overflow-hidden`}>
        {/* Card header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${Surface.border[100]}`}>
          <div>
            <h3 className={`font-bold text-sm ${Surface.text[900]}`}>{cardTitle[activeSubTab]}</h3>
            <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>{cardSub[activeSubTab]}</p>
          </div>
          {activeSubTab !== 'poruthams' && (
            <button
              onClick={() => {
                if (activeSubTab === 'communities') setIsNewCommunityOpen(true);
                else if (activeSubTab === 'nakshatras') setIsNewNakshatraOpen(true);
                else if (activeSubTab === 'jobcategories') setIsNewJobCategoryOpen(true);
              }}
              className={`flex items-center gap-1.5 ${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} text-[11px] font-bold px-3.5 py-2 rounded-xl transition shadow-sm`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {activeSubTab === 'communities' ? 'Add Community'
                  : activeSubTab === 'nakshatras' ? 'Add Birth Star'
                  : 'Add Job Category'}
              </span>
            </button>
          )}
        </div>

        {/* Communities */}
        {activeSubTab === 'communities' && (
          communities.length === 0
            ? <div className="py-16 text-center"><p className={`text-xs ${Surface.text[500]}`}>No communities yet.</p></div>
            : <div className="overflow-x-auto"><table className="w-full"><TableHead cols={['Community Name', 'Status', 'Actions']} /><tbody>{communities.map(communityRow)}</tbody></table></div>
        )}

        {/* Birth Stars */}
        {activeSubTab === 'nakshatras' && (
          customNakshatras.length === 0
            ? <div className="py-16 text-center"><p className={`text-xs ${Surface.text[500]}`}>No custom Birth Stars yet.</p></div>
            : <div className="overflow-x-auto"><table className="w-full"><TableHead cols={['Birth Star Name', 'Status', 'Actions']} /><tbody>{customNakshatras.map(nakshatraRow)}</tbody></table></div>
        )}

        {/* Poruthams */}
        {activeSubTab === 'poruthams' && (
          poruthams.length === 0
            ? <div className="py-16 text-center"><p className={`text-xs ${Surface.text[500]}`}>Loading…</p></div>
            : <div className="overflow-x-auto"><table className="w-full"><TableHead cols={['#', 'Porutham', 'Status', 'Toggle']} /><tbody>{poruthams.map(poruthamRow)}</tbody></table></div>
        )}

        {/* Job Categories */}
        {activeSubTab === 'jobcategories' && (
          jobCategories.length === 0
            ? <div className="py-16 text-center"><p className={`text-xs ${Surface.text[500]}`}>No job categories yet. Click Add Job Category to start.</p></div>
            : <div className="overflow-x-auto"><table className="w-full"><TableHead cols={['Job Category', 'Status', 'Actions']} /><tbody>{jobCategories.map(jobCategoryRow)}</tbody></table></div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
