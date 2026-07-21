import React from 'react';
import { useApp } from '../store/AppContext';
import { Users, Plus, Search, Edit, Trash2, Check, Briefcase, MapPin, Star } from 'lucide-react';
import Avatar from '../components/Avatar';
import { NAKSHATRAS } from '../porutham';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Primary, Surface, Success, Warning, Danger, Gender, Static, Composites } from '../theme';
import { useI18n } from '../i18n';
import { motion } from 'motion/react';

const DirectoryPage = () => {
  const { t } = useI18n();
  const {
    profiles,
    handleUpdateProfileData,
    filteredProfiles,
    uniqueCommunities,
    uniqueLocations,
    uniqueStars,
    currentUser,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    communityFilter,
    setCommunityFilter,
    locationFilter,
    setLocationFilter,
    starFilter,
    setStarFilter,
    chevvaiFilter,
    setChevvaiFilter,
    selectedProfileId,
    setSelectedProfileId,
    handleOpenAddForm,
    handleOpenEditForm,
    handleDeleteProfile,
    showToast,
  } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full min-h-screen bg-slate-50/50">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4`}>
        <div>
          <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight`}>{t('directoryTitle')}</h2>
          <p className={`text-sm text-slate-500 mt-1.5 font-medium`}>{t('directorySubtitle')}</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className={`flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>New Profile</span>
        </button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
        
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none`} />
          <Input
            placeholder="Search by name, education, city, or profession..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`bg-slate-50/50 pl-11 rounded-xl h-12 text-sm font-medium border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</label>
            <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val as any)}>
              <SelectTrigger className="bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-400 rounded-lg text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                <SelectItem value="All">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Community</label>
            <Select value={communityFilter} onValueChange={(val) => val !== null && setCommunityFilter(val)}>
              <SelectTrigger className="bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-400 rounded-lg text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg max-h-64">
                <SelectItem value="All">All Communities</SelectItem>
                {uniqueCommunities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
            <Select value={locationFilter} onValueChange={(val) => val !== null && setLocationFilter(val)}>
              <SelectTrigger className="bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-400 rounded-lg text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg max-h-64">
                <SelectItem value="All">All Cities</SelectItem>
                {uniqueLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Star</label>
            <Select value={starFilter} onValueChange={(val) => val !== null && setStarFilter(val)}>
              <SelectTrigger className="bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-400 rounded-lg text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg max-h-64">
                <SelectItem value="All">All Stars</SelectItem>
                {uniqueStars.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chevvai Dosham</label>
            <Select value={chevvaiFilter} onValueChange={(val) => val !== null && setChevvaiFilter(val)}>
              <SelectTrigger className="bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-400 rounded-lg text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg max-h-64">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Yes">Dosham Present</SelectItem>
                <SelectItem value="No">No Dosham</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Profiles Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.length === 0 ? (
          <div className={`col-span-full bg-white border border-slate-200 border-dashed p-16 rounded-3xl text-center space-y-4 shadow-sm`}>
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className={`text-base font-semibold text-slate-600`}>No profiles match your active filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setGenderFilter('All');
                setCommunityFilter('All');
                setLocationFilter('All');
                setStarFilter('All');
                setChevvaiFilter('All');
              }}
              className={`text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors`}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredProfiles.map(p => (
            <motion.div
              variants={itemVariants}
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 group relative overflow-hidden bg-white ${
                p.approvedByAdmin 
                  ? `border-emerald-200/60 shadow-sm` 
                  : `border-slate-200/60`
              }`}
            >
              {p.approvedByAdmin && (
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400 opacity-20"></div>
              )}
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center space-x-4">
                  <Avatar type={p.avatarUrl} className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-slate-100" />
                  <div>
                    <h4 className={`font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-base tracking-tight`}>
                      {p.name}
                    </h4>
                    <p className={`text-xs text-slate-500 mt-1 font-medium`}>{p.registrationId || p.id.substring(0,6)} • {p.age} yrs</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    p.gender === 'Male' ? `bg-blue-50 text-blue-700 border border-blue-200` : `bg-pink-50 text-pink-700 border border-pink-200`
                  }`}>
                    {p.gender}
                  </span>
                  {p.confirmedMatchedWith && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide`}>
                      Paired
                    </span>
                  )}
                </div>
              </div>

              <p className={`text-sm text-slate-500 leading-relaxed line-clamp-2 italic relative z-10`}>
                "{p.bio || "Looking for a suitable match."}"
              </p>

              <div className={`grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-medium border-t border-b border-slate-100 py-4 text-slate-600 relative z-10`}>
                <div className="flex items-center space-x-2 min-w-0">
                  <Briefcase className={`h-4 w-4 text-slate-400 shrink-0`} />
                  <span className="truncate">{p.jobType || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className={`h-4 w-4 text-slate-400 shrink-0`} />
                  <span className="truncate">{p.location || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0 col-span-2">
                  <Star className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className={`truncate text-slate-700`}>{p.rasi || 'Unknown Rasi'} • {p.nakshatra || 'Unknown Star'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <span className={`text-sm font-extrabold text-indigo-600`}>
                  ₹{p.annualIncomeLakhs}L<span className="text-xs font-medium text-slate-400">/yr</span>
                </span>

                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  {currentUser?.role === 'Admin' ? (
                    <label className={`flex items-center space-x-1.5 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition mr-1`} title="Toggle Admin Approval Check">
                      <input
                        type="checkbox"
                        checked={!!p.approvedByAdmin}
                        onChange={(e) => {
                          handleUpdateProfileData(p.id, { approvedByAdmin: e.target.checked });
                          showToast(
                            e.target.checked 
                              ? `Approved: ${p.name}` 
                              : `Revoked: ${p.name}`,
                            'info'
                          );
                        }}
                        className={`h-3.5 w-3.5 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300`}
                      />
                      <span className={`text-[10px] font-bold text-slate-600 uppercase tracking-wider`}>Verify</span>
                    </label>
                  ) : (
                    p.approvedByAdmin && (
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mr-1`}>
                        <Check className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    )
                  )}

                  <button
                    onClick={(e) => handleOpenEditForm(p, e)}
                    className={`p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition`}
                    title="Edit profile"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProfile(p.id, e)}
                    className={`p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition`}
                    title="Delete profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default DirectoryPage;
