import React from 'react';
import { useApp } from '../store/AppContext';
import { Users, Plus, Search, Edit, Trash2, Check, Briefcase, MapPin } from 'lucide-react';
import Avatar from '../components/Avatar';
import { NAKSHATRAS } from '../porutham';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Primary, Surface, Success, Warning, Danger, Gender, Static, Composites } from '../theme';

const DirectoryPage = () => {
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

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${Composites.pageHeader}`}>
        <div>
          <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Matrimonial Database Directory</h2>
          <p className={`text-xs ${Surface.text[500]} mt-1`}>Manage, filter, add, edit, or delete male and female client particulars.</p>
        </div>
        <Button onClick={handleOpenAddForm}>
          <Plus className="h-4 w-4" />
          <span>Add New Candidate</span>
        </Button>
      </div>

      <div className={Composites.filterBar}>
        
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${Surface.text[400]} pointer-events-none`} />
          <Input
            placeholder="Search by name, education, city, or profession..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`${Surface[50]} pl-10 rounded-xl h-10`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="space-y-1">
            <label className={Composites.filterLabel}>Gender</label>
            <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val as any)}>
              <SelectTrigger size="sm" className={Surface[50]}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className={Composites.filterLabel}>Community</label>
            <Select value={communityFilter} onValueChange={(val) => val !== null && setCommunityFilter(val)}>
              <SelectTrigger size="sm" className={Surface[50]}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Communities</SelectItem>
                {uniqueCommunities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className={Composites.filterLabel}>Location</label>
            <Select value={locationFilter} onValueChange={(val) => val !== null && setLocationFilter(val)}>
              <SelectTrigger size="sm" className={Surface[50]}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {uniqueLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className={Composites.filterLabel}>Star (Nakshatra)</label>
            <Select value={starFilter} onValueChange={(val) => val !== null && setStarFilter(val)}>
              <SelectTrigger size="sm" className={Surface[50]}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stars</SelectItem>
                {uniqueStars.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1">
            <label className={Composites.filterLabel}>Chevvai Dosham</label>
            <Select value={chevvaiFilter} onValueChange={(val) => val !== null && setChevvaiFilter(val)}>
              <SelectTrigger size="sm" className={Surface[50]}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Yes">Dosham Present</SelectItem>
                <SelectItem value="No">No Dosham</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProfiles.length === 0 ? (
          <div className={`col-span-full ${Static.white} border ${Surface.border[200]} p-12 rounded-2xl text-center space-y-3`}>
            <p className={`text-sm font-semibold ${Surface.text[400]}`}>No profile matches found with the active filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setGenderFilter('All');
                setCommunityFilter('All');
                setLocationFilter('All');
                setStarFilter('All');
                setChevvaiFilter('All');
              }}
              className={`text-xs ${Primary.text[600]} font-bold underline`}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredProfiles.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`rounded-2xl border p-5 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                p.approvedByAdmin 
                  ? `${Success.opacity.bg_50_60} ${Success.border[300]} shadow-sm ${Success.opacity.shadow_100_20}` 
                  : `${Static.white} ${Surface.opacity.bd_200_80}`
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3.5">
                  <Avatar type={p.avatarUrl} className="h-12 w-12" />
                  <div>
                    <h4 className={`font-bold ${Surface.text[900]} ${Primary.hover.text[600]} transition text-sm`}>
                      {p.name}
                    </h4>
                    <p className={`text-[10px] ${Surface.text[400]} mt-0.5`}>{p.registrationId || p.id} • {p.gender} • {p.age} yrs</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.gender === 'Male' ? `${Gender.male[50]} ${Gender.male.text[700]} border ${Gender.male[100]}` : `${Gender.female[50]} ${Gender.female.text[700]} border ${Gender.female[100]}`
                  }`}>
                    {p.gender}
                  </span>
                  {p.confirmedMatchedWith && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${Danger[50]} ${Danger.text[700]} border ${Danger.border[100]} uppercase tracking-wide`}>
                      Married / Paired
                    </span>
                  )}
                </div>
              </div>

              <p className={`text-xs ${Surface.text[500]} leading-relaxed line-clamp-2 italic`}>
                "{p.bio}"
              </p>

              <div className={`grid grid-cols-2 gap-y-2 gap-x-1.5 text-[11px] font-medium border-t border-b ${Surface.border[100]} py-3 ${Surface.text[600]}`}>
                <div className="flex items-center space-x-1.5 min-w-0">
                  <Briefcase className={`h-3.5 w-3.5 ${Surface.text[400]} shrink-0`} />
                  <span className="truncate">{p.jobType}</span>
                </div>
                <div className="flex items-center space-x-1.5 min-w-0">
                  <MapPin className={`h-3.5 w-3.5 ${Surface.text[400]} shrink-0`} />
                  <span className="truncate">{p.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 min-w-0 col-span-2">
                  <span className={`font-semibold ${Surface.text[400]} uppercase tracking-wide text-[9px] mr-1`}>Rasi/Star:</span>
                  <span className={`truncate ${Surface.text[800]}`}>{p.rasi} • {p.nakshatra}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${Primary.text[600]}`}>
                  Rs {p.annualIncomeLakhs} Lakhs / yr
                </span>

                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  {currentUser?.role === 'Admin' ? (
                    <label className={`flex items-center space-x-1.5 cursor-pointer select-none ${Surface[100]} ${Surface.hover.bg[200]} px-2 py-1 rounded-lg transition mr-1.5`} title="Toggle Admin Approval Check">
                      <input
                        type="checkbox"
                        checked={!!p.approvedByAdmin}
                        onChange={(e) => {
                          handleUpdateProfileData(p.id, { approvedByAdmin: e.target.checked });
                          showToast(
                            e.target.checked 
                              ? `Successfully approved candidate: ${p.name}` 
                              : `Revoked approval for: ${p.name}`,
                            'info'
                          );
                        }}
                        className={`h-3.5 w-3.5 rounded ${Success.text[600]} ${Success.focus.ring} ${Surface.border[300]}`}
                      />
                      <span className={`text-[10px] font-extrabold ${Surface.text[700]}`}>Approve</span>
                    </label>
                  ) : (
                    p.approvedByAdmin && (
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold ${Success[100]} ${Success.text[800]} border ${Success.border[200]} mr-1.5`}>
                        <Check className="h-3.5 w-3.5" />
                        <span>Approved</span>
                      </span>
                    )
                  )}

                  <button
                    onClick={(e) => handleOpenEditForm(p, e)}
                    className={`p-1.5 ${Surface.text[400]} ${Primary.hover.text[600]} ${Surface.hover.bg[50]} rounded-lg transition`}
                    title="Edit candidate profile details"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProfile(p.id, e)}
                    className={`p-1.5 ${Surface.text[400]} ${Danger.hover.text[600]} ${Surface.hover.bg[50]} rounded-lg transition`}
                    title="Delete profile from database"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;
