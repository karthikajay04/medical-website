import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // States for new doctor form
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocAvailability, setNewDocAvailability] = useState('Mon - Sat');
  const [newDocType, setNewDocType] = useState<'General' | 'Visiting'>('General');
  const [newDocImage, setNewDocImage] = useState('');

  // 1. Fetch real doctor data and bookings from Postgres to calculate tokens
  const fetchDoctorsAndBookings = async () => {
    try {
      const [doctorsList, bookingsList] = await Promise.all([
        api.get<any[]>('/doctors'),
        api.get<any[]>('/bookings')
      ]);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const merged = doctorsList.map(doc => {
        const todayDocBookings = bookingsList.filter(
          b => b.doctorId === doc.id && b.date === todayStr && b.status !== 'Cancelled'
        );
        return {
          ...doc,
          totalTokens: todayDocBookings.length
        };
      });

      setDoctors(merged);
    } catch (err) {
      console.error('Failed to retrieve doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsAndBookings();
  }, []);

  // 2. Advance Doctor Queue
  const handleAdvanceQueue = async (doctorId: string) => {
    try {
      const response = await api.post<any>(`/queue/next/${doctorId}`, {});
      alert(`Queue advanced! Doctor is now serving Token #${response.doctor.currentToken}`);
      fetchDoctorsAndBookings();
    } catch (error: any) {
      alert(error.message || 'Failed to advance queue.');
    }
  };

  // 3. Toggle Doctor Status
  const handleStatusChange = async (doctorId: string, newStatus: string) => {
    try {
      await api.put<any>(`/queue/status/${doctorId}`, { status: newStatus });
      fetchDoctorsAndBookings();
    } catch (error: any) {
      alert(error.message || 'Failed to update status.');
    }
  };

  // 4. Save New Doctor to Postgres
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocSpecialty) return;
    try {
      const payload: any = {
        name: newDocName,
        specialty: newDocSpecialty,
        availability: newDocAvailability,
        type: newDocType,
      };
      if (newDocImage) {
        payload.image = newDocImage;
      }
      
      await api.post('/doctors', payload);
      alert('Specialist profile created successfully!');
      
      // Reset states
      setShowAddModal(false);
      setNewDocName('');
      setNewDocSpecialty('');
      setNewDocAvailability('Mon - Sat');
      setNewDocType('General');
      setNewDocImage('');
      
      fetchDoctorsAndBookings();
    } catch (error: any) {
      alert(error.message || 'Failed to create doctor.');
    }
  };

  // Filter based on search query
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors & Live Queue Controls</h1>
          <p className="text-gray-500 mt-1 font-inter">Manage doctor profiles and advance patient token queues in real-time.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, specialty..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#6F6F6F] font-inter bg-white border border-gray-100 rounded-2xl">
          Retrieving clinic personnel profiles...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-2">
              {/* Doctor Details Segment */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{doctor.name}</h3>
                    <p className="text-sm font-semibold text-[#C8A96B] mt-0.5">{doctor.specialty}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">{doctor.availability}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Bookings Today</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{doctor.totalTokens}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Current Serving</p>
                    <p className="text-xl font-bold text-[#C8A96B] mt-0.5">
                      {doctor.status === 'Serving' && doctor.currentToken > 0 ? `#${doctor.currentToken}` : '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Administrative Queue Controller Panel */}
              <div className="p-6 bg-black/[0.02] border-t md:border-t-0 md:border-l border-gray-100 w-full md:w-64 flex flex-col justify-between gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Live Status</label>
                  <select 
                    value={doctor.status}
                    onChange={(e) => handleStatusChange(doctor.id, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
                  >
                    <option value="Serving">🟢 Serving Patients</option>
                    <option value="On Break">🟡 On Break</option>
                    <option value="Coming Soon">🔵 Coming Soon</option>
                    <option value="Inactive">⚫ Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => handleAdvanceQueue(doctor.id)}
                    disabled={doctor.status !== 'Serving' || doctor.currentToken >= doctor.totalTokens}
                    className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Next Patient (Advance)
                  </button>
                  {doctor.currentToken >= doctor.totalTokens && doctor.totalTokens > 0 && (
                    <p className="text-[10px] text-green-600 font-medium text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Queue fully completed!
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* simulated Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleAddDoctor}>
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Add New Doctor</h2>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full transition-all">
                  <XCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3 text-yellow-800 text-xs font-inter leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                  This adds a specialist card directly inside your PostgreSQL database.
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-inter">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs font-inter" 
                      placeholder="Dr. Christopher Vance" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-inter">Specialization</label>
                    <input 
                      type="text" 
                      required
                      value={newDocSpecialty}
                      onChange={(e) => setNewDocSpecialty(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs font-inter" 
                      placeholder="e.g. Pediatrics" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-inter">Availability Schedule</label>
                      <input 
                        type="text" 
                        value={newDocAvailability}
                        onChange={(e) => setNewDocAvailability(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs font-inter" 
                        placeholder="e.g. Mon - Sat" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-inter">Type</label>
                      <select 
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs font-inter cursor-pointer"
                      >
                        <option value="General">General Care</option>
                        <option value="Visiting">Visiting Consultant</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-inter">Profile Image URL (Optional)</label>
                    <input 
                      type="url" 
                      value={newDocImage}
                      onChange={(e) => setNewDocImage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs font-inter" 
                      placeholder="https://images.unsplash.com/... (optional)" 
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-xs font-inter"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 text-xs font-inter"
                  >
                    Save Doctor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
