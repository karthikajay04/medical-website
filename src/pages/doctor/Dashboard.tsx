import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  Thermometer,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { api } from '@/lib/api';

export default function DoctorDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Vitals inputs
  const [bpInput, setBpInput] = useState('');
  const [tempInput, setTempInput] = useState('');
  const [pulseInput, setPulseInput] = useState('');
  const [spo2Input, setSpo2Input] = useState('');

  // Consultation notes
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  // Prescription medicines
  const [medsList, setMedsList] = useState<any[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('1-0-1');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  const [savingConsult, setSavingConsult] = useState(false);

  const fetchDoctorData = async () => {
    try {
      const response = await api.get<any[]>('/bookings/doctor');
      setBookings(response);
      
      // Keep active selection in sync if it exists
      if (selectedBooking) {
        const fresh = response.find(b => b.id === selectedBooking.id);
        if (fresh) setSelectedBooking(fresh);
      }
    } catch (err) {
      console.error('Failed to fetch doctor bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const selectPatient = (booking: any) => {
    setSelectedBooking(booking);
    
    // Parse vitals if they exist in DB
    const vitalsStr = booking.vitals || '';
    const bpMatch = vitalsStr.match(/BP:\s*([^,]+)/);
    const tempMatch = vitalsStr.match(/Temp:\s*([^,]+)/);
    const pulseMatch = vitalsStr.match(/Pulse:\s*([^,]+)/);
    const spo2Match = vitalsStr.match(/SpO2:\s*([^,]+)/);

    setBpInput(bpMatch ? bpMatch[1] : '');
    setTempInput(tempMatch ? tempMatch[1] : '');
    setPulseInput(pulseMatch ? pulseMatch[1] : '');
    setSpo2Input(spo2Match ? spo2Match[1] : '');

    setDiagnosisInput(booking.diagnosis || '');
    setNotesInput(booking.prescriptionNotes || '');

    // Parse medicines JSON if exists
    try {
      if (booking.prescriptionMeds) {
        setMedsList(JSON.parse(booking.prescriptionMeds));
      } else {
        setMedsList([]);
      }
    } catch (e) {
      setMedsList([]);
    }

    // Reset medicine adding form
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFrequency('1-0-1');
    setNewMedDuration('5 days');
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedsList([...medsList, {
      name: newMedName,
      dosage: newMedDosage || 'As directed',
      frequency: newMedFrequency,
      duration: newMedDuration,
    }]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleDeleteMed = (index: number) => {
    setMedsList(medsList.filter((_, i) => i !== index));
  };

  const saveConsultation = async (status: 'Completed' | 'Pending') => {
    if (!selectedBooking) return;

    setSavingConsult(true);
    try {
      // Package vitals text
      const vitalsParts = [];
      if (bpInput) vitalsParts.push(`BP: ${bpInput}`);
      if (tempInput) vitalsParts.push(`Temp: ${tempInput}`);
      if (pulseInput) vitalsParts.push(`Pulse: ${pulseInput}`);
      if (spo2Input) vitalsParts.push(`SpO2: ${spo2Input}`);
      const vitals = vitalsParts.join(', ');

      const prescriptionMeds = medsList.length > 0 ? JSON.stringify(medsList) : null;

      await api.put(`/bookings/${selectedBooking.id}/prescription`, {
        vitals,
        diagnosis: diagnosisInput || null,
        prescriptionMeds,
        prescriptionNotes: notesInput || null,
        status,
      });

      alert(status === 'Completed' ? 'Prescription completed and synced!' : 'Consultation details saved as draft!');
      await fetchDoctorData();
      
      if (status === 'Completed') {
        setSelectedBooking(null); // Clear active workspace
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update consultation.');
    } finally {
      setSavingConsult(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const activeQueue = todayBookings.filter(b => b.status === 'Pending');
  const completedToday = todayBookings.filter(b => b.status === 'Completed');
  const nextUp = activeQueue.sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Greetings Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-inter">Physician Desk</h1>
          <p className="text-gray-500 mt-1 font-inter text-sm">Review clinical files, update vitals, and write prescriptions in real time.</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Queue Length</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{activeQueue.length} patient(s)</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Consulted Today</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{completedToday.length} completed</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Next Up</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{nextUp ? `Token #${nextUp.tokenNumber}` : 'None'}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Consultation Pace</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">12 min / pat</h3>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Patient Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[75vh]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Patient Active Queue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Click a patient to load their case sheet.</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
            {loading ? (
              <div className="py-20 text-center text-gray-400 text-xs font-medium">Loading clinical roster...</div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-xs italic">No clinic appointments loaded.</div>
            ) : (
              bookings.map((booking) => {
                const isSelected = selectedBooking?.id === booking.id;
                const isToday = booking.date === todayStr;
                return (
                  <button
                    key={booking.id}
                    onClick={() => selectPatient(booking)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50/30 border-emerald-500/30 shadow-sm' 
                        : 'bg-white hover:bg-gray-50/50 border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#C8A96B] bg-[#C8A96B]/5 px-2 py-0.5 rounded-full">Token #{booking.tokenNumber}</span>
                        {!isToday && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Past</span>}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1.5 truncate leading-none">{booking.patientName}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium truncate flex items-center gap-1 font-inter">
                        Ref: {booking.bookingRef} &bull; {booking.patientAge ? `${booking.patientAge} yrs` : 'Age unspecified'}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Sheet Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[75vh] flex flex-col justify-between overflow-hidden">
          {!selectedBooking ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <FolderOpen className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Select a Patient</h3>
              <p className="text-sm text-gray-400 max-w-sm mt-1 leading-relaxed">Choose a patient profile from the queue panel to open their clinical consultation dashboard and case sheet.</p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between">
              {/* Patient File Header */}
              <div className="p-6 border-b border-gray-100 bg-[#0B2C24] text-white flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white bg-[#C8A96B] px-2.5 py-0.5 rounded-full font-inter">Token #{selectedBooking.tokenNumber}</span>
                    <span className="text-xs font-bold tracking-wider text-white/70 font-inter">{selectedBooking.bookingRef}</span>
                  </div>
                  <h2 className="text-2xl font-bold mt-2 font-inter leading-none">{selectedBooking.patientName}</h2>
                  <p className="text-xs text-white/60 mt-1 font-inter font-medium">
                    {selectedBooking.patientAge ? `${selectedBooking.patientAge} years old` : 'Age not provided'} &bull; {selectedBooking.patientPhone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider leading-none">Visiting Reason</p>
                  <p className="text-xs text-[#C8A96B] font-bold mt-1.5 max-w-xs">{selectedBooking.reason || 'General Routine Consultation'}</p>
                  <p className="text-[10px] text-white/40 mt-1">{selectedBooking.estimatedTime} &bull; {selectedBooking.date}</p>
                </div>
              </div>

              {/* Consultation Sheet Fields */}
              <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                
                {/* 1. Patient Vitals Input Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    1. Patient Vitals Telemetry
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" /> BP (mmHg)
                      </label>
                      <input 
                        type="text" 
                        value={bpInput}
                        onChange={(e) => setBpInput(e.target.value)}
                        placeholder="e.g. 120/80"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-inter font-semibold"
                      />
                    </div>

                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-500" /> Temp (°F)
                      </label>
                      <input 
                        type="text" 
                        value={tempInput}
                        onChange={(e) => setTempInput(e.target.value)}
                        placeholder="e.g. 98.6"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-inter font-semibold"
                      />
                    </div>

                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-emerald-500" /> Pulse (bpm)
                      </label>
                      <input 
                        type="text" 
                        value={pulseInput}
                        onChange={(e) => setPulseInput(e.target.value)}
                        placeholder="e.g. 72"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-inter font-semibold"
                      />
                    </div>

                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-500" /> SpO2 (%)
                      </label>
                      <input 
                        type="text" 
                        value={spo2Input}
                        onChange={(e) => setSpo2Input(e.target.value)}
                        placeholder="e.g. 98"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-inter font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Diagnosis and Case Notes */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    2. Diagnosis & Case Sheet Comments
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Symptoms & Main Diagnosis</label>
                      <textarea 
                        rows={3}
                        value={diagnosisInput}
                        onChange={(e) => setDiagnosisInput(e.target.value)}
                        placeholder="Provide details on clinical presentation & diagnosis..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600 font-inter resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Consultation & Dietary Notes</label>
                      <textarea 
                        rows={3}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Diet restrictions, clinical warnings, next follow-up dates..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600 font-inter resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Prescription Medications (Rx) */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#C8A96B]" />
                    3. Prescribed Medications (Rx Formulation)
                  </h3>

                  {/* Add Medication mini-form */}
                  <form onSubmit={handleAddMed} className="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-500">Medication Name / Salt</label>
                        <input 
                          type="text"
                          required
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          placeholder="e.g. Paracetamol 650mg"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-semibold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-500">Dosage</label>
                        <input 
                          type="text"
                          value={newMedDosage}
                          onChange={(e) => setNewMedDosage(e.target.value)}
                          placeholder="e.g. 1 tablet"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-500">Frequency</label>
                        <select 
                          value={newMedFrequency}
                          onChange={(e) => setNewMedFrequency(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium cursor-pointer"
                        >
                          <option value="1-0-1">1-0-1 (Twice daily)</option>
                          <option value="1-1-1">1-1-1 (Thrice daily)</option>
                          <option value="1-0-0">1-0-0 (Morning only)</option>
                          <option value="0-0-1">0-0-1 (Bedtime only)</option>
                          <option value="As needed">PRN (As needed)</option>
                          <option value="Once daily">Once daily</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-500">Duration</label>
                        <input 
                          type="text"
                          value={newMedDuration}
                          onChange={(e) => setNewMedDuration(e.target.value)}
                          placeholder="e.g. 5 days"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <button 
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 flex items-center justify-center shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Medicines List Preview */}
                  <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs font-inter">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          <th className="px-4 py-2 w-10">#</th>
                          <th className="px-4 py-2">Prescription Item</th>
                          <th className="px-4 py-2">Dosage</th>
                          <th className="px-4 py-2">Frequency</th>
                          <th className="px-4 py-2">Duration</th>
                          <th className="px-4 py-2 text-right w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {medsList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-400 italic">No specific medications pre-configured. Use builder form above to add.</td>
                          </tr>
                        ) : (
                          medsList.map((m, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="px-4 py-2 text-gray-400">{idx + 1}</td>
                              <td className="px-4 py-2 font-bold text-gray-800">{m.name}</td>
                              <td className="px-4 py-2 text-gray-600">{m.dosage}</td>
                              <td className="px-4 py-2 text-gray-600">{m.frequency}</td>
                              <td className="px-4 py-2 text-gray-600">{m.duration}</td>
                              <td className="px-4 py-2 text-right">
                                <button 
                                  onClick={() => handleDeleteMed(idx)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Consultation Actions bar */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block leading-tight font-medium">Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getBadgeColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button 
                    disabled={savingConsult}
                    onClick={() => saveConsultation('Pending')}
                    className="px-5 py-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-black rounded-2xl font-bold transition-all text-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Save Draft Case Notes
                  </button>
                  <button 
                    disabled={savingConsult}
                    onClick={() => saveConsultation('Completed')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-emerald-600/10 text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {savingConsult ? 'Syncing...' : 'Complete Consultation & Release'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
