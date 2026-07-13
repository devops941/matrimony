import { useApp } from '../store/AppContext';
import { ClipboardList, Users, UserCheck, Calendar, Clock, CheckCircle, Plus, Search, Edit, Trash2, Check } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Primary, Surface, Success, Warning, Danger, Info, Static } from '../theme';

export default function EmployeesPage() {
  const {
    employees, attendance, currentUser, employeeSearch, setEmployeeSearch,
    employeeSelectedDate, setEmployeeSelectedDate, isEmployeeFormOpen, setIsEmployeeFormOpen,
    employeeFormMode, formEmpName, setFormEmpName, formEmpAvatarUrl, setFormEmpAvatarUrl,
    formEmpEmail, setFormEmpEmail, formEmpUsername, setFormEmpUsername, formEmpPassword,
    setFormEmpPassword, formEmpRole, setFormEmpRole, formEmpDesignation, setFormEmpDesignation,
    formEmpPhone, setFormEmpPhone, formEmpPermissions, setFormEmpPermissions,
    handleOpenAddEmployee, handleOpenEditEmployee, handleDeleteEmployee,
    handleMarkAttendance, handleClockInSelf, handleClockOutSelf, handleSaveEmployee
  } = useApp();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${Surface.border[200]} pb-5`}>
        <div>
          <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight flex items-center gap-2`}>
            <ClipboardList className={`h-6 w-6 ${Primary.text[600]}`} />
            <span>Employee & Attendance Desk</span>
          </h2>
          <p className={`text-xs ${Surface.text[500]} mt-1`}>Manage staff credentials, customize operational permissions, track daily log-ins, and update attendance logs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`${Static.white} border ${Surface.border[200]} rounded-xl px-3 py-2 flex items-center space-x-2 text-xs ${Surface.text[700]} shadow-sm`}>
            <Calendar className={`h-4 w-4 ${Primary.text[500]}`} />
            <span className="font-medium">Duty Date:</span>
            <Input
              type="date"
              value={employeeSelectedDate}
              onChange={(e) => setEmployeeSelectedDate(e.target.value)}
              className={`border-none bg-transparent focus:outline-none focus:ring-0 font-semibold ${Surface.text[900]} p-0 h-auto w-auto shadow-none`}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm flex items-center space-x-4`}>
          <div className={`h-10 w-10 rounded-xl ${Primary.opacity.bg_10} flex items-center justify-center ${Primary.text[600]}`}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold ${Surface.text[400]} uppercase tracking-wider`}>Total Franchise Staff</p>
            <p className={`text-xl font-bold ${Surface.text[900]} mt-0.5`}>{employees.length}</p>
          </div>
        </div>

        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm flex items-center space-x-4`}>
          <div className={`h-10 w-10 rounded-xl ${Success.opacity.bg_10} flex items-center justify-center ${Success.text[600]}`}>
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold ${Surface.text[400]} uppercase tracking-wider`}>Present on Duty</p>
            <p className={`text-xl font-bold ${Surface.text[900]} mt-0.5`}>
              {employees.filter(emp => {
                const rec = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                return rec?.status === 'Present' || rec?.status === 'Half Day';
              }).length} Active
            </p>
          </div>
        </div>

        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm flex items-center space-x-4`}>
          <div className={`h-10 w-10 rounded-xl ${Warning.opacity.bg_10} flex items-center justify-center ${Warning.text[600]}`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold ${Surface.text[400]} uppercase tracking-wider`}>On Approved Leave</p>
            <p className={`text-xl font-bold ${Surface.text[900]} mt-0.5`}>
              {employees.filter(emp => {
                const rec = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                return rec?.status === 'On Leave';
              }).length} Staff
            </p>
          </div>
        </div>

        <div className={`${Primary[900]} ${Static.textWhite} p-4 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between`}>
          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-2 opacity-10">
            <Clock className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <p className={`text-[9px] font-bold ${Primary.text[200]} uppercase tracking-widest`}>My Operational Shift</p>
            {(() => {
              const selfRecord = attendance.find(a => a.employeeId === currentUser?.id && a.date === employeeSelectedDate);
              if (selfRecord) {
                return (
                  <div className="mt-1">
                    <p className="text-xs font-semibold">
                      Status: <span className={`${Primary[600]} ${Primary.text[100]} text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase`}>{selfRecord.status}</span>
                    </p>
                    <p className={`text-[10px] ${Primary.text[300]} mt-1`}>
                      In: {selfRecord.clockIn || '--'} | Out: {selfRecord.clockOut || 'Active'}
                    </p>
                  </div>
                );
              } else {
                return (
                  <p className={`text-xs ${Primary.text[200]} mt-1 font-medium`}>Shift not started for today</p>
                );
              }
            })()}
          </div>

          <div className="flex items-center space-x-2 mt-3 relative z-10">
            {(() => {
              const selfRecord = attendance.find(a => a.employeeId === currentUser?.id && a.date === employeeSelectedDate);
              if (!selfRecord || !selfRecord.clockIn) {
                return (
                  <Button variant="outline" size="xs" className={`w-full ${Static.white} ${Primary.text[900]} ${Primary.hover.bg[50]}`} onClick={handleClockInSelf}>
                    Clock In
                  </Button>
                );
              } else if (!selfRecord.clockOut) {
                return (
                  <Button size="xs" className={`w-full ${Primary[500]} ${Primary.hover.bg[400]} border ${Primary.border[400]}`} onClick={handleClockOutSelf}>
                    Clock Out
                  </Button>
                );
              } else {
                return (
                  <span className="text-[10px] font-bold text-emerald-300 italic flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Shift Completed
                  </span>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Attendance Ledger */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm lg:col-span-7 space-y-4`}>
          <div className={`flex items-center justify-between border-b ${Surface.border[100]} pb-3`}>
            <div>
              <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Franchise Attendance Registry</h3>
              <p className={`text-[11px] ${Surface.text[500]}`}>Log-ins and active duty status for {employeeSelectedDate}</p>
            </div>
            <div className={`${Primary[50]} ${Primary.text[700]} text-[10px] font-bold px-2 py-1 rounded-lg`}>
              {currentUser?.role === 'Admin' ? 'Admin Controller Active' : 'Self Service View'}
            </div>
          </div>

          <div className="space-y-3">
            {employees.map((emp) => {
              const dutyRecord = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
              const isSelf = emp.id === currentUser?.id;

              return (
                <div
                  key={emp.id}
                  className={`p-4 rounded-xl border transition-all duration-150 ${
                    isSelf ? `${Primary.opacity.bg_40} ${Primary.border[100]} ring-1 ${Primary.ring[100]}` : `${Surface.opacity.bg_50_50} ${Surface.border[100]} ${Surface.hover.border[200]}`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <Avatar type={emp.avatarUrl || 'male_1'} className="h-10 w-10 rounded-full" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold ${Surface.text[900]}`}>{emp.name}</span>
                          {isSelf && <span className={`${Primary[600]} ${Static.textWhite} text-[8px] font-extrabold uppercase px-1 rounded`}>You</span>}
                          <span className={`text-[9px] ${Surface.opacity.bg_200_60} ${Surface.text[600]} px-1.5 py-0.2 rounded`}>
                            {emp.role}
                          </span>
                        </div>
                        <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>{emp.designation}</p>

                        {dutyRecord && (dutyRecord.status === 'Present' || dutyRecord.status === 'Half Day') && (
                          <p className={`text-[9px] ${Primary.text[600]} font-medium mt-1 flex items-center gap-1`}>
                            <Clock className="h-3 w-3" />
                            <span>Shift log: {dutyRecord.clockIn || '--'} to {dutyRecord.clockOut || 'Active'}</span>
                          </p>
                        )}

                        {dutyRecord?.notes && (
                          <p className={`text-[9px] ${Surface.text[400]} italic mt-0.5`}>"{dutyRecord.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] ${Surface.text[400]} font-bold uppercase`}>Status:</span>
                        {(() => {
                          const stat = dutyRecord?.status;
                          if (stat === 'Present') return <span className={`${Success[100]} ${Success.text[800]} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase`}>Present</span>;
                          if (stat === 'Absent') return <span className={`${Danger[100]} ${Danger.text[800]} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase`}>Absent</span>;
                          if (stat === 'On Leave') return <span className={`${Warning[100]} ${Warning.text[800]} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase`}>On Leave</span>;
                          if (stat === 'Half Day') return <span className={`${Info[100]} ${Info.text[800]} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase`}>Half Day</span>;
                          return <span className={`${Surface[100]} ${Surface.text[400]} text-[9px] px-2 py-0.5 rounded-full font-bold uppercase`}>Not Marked</span>;
                        })()}
                      </div>

                      {currentUser?.role === 'Admin' ? (
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => handleMarkAttendance(emp.id, 'Present', 'Franchise duty marked')} className={`text-[9px] ${Success[50]} ${Success.hover.bg[100]} ${Success.text[700]} font-bold px-1.5 py-1 rounded transition cursor-pointer`} title="Mark Present">Present</button>
                          <button onClick={() => handleMarkAttendance(emp.id, 'Half Day', 'Half-day duty marked')} className={`text-[9px] ${Info[50]} hover:bg-sky-100 ${Info.text[700]} font-bold px-1.5 py-1 rounded transition cursor-pointer`} title="Mark Half Day">Half Day</button>
                          <button onClick={() => handleMarkAttendance(emp.id, 'On Leave', 'Approved Leave')} className={`text-[9px] ${Warning[50]} ${Warning.hover.bg[100]} ${Warning.text[700]} font-bold px-1.5 py-1 rounded transition cursor-pointer`} title="Mark On Leave">Leave</button>
                          <button onClick={() => handleMarkAttendance(emp.id, 'Absent', 'Duty Absent')} className={`text-[9px] ${Danger[50]} ${Danger.hover.bg[100]} ${Danger.text[700]} font-bold px-1.5 py-1 rounded transition cursor-pointer`} title="Mark Absent">Absent</button>
                        </div>
                      ) : (
                        isSelf && !dutyRecord && (
                          <Button size="xs" className="text-[10px]" onClick={handleClockInSelf}>
                            Clock In Now
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Roster */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm lg:col-span-5 space-y-4`}>
          <div className={`flex items-center justify-between border-b ${Surface.border[100]} pb-3`}>
            <div>
              <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Franchise Staff Roster</h3>
              <p className={`text-[11px] ${Surface.text[500]}`}>Employee credentials, security roles & permission lists</p>
            </div>
            {currentUser?.role === 'Admin' && (
              <Button size="xs" onClick={handleOpenAddEmployee}>
                <Plus className="h-3 w-3" />
                <span>Register Staff</span>
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${Surface.text[400]} h-4 w-4 pointer-events-none`} />
            <Input
              placeholder="Search staff by name or designation..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className={`${Surface[50]} pl-10 rounded-xl h-9`}
            />
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {employees
              .filter(emp => emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || emp.designation.toLowerCase().includes(employeeSearch.toLowerCase()) || emp.role.toLowerCase().includes(employeeSearch.toLowerCase()))
              .map((emp) => (
                <div key={emp.id} className={`p-3 ${Surface[50]} border ${Surface.border[100]} rounded-xl space-y-2 ${Surface.hover.border[200]} transition`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <Avatar type={emp.avatarUrl || 'male_1'} className="h-8 w-8 rounded-full" />
                      <div>
                        <p className={`text-xs font-bold ${Surface.text[900]} leading-tight`}>{emp.name}</p>
                        <p className={`text-[10px] ${Primary.text[600]} font-medium`}>{emp.designation}</p>
                      </div>
                    </div>

                    {currentUser?.role === 'Admin' && (
                      <div className="flex items-center space-x-1">
                        <button onClick={() => handleOpenEditEmployee(emp)} className={`p-1 ${Surface.text[400]} ${Primary.hover.text[600]} ${Primary.hover.bg[50]} rounded transition cursor-pointer`} title="Edit employee details">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {emp.id !== currentUser?.id && (
                          <button onClick={() => handleDeleteEmployee(emp.id)} className={`p-1 ${Surface.text[400]} ${Danger.hover.text[600]} ${Danger.hover.bg[50]} rounded transition cursor-pointer`} title="Delete employee profile">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`grid grid-cols-2 gap-1.5 pt-1.5 border-t ${Surface.opacity.bd_200_50} text-[9px] ${Surface.text[500]}`}>
                    <div>
                      <span className={`font-bold ${Surface.text[400]}`}>Username:</span> {emp.username}
                    </div>
                    <div>
                      <span className={`font-bold ${Surface.text[400]}`}>Joined:</span> {emp.joinedDate}
                    </div>
                    <div className="col-span-2">
                      <span className={`font-bold ${Surface.text[400]}`}>Contact:</span> {emp.phone} | {emp.email}
                    </div>
                  </div>

                  <div className={`pt-1.5 border-t ${Surface.opacity.bd_200_50}`}>
                    <p className={`text-[8px] font-bold ${Surface.text[400]} uppercase tracking-wider mb-1`}>Operational Permissions Matrix</p>
                    <div className="flex flex-wrap gap-1">
                      <span className={`${Primary[50]} ${Primary.text[700]} text-[8px] px-1 rounded font-bold flex items-center gap-0.5`}>
                        <Check className="h-2 w-2" /> View Profiles
                      </span>
                      {emp.permissions.create ? (
                        <span className={`${Success[50]} ${Success.text[700]} text-[8px] px-1 rounded font-bold flex items-center gap-0.5`}><Check className="h-2 w-2" /> Add Candidate</span>
                      ) : (
                        <span className={`${Surface[100]} ${Surface.text[400]} text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through`}>Add Candidate</span>
                      )}
                      {emp.permissions.edit ? (
                        <span className={`${Info[50]} ${Info.text[700]} text-[8px] px-1 rounded font-bold flex items-center gap-0.5`}><Check className="h-2 w-2" /> Edit Candidate</span>
                      ) : (
                        <span className={`${Surface[100]} ${Surface.text[400]} text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through`}>Edit Candidate</span>
                      )}
                      {emp.permissions.delete ? (
                        <span className={`${Danger[50]} ${Danger.text[700]} text-[8px] px-1 rounded font-bold flex items-center gap-0.5`}><Check className="h-2 w-2" /> Delete Candidate</span>
                      ) : (
                        <span className={`${Surface[100]} ${Surface.text[400]} text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through`}>Delete Candidate</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Employee Form Dialog */}
      <Dialog open={isEmployeeFormOpen} onOpenChange={setIsEmployeeFormOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {employeeFormMode === 'add' ? 'Register New Staff Member' : 'Update Staff Credentials'}
            </DialogTitle>
            <DialogDescription>
              Configure workspace parameters, roles, and candidate privileges
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEmployee} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Full Name *</Label>
                <Input
                  required
                  value={formEmpName}
                  onChange={(e) => setFormEmpName(e.target.value)}
                  placeholder="John Doe"
                  className={`${Surface[50]} rounded-xl`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Email Address *</Label>
                <Input
                  type="email"
                  required
                  value={formEmpEmail}
                  onChange={(e) => setFormEmpEmail(e.target.value)}
                  placeholder="john@Manappandalmatrimony.com"
                  className={`${Surface[50]} rounded-xl`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Username *</Label>
                <Input
                  required
                  value={formEmpUsername}
                  onChange={(e) => setFormEmpUsername(e.target.value)}
                  placeholder="johndoe"
                  disabled={employeeFormMode === 'edit'}
                  className={`${Surface[50]} rounded-xl disabled:opacity-50`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Password *</Label>
                <Input
                  type="password"
                  required
                  value={formEmpPassword}
                  onChange={(e) => setFormEmpPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${Surface[50]} rounded-xl`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Photograph *</Label>
                <input
                  type="file"
                  accept="image/*"
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-xl px-3 py-2 text-xs ${Surface.text[800]} focus:outline-none ${Primary.focus.border} transition-all`}
                />
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Designation Title</Label>
                <Input
                  value={formEmpDesignation}
                  onChange={(e) => setFormEmpDesignation(e.target.value)}
                  placeholder="Regional Supervisor"
                  className={`${Surface[50]} rounded-xl`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Phone Number</Label>
                <Input
                  value={formEmpPhone}
                  onChange={(e) => setFormEmpPhone(e.target.value)}
                  placeholder="9876543210"
                  className={`${Surface[50]} rounded-xl`}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Security Role</Label>
              <div className={`flex items-center space-x-4 ${Surface[50]} p-2.5 rounded-xl border ${Surface.border[200]}`}>
                <label className={`flex items-center space-x-2 text-xs ${Surface.text[700]} cursor-pointer`}>
                  <input
                    type="radio"
                    name="empRole"
                    value="Employee"
                    checked={formEmpRole === 'Employee'}
                    onChange={() => {
                      setFormEmpRole('Employee');
                      setFormEmpPermissions({
                        view: true, create: true, edit: false, delete: false,
                        viewAttendance: false, editAttendance: false, deleteAttendance: false
                      });
                    }}
                    className={`${Primary.text[600]} ${Primary.focus.ring}`}
                  />
                  <span className="font-semibold">Operations Employee</span>
                </label>
                <label className={`flex items-center space-x-2 text-xs ${Surface.text[700]} cursor-pointer`}>
                  <input
                    type="radio"
                    name="empRole"
                    value="Admin"
                    checked={formEmpRole === 'Admin'}
                    onChange={() => {
                      setFormEmpRole('Admin');
                      setFormEmpPermissions({
                        view: true, create: true, edit: true, delete: true,
                        viewAttendance: true, editAttendance: true, deleteAttendance: true
                      });
                    }}
                    className={`${Primary.text[600]} ${Primary.focus.ring}`}
                  />
                  <span className={`font-semibold ${Primary.text[600]}`}>Franchise Administrator</span>
                </label>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold ${Surface.text[500]} uppercase tracking-wider`}>Candidate Operations Privileges</Label>
              <div className={`${Surface[50]} p-4 rounded-2xl border ${Surface.border[200]} space-y-2.5`}>
                {([
                  { key: 'create' as const, label: 'Candidate Profile Creation', desc: 'Allow staff member to register new matrimonial candidate profiles' },
                  { key: 'edit' as const, label: 'Candidate Profile Updates (Edit)', desc: 'Allow staff member to update horoscope matching details, birth data & family background' },
                  { key: 'delete' as const, label: 'Candidate Profile Permanent Deletion', desc: 'Allow staff member to delete candidate profiles (High Risk)', danger: true },
                ]).map(({ key, label, desc, danger }) => (
                  <label key={key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEmpPermissions[key]}
                      onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, [key]: e.target.checked }))}
                      className={`${Primary.text[600]} rounded ${Primary.focus.ring} mt-0.5`}
                    />
                    <div>
                      <span className={`text-xs font-bold ${Surface.text[900]} block`}>{label}</span>
                      <span className={`text-[10px] ${danger ? `${Danger.text[600]} font-semibold` : `${Surface.text[500]}`}`}>{desc}</span>
                    </div>
                  </label>
                ))}

                <div className={`mt-4 pt-4 border-t ${Surface.border[200]} space-y-2.5`}>
                  {([
                    { key: 'viewAttendance' as const, label: 'Attendance: View', desc: 'Allow staff member to view attendance records' },
                    { key: 'editAttendance' as const, label: 'Attendance: Edit/Mark', desc: 'Allow staff member to mark or edit attendance records' },
                    { key: 'deleteAttendance' as const, label: 'Attendance: Delete', desc: 'Allow staff member to delete attendance records', danger: true },
                  ]).map(({ key, label, desc, danger }) => (
                    <label key={key} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formEmpPermissions[key]}
                        onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, [key]: e.target.checked }))}
                        className={`${Primary.text[600]} rounded ${Primary.focus.ring} mt-0.5`}
                      />
                      <div>
                        <span className={`text-xs font-bold ${Surface.text[900]} block`}>{label}</span>
                        <span className={`text-[10px] ${danger ? `${Danger.text[600]} font-semibold` : `${Surface.text[500]}`}`}>{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEmployeeFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Credentials & Access
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
