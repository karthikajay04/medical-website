import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Save, 
  Trash2, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { api } from '@/lib/api';

const Availability = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  
  const [schedule, setSchedule] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // States for custom leave popup modal
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // 1. Fetch doctors listing
  const fetchDoctors = async () => {
    try {
      const response = await api.get<any[]>('/doctors');
      setDoctors(response);
      if (response.length > 0) {
        setSelectedDoctorId(response[0].id);
      }
    } catch (err) {
      console.error('Failed to retrieve doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. Fetch specific doctor's weekly schedules and custom leaves
  const fetchScheduleAndLeaves = async (docId: string) => {
    setLoadingSchedule(true);
    try {
      const res = await api.get<any>(`/doctors/${docId}/schedule`);
      
      // Default template representing 7 calendar days
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mergedSchedule = daysOfWeek.map(day => {
        const found = res.schedules.find((s: any) => s.day === day);
        return {
          day,
          start: found ? found.startTime : '09:00',
          end: found ? found.endTime : '14:00',
          active: found ? found.active : true,
        };
      });

      setSchedule(mergedSchedule);
      setLeaves(res.leaves);
    } catch (err) {
      console.error('Failed to retrieve schedules:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (selectedDoctorId) {
      fetchScheduleAndLeaves(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  // 3. Save weekly schedule changes
  const handleSaveSchedule = async () => {
    if (!selectedDoctorId) return;
    try {
      await api.post(`/doctors/${selectedDoctorId}/schedule`, { schedules: schedule });
      alert("Weekly schedule changes saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to commit weekly hours.");
    }
  };

  // 4. Record new custom leave calendar item
  const handleAddLeave = async () => {
    if (!selectedDoctorId || !leaveDate || !leaveReason) return;
    try {
      await api.post(`/doctors/${selectedDoctorId}/leaves`, {
        dateRange: leaveDate,
        reason: leaveReason
      });
      alert("Custom leave recorded successfully!");
      setShowAddLeave(false);
      setLeaveDate('');
      setLeaveReason('');
      fetchScheduleAndLeaves(selectedDoctorId);
    } catch (err: any) {
      alert(err.message || "Failed to save holiday details.");
    }
  };

  // 5. Remove custom leave record
  const handleDeleteLeave = async (leaveId: string) => {
    if (!selectedDoctorId || !window.confirm("Are you sure you want to delete this leave?")) return;
    try {
      await api.delete(`/doctors/${selectedDoctorId}/leaves/${leaveId}`);
      alert("Leave removed from calendars!");
      fetchScheduleAndLeaves(selectedDoctorId);
    } catch (err: any) {
      alert(err.message || "Failed to delete leave entry.");
    }
  };

  const handleTimeChange = (index: number, key: 'start' | 'end', val: string) => {
    const updated = [...schedule];
    updated[index][key] = val;
    setSchedule(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-gray-500 mt-1">Set specialist weekly hours, calendar shifts, and special leaves.</p>
        </div>
        <button 
          onClick={handleSaveSchedule}
          disabled={!selectedDoctorId || loadingSchedule}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all shadow-lg shadow-black/10"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Weekly Schedule
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#6F6F6F] font-inter bg-white border border-gray-100 rounded-3xl">
          Retrieving medical staff records...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Doctor Selection Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">Select Specialist</h3>
            <div className="space-y-2">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    selectedDoctorId === doctor.id 
                      ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <p className="font-bold text-sm leading-snug">{doctor.name}</p>
                  <p className={`text-xs mt-1 ${selectedDoctorId === doctor.id ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doctor.specialty}
                  </p>
                </button>
              ))}
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-8">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-blue-900 font-inter">Pro Tip</p>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed font-inter">
                    Updates applied to working hours instantly influence the patient-facing booking calendars.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Interface */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-gray-200">
                    <CalendarIcon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">Weekly Working Hours</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle week shifts and change daily time ranges</p>
                  </div>
                </div>
              </div>

              {loadingSchedule ? (
                <div className="py-20 text-center text-xs text-gray-500 italic">
                  Refreshing weekly planner metrics...
                </div>
              ) : (
                <div className="p-6 divide-y divide-gray-100">
                  {schedule.map((item, index) => (
                    <div key={item.day} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-32">
                        <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="font-bold text-gray-900 text-sm">{item.day}</span>
                      </div>

                      <div className="flex-1 flex items-center gap-4">
                        {item.active ? (
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input 
                                type="time" 
                                value={item.start}
                                onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                              />
                            </div>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input 
                                type="time" 
                                value={item.end}
                                onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 py-2 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 font-medium italic text-center">
                            Unavailable / Day Off
                          </div>
                        )}
                      </div>

                      <div className="flex items-center">
                        <button 
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.active ? 'bg-black' : 'bg-gray-200'}`}
                          onClick={() => {
                            const updated = [...schedule];
                            updated[index].active = !updated[index].active;
                            setSchedule(updated);
                          }}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Dates Section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Custom Leaves & Special Dates</h3>
                  <p className="text-xs text-gray-500 mt-1">Add holidays, medical leaves, or specific conference dates</p>
                </div>
                <button 
                  onClick={() => setShowAddLeave(true)}
                  disabled={!selectedDoctorId}
                  className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-200 disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Custom Date
                </button>
              </div>
              
              {loadingSchedule ? (
                <div className="text-center py-6 text-xs text-gray-400 italic">Refreshing leave records...</div>
              ) : leaves.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-6 border border-dashed border-gray-100 rounded-2xl text-center bg-gray-50/50">
                  No active holidays or custom leaves recorded.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{leave.dateRange}</p>
                          <p className="text-xs text-red-600 font-medium">{leave.reason}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteLeave(leave.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Record Leave Popup Modal */}
      {showAddLeave && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddLeave(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Record Special Leave</h2>
              <button onClick={() => setShowAddLeave(false)} className="p-2 hover:bg-white rounded-full transition-all">
                <XCircle className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date Range / Date</label>
                <input 
                  type="text" 
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                  placeholder="e.g. May 25, 2026 or June 10-12" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reason for Absence</label>
                <input 
                  type="text" 
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                  placeholder="e.g. Attending Medical Summit, Public Holiday" 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddLeave(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-xs font-inter"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddLeave}
                  className="flex-1 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-xs font-inter"
                >
                  Record Absence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
