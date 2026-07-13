import React from 'react';
import { Plus, FileDown, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Primary, Surface, Composites, Static } from '../theme';

const AdminPage: React.FC = () => {
  const {
    communities,
    profiles,
    isNewCommunityOpen,
    setIsNewCommunityOpen,
    newCommName,
    setNewCommName,
    newCommRegion,
    setNewCommRegion,
    newCommCode,
    setNewCommCode,
    handleCreateCommunity,
    showToast,
  } = useApp();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className={Composites.pageHeader}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Regional Franchise & Community Console</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>Configure community-specific rules, manage franchise branches, and export system reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Franchise Listing & Add button */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm lg:col-span-2 space-y-4`}>
          <div className={`flex items-center justify-between border-b ${Surface.border[100]} pb-3`}>
            <div>
              <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Active Matrimony Franchises</h3>
              <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Each community is linked with a regional franchise center.</p>
            </div>
            
            <button
              onClick={() => setIsNewCommunityOpen(true)}
              className={`flex items-center space-x-1.5 ${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} text-[10px] font-bold px-3 py-1.5 rounded-xl transition`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Community</span>
            </button>
          </div>

          <div className="space-y-3">
            {communities.map(comm => (
              <div key={comm.id} className={`p-3.5 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_60} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs font-bold ${Surface.text[800]}`}>{comm.name} ({comm.code})</p>
                  <p className={`text-[10px] ${Surface.text[500]} mt-1`}>Region: {comm.region}</p>
                </div>

                <div className="text-right">
                  <span className={`inline-block ${Surface[200]} ${Surface.text[700]} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {comm.franchiseCount} branches
                  </span>
                  <p className={`text-[9px] ${Surface.text[400]} mt-1`}>Active database client logs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Reports sidebar */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm space-y-4 flex flex-col justify-between`}>
          <div className="space-y-2">
            <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Operations Reporting Desk</h3>
            <p className={`text-[11px] ${Surface.text[500]} leading-relaxed`}>
              Compile the entire matrimonial database of profiles into printable documents or shareable operational records.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "ID,Name,Gender,Age,Community,Star,Rasi,Location,Education\n"
                  + profiles.map(p => `"${p.id}","${p.name}","${p.gender}",${p.age},"${p.community}","${p.nakshatra}","${p.rasi}","${p.location}","${p.education}"`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "matrimonial_profiles_registry.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Successfully exported candidate database as CSV!', 'success');
              }}
              className={`w-full flex items-center justify-center space-x-2 ${Surface[900]} ${Surface.hover.bg[800]} ${Static.textWhite} font-bold text-xs py-2.5 rounded-xl transition`}
            >
              <FileDown className={`h-4 w-4 ${Primary.text[400]}`} />
              <span>Export Candidate Database (CSV)</span>
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className={`w-full flex items-center justify-center space-x-2 ${Surface[100]} ${Surface.hover.bg[200]} ${Surface.text[800]} font-bold text-xs py-2.5 rounded-xl transition`}
            >
              <FileSpreadsheet className={`h-4 w-4 ${Surface.text[600]}`} />
              <span>Print System Status Report</span>
            </button>
          </div>

          <div className={`p-3 ${Primary[50]} border ${Primary.border[100]} rounded-xl`}>
            <p className={`text-[10px] leading-relaxed ${Primary.text[900]}`}>
              <strong>Note on future integrations:</strong> As the service expands, this operational admin desk will connect directly to AWS RDS PostgreSQL or Azure instances to scale multi-community matchmaking catalogs dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
