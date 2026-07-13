import React from 'react';
import { useApp } from '../store/AppContext';
import Avatar from '../components/Avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Surface, Static, Composites } from '../theme';

const AttendancePage: React.FC = () => {
  const { employees, attendance, currentUser, employeeSelectedDate, setEmployeeSelectedDate, handleMarkAttendance, handleDeleteAttendance } = useApp();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className={`flex items-center justify-between ${Composites.pageHeader}`}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Attendance Entry</h2>
        <Input
          type="date"
          value={employeeSelectedDate}
          onChange={(e) => setEmployeeSelectedDate(e.target.value)}
          className={`w-auto ${Surface[50]} rounded-xl h-9`}
        />
      </div>
      <div className={`${Static.white} rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.sm} overflow-hidden`}>
        <div className={`grid grid-cols-6 gap-4 p-4 ${Composites.sectionDivider} text-xs font-bold ${Surface.text[500]} uppercase`}>
          <div className="col-span-2">Employee</div>
          <div>Status</div>
          <div className="col-span-2">Remarks</div>
          <div>Action</div>
        </div>
        {employees.map(emp => {
          const dutyRecord = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
          return (
          <div key={emp.id} className={`grid grid-cols-6 gap-4 p-4 ${Composites.sectionDivider} items-center`}>
            <div className="col-span-2 flex items-center space-x-3">
               <Avatar type={emp.avatarUrl || 'male_1'} className="h-10 w-10 rounded-full" />
               <span className="text-xs font-bold">{emp.name}</span>
            </div>
            <div>
              <Select
                value={dutyRecord?.status || 'Present'}
                onValueChange={(val) => handleMarkAttendance(emp.id, val as any, dutyRecord?.notes || '')}
                disabled={!currentUser?.permissions.editAttendance}
              >
                <SelectTrigger size="sm" className="disabled:opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                  <SelectItem value="On Leave">Leave</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Permission">Permission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
               <Input
                disabled={!currentUser?.permissions.editAttendance}
                placeholder="Remarks..."
                value={dutyRecord?.notes || ''}
                onChange={(e) => handleMarkAttendance(emp.id, dutyRecord?.status as any || 'Present', e.target.value)}
                className="disabled:opacity-50 text-xs"
              />
            </div>
            <div>
              {currentUser?.permissions.deleteAttendance && dutyRecord && (
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={() => handleDeleteAttendance(dutyRecord.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default AttendancePage;
