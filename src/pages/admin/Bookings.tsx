import { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  User, 
  Hash,
  Printer,
  X,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings loaded from database
  const [settings, setSettings] = useState<any>({
    clinicName: 'Aethera Wellness Center',
    clinicAddress: '124 Skyview Plaza, Medical District, Bangalore',
  });

  // Prescription modal states
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState<any | null>(null);
  const [patientNameInput, setPatientNameInput] = useState('');
  const [patientAgeInput, setPatientAgeInput] = useState('');
  const [medsList, setMedsList] = useState<any[]>([]);

  // Individual medicine form inputs
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('1-0-1');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  const fetchBookingsAndSettings = async () => {
    try {
      const [bookingsResponse, settingsResponse] = await Promise.all([
        api.get<any[]>('/bookings'),
        api.get<any>('/settings').catch(() => null) // Suppress settings error if DB empty
      ]);
      
      setBookings(bookingsResponse);
      if (settingsResponse) {
        setSettings({
          clinicName: settingsResponse.clinicName || 'Aethera Wellness Center',
          clinicAddress: settingsResponse.clinicAddress || '124 Skyview Plaza, Medical District, Bangalore',
        });
      }
    } catch (err) {
      console.error('Failed to retrieve bookings or settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAndSettings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // Status transitions committed directly to Postgres
  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      alert("Appointment status updated successfully!");
      fetchBookingsAndSettings();
    } catch (error: any) {
      alert(error.message || "Failed to update appointment status.");
    }
  };

  const openPrintModal = (booking: any) => {
    setSelectedBookingForPrint(booking);
    setPatientNameInput(booking.patientName);
    setPatientAgeInput(booking.patientAge || '');
    
    // Auto-populate prescription from doctor's consultation
    try {
      if (booking.prescriptionMeds) {
        setMedsList(JSON.parse(booking.prescriptionMeds));
      } else {
        setMedsList([]);
      }
    } catch (e) {
      setMedsList([]);
    }

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
    setNewMedFrequency('1-0-1');
    setNewMedDuration('5 days');
  };

  const handleDeleteMed = (index: number) => {
    setMedsList(medsList.filter((_, i) => i !== index));
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate beautiful Rx document and trigger window print context
  const handlePrint = () => {
    if (!selectedBookingForPrint) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to enable printing.");
      return;
    }

    const medsHtml = medsList.length > 0 
      ? medsList.map((m, index) => `
        <tr class="border-b border-gray-100">
          <td class="py-3 text-sm font-semibold">${index + 1}</td>
          <td class="py-3 text-sm font-bold text-gray-800">${m.name}</td>
          <td class="py-3 text-sm text-gray-600">${m.dosage}</td>
          <td class="py-3 text-sm text-gray-600">${m.frequency}</td>
          <td class="py-3 text-sm text-gray-600">${m.duration}</td>
        </tr>
      `).join('')
      : `
        <tr>
          <td colspan="5" class="py-12 text-center text-gray-400 italic border-b border-gray-100">
            [ No medicines pre-typed. Prescriber will write manually on printed slip ]
          </td>
        </tr>
      `;

    const emptyLinesHtml = medsList.length === 0
      ? `
        <div class="mt-8 space-y-6">
          <div class="border-b border-dashed border-gray-300 pb-1 text-gray-300 select-none">&nbsp;</div>
          <div class="border-b border-dashed border-gray-300 pb-1 text-gray-300 select-none">&nbsp;</div>
          <div class="border-b border-dashed border-gray-300 pb-1 text-gray-300 select-none">&nbsp;</div>
          <div class="border-b border-dashed border-gray-300 pb-1 text-gray-300 select-none">&nbsp;</div>
        </div>
      `
      : '';

    printWindow.document.write(`
      <html>
      <head>
        <title>Prescription - ${selectedBookingForPrint.bookingRef}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
          }
          .font-serif-title {
            font-family: 'Instrument Serif', serif;
          }
        </style>
      </head>
      <body class="bg-white p-12 text-black">
        <div class="max-w-3xl mx-auto border-4 border-gray-100 p-8 rounded-3xl relative">
          <!-- Header -->
          <div class="flex justify-between items-start border-b-2 border-gray-900 pb-6">
            <div>
              <h1 class="text-3xl font-bold font-serif-title tracking-tight text-gray-900">${settings.clinicName}</h1>
              <p class="text-xs text-gray-500 mt-1 font-medium max-w-sm leading-relaxed">${settings.clinicAddress}</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-3 py-1 bg-black text-white rounded-full text-[10px] font-bold tracking-wider uppercase">Rx Slip</span>
              <p class="text-xs text-gray-400 mt-2 font-medium">Ref: ${selectedBookingForPrint.bookingRef}</p>
              <p class="text-xs text-[#C8A96B] font-bold mt-0.5">Token #${selectedBookingForPrint.tokenNumber}</p>
            </div>
          </div>

          <!-- Doctor & Date -->
          <div class="grid grid-cols-2 gap-4 py-6 border-b border-gray-100 text-sm">
            <div>
              <p class="text-[10px] uppercase font-bold tracking-wider text-gray-400">Prescribing Doctor</p>
              <p class="font-bold text-gray-900 mt-0.5">${selectedBookingForPrint.doctor?.name || 'Duty Medical Specialist'}</p>
              <p class="text-xs text-[#C8A96B] font-semibold">${selectedBookingForPrint.doctor?.specialty || 'General Practice'}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] uppercase font-bold tracking-wider text-gray-400">Consultation Date</p>
              <p class="font-bold text-gray-900 mt-0.5">${formatDate(selectedBookingForPrint.date)}</p>
              <p class="text-xs text-gray-500 font-medium">${selectedBookingForPrint.estimatedTime}</p>
            </div>
          </div>

          <!-- Patient Meta -->
          <div class="grid grid-cols-3 gap-4 py-5 bg-gray-50 px-6 rounded-2xl border border-gray-100 my-6 text-xs">
            <div>
              <p class="uppercase font-bold tracking-wider text-gray-400">Patient Name</p>
              <p class="font-bold text-gray-900 mt-1 text-sm">${patientNameInput}</p>
            </div>
            <div>
              <p class="uppercase font-bold tracking-wider text-gray-400">Age</p>
              <p class="font-bold text-gray-900 mt-1 text-sm">${patientAgeInput ? `${patientAgeInput} years` : 'Not specified'}</p>
            </div>
            <div class="text-right">
              <p class="uppercase font-bold tracking-wider text-gray-400">Contact</p>
              <p class="font-bold text-gray-900 mt-1 text-sm">${selectedBookingForPrint.patientPhone}</p>
            </div>
          </div>

          <!-- Patient Vitals & Diagnosis -->
          ${(selectedBookingForPrint.vitals || selectedBookingForPrint.diagnosis) ? `
          <div class="grid grid-cols-2 gap-6 py-4 px-6 bg-[#C8A96B]/5 border border-[#C8A96B]/15 rounded-2xl mb-6 text-xs font-inter leading-relaxed">
            ${selectedBookingForPrint.vitals ? `
            <div>
              <p class="uppercase font-bold tracking-wider text-[#7A612E] text-[10px]">Patient Vitals</p>
              <p class="font-semibold text-gray-800 mt-1">${selectedBookingForPrint.vitals}</p>
            </div>
            ` : ''}
            ${selectedBookingForPrint.diagnosis ? `
            <div>
              <p class="uppercase font-bold tracking-wider text-[#7A612E] text-[10px]">Symptoms & Diagnosis</p>
              <p class="font-semibold text-gray-800 mt-1">${selectedBookingForPrint.diagnosis}</p>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- Rx Prescription Body -->
          <div class="mt-8 min-h-[300px]">
            <div class="flex items-center gap-2 mb-4">
              <span class="font-serif-title text-4xl italic font-bold text-[#C8A96B]">Rx</span>
              <div class="h-0.5 bg-[#C8A96B]/20 flex-1"></div>
            </div>

            <!-- Medicines Table -->
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-gray-200 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  <th class="pb-2 w-10">#</th>
                  <th class="pb-2">Medicine / Salt</th>
                  <th class="pb-2">Dosage</th>
                  <th class="pb-2">Frequency</th>
                  <th class="pb-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                ${medsHtml}
              </tbody>
            </table>

            ${emptyLinesHtml}
          </div>

          <!-- Footer Signature -->
          <div class="mt-16 flex justify-between items-end border-t border-gray-100 pt-8">
            <div>
              <p class="text-[10px] text-gray-400 leading-normal">This prescription is dynamically printed from Aethera clinic database telemetry.</p>
              <p class="text-[10px] text-gray-400 mt-0.5">Please scan or present this at the clinic pharmacy.</p>
            </div>
            <div class="text-center w-48">
              <div class="border-b border-gray-400 pb-1 select-none">&nbsp;</div>
              <p class="text-xs font-bold text-gray-900 mt-2">${selectedBookingForPrint.doctor?.name || 'Medical Officer'}</p>
              <p class="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Authorized Signature</p>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setSelectedBookingForPrint(null);
  };

  const filteredBookings = bookings.filter(b => 
    b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.doctor && b.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings & Appointments</h1>
          <p className="text-gray-500 mt-1 font-inter">Manage and track all patient appointments in the clinic.</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Booking Ref, patient or doctor..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-inter"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#6F6F6F] font-inter">
            Loading clinic appointments...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient & ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Est. Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 italic">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group animate-in fade-in duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                              {booking.patientName} 
                              {booking.patientAge && <span className="text-xs text-gray-400 ml-1.5 font-normal">({booking.patientAge} yrs)</span>}
                            </p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <Hash className="h-3 w-3" /> {booking.bookingRef}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-700">{booking.doctor?.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{booking.doctor?.specialty}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {booking.estimatedTime}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{formatDate(booking.date)}</p>
                          <p className="text-xs text-[#C8A96B] font-bold">Token #{booking.tokenNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600 font-medium max-w-xs block truncate" title={booking.reason}>
                          {booking.reason || 'Routine consultation'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-inter transition-all ${getStatusColor(booking.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => openPrintModal(booking)}
                            className="inline-flex items-center gap-1 bg-black text-white hover:bg-gray-800 rounded-xl px-3 py-1.5 text-xs font-semibold font-inter shadow-sm transition-all duration-200 active:scale-95"
                            title="Generate and Print Prescription"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            Print Rx
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print Prescription Preview Modal */}
      {selectedBookingForPrint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBookingForPrint(null)} />
          
          {/* Modal Box */}
          <div className="relative bg-[#F8F9FA] w-full max-w-6xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row">
            
            {/* Left Column: Interactive Rx Form (1/3 width) */}
            <div className="w-full md:w-5/12 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-8 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Rx Builder Panel</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Customize details before executing print.</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBookingForPrint(null)} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 bg-[#C8A96B]/5 border border-[#C8A96B]/20 rounded-2xl flex gap-3 text-[#7A612E] text-xs font-inter leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-[#C8A96B] shrink-0" />
                  Fill in any missing details like the patient's age and add medication instructions. They will render in real-time in the print preview on the right.
                </div>

                {/* Patient Information Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">1. Patient Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Patient Name</label>
                      <input 
                        type="text" 
                        value={patientNameInput}
                        onChange={(e) => setPatientNameInput(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-xs font-inter font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Patient Age</label>
                      <input 
                        type="text" 
                        value={patientAgeInput}
                        onChange={(e) => setPatientAgeInput(e.target.value)}
                        placeholder="e.g. 28"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-xs font-inter font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Medication Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Prescribe Medications (Rx)</h3>
                  
                  <form onSubmit={handleAddMed} className="space-y-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Medicine Name / Salt</label>
                      <input 
                        type="text"
                        required
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g., Paracetamol 650mg"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-xs font-inter font-medium"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Dosage</label>
                        <input 
                          type="text"
                          value={newMedDosage}
                          onChange={(e) => setNewMedDosage(e.target.value)}
                          placeholder="e.g., 1 tablet"
                          className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-[11px] font-inter font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Frequency</label>
                        <select 
                          value={newMedFrequency}
                          onChange={(e) => setNewMedFrequency(e.target.value)}
                          className="w-full px-2 py-2 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-[11px] font-inter font-medium cursor-pointer"
                        >
                          <option value="1-0-1">1-0-1 (Twice daily)</option>
                          <option value="1-1-1">1-1-1 (Thrice daily)</option>
                          <option value="1-0-0">1-0-0 (Morning only)</option>
                          <option value="0-0-1">0-0-1 (Bedtime only)</option>
                          <option value="As needed">PRN (As needed)</option>
                          <option value="Once daily">Once daily</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Duration</label>
                        <input 
                          type="text"
                          value={newMedDuration}
                          onChange={(e) => setNewMedDuration(e.target.value)}
                          placeholder="e.g., 5 days"
                          className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-black outline-none text-[11px] font-inter font-medium"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Prescription
                    </button>
                  </form>
                </div>
              </div>

              {/* Print Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedBookingForPrint(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold transition-all text-xs font-inter"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-grow-[2] py-3 bg-black text-white hover:bg-gray-800 rounded-xl font-bold transition-all shadow-lg shadow-black/10 text-xs font-inter flex items-center justify-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Prescription
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Live Print Preview (2/3 width) */}
            <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[600px] select-none scale-[0.9] origin-center">
                
                {/* Clinic Header */}
                <div>
                  <div className="flex justify-between items-start border-b border-gray-900 pb-4">
                    <div>
                      <h2 className="text-xl font-bold font-instrument italic tracking-tight text-gray-900 leading-none">{settings.clinicName}</h2>
                      <p className="text-[10px] text-gray-400 mt-1 font-inter max-w-xs leading-normal">{settings.clinicAddress}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-black text-white rounded-full text-[8px] font-bold tracking-wider uppercase font-inter">Rx Slip</span>
                      <p className="text-[10px] text-gray-400 mt-1 font-inter leading-none">Ref: {selectedBookingForPrint.bookingRef}</p>
                      <p className="text-[10px] text-[#C8A96B] font-bold mt-1 font-inter">Token #{selectedBookingForPrint.tokenNumber}</p>
                    </div>
                  </div>

                  {/* Doctor & Consultation Info */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100 text-[11px] font-inter">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Prescribing Doctor</p>
                      <p className="font-bold text-gray-900 mt-0.5">{selectedBookingForPrint.doctor?.name || 'Duty Medical Specialist'}</p>
                      <p className="text-[10px] text-[#C8A96B] font-semibold">{selectedBookingForPrint.doctor?.specialty || 'General Care'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Consultation Date</p>
                      <p className="font-bold text-gray-900 mt-0.5">{formatDate(selectedBookingForPrint.date)}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{selectedBookingForPrint.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Patient Info Header */}
                  <div className="grid grid-cols-3 gap-4 py-3 bg-gray-50 px-4 rounded-xl border border-gray-100 my-4 text-[10px] font-inter">
                    <div>
                      <p className="uppercase font-bold tracking-wider text-gray-400">Patient Name</p>
                      <p className="font-bold text-gray-900 mt-0.5 truncate">{patientNameInput || '[ Enter Name ]'}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider text-gray-400">Age</p>
                      <p className="font-bold text-gray-900 mt-0.5">{patientAgeInput ? `${patientAgeInput} years` : '[ Enter Age ]'}</p>
                    </div>
                    <div className="text-right">
                      <p className="uppercase font-bold tracking-wider text-gray-400">Contact</p>
                      <p className="font-bold text-gray-900 mt-0.5">{selectedBookingForPrint.patientPhone}</p>
                    </div>
                  </div>

                  {/* Patient Vitals & Diagnosis Preview */}
                  {(selectedBookingForPrint.vitals || selectedBookingForPrint.diagnosis) && (
                    <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-[#C8A96B]/5 border border-[#C8A96B]/15 rounded-xl mb-4 text-[10px] font-inter leading-relaxed">
                      {selectedBookingForPrint.vitals && (
                        <div>
                          <p className="uppercase font-bold tracking-wider text-[#7A612E] text-[9px]">Patient Vitals</p>
                          <p className="font-semibold text-gray-700 mt-0.5">{selectedBookingForPrint.vitals}</p>
                        </div>
                      )}
                      {selectedBookingForPrint.diagnosis && (
                        <div>
                          <p className="uppercase font-bold tracking-wider text-[#7A612E] text-[9px]">Symptoms & Diagnosis</p>
                          <p className="font-semibold text-gray-700 mt-0.5">{selectedBookingForPrint.diagnosis}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prescribed Items (Rx) */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-instrument text-3xl italic font-bold text-[#C8A96B]">Rx</span>
                      <div className="h-0.5 bg-[#C8A96B]/20 flex-1"></div>
                    </div>

                    {/* Prescribed list preview */}
                    <div className="min-h-[160px]">
                      {medsList.length === 0 ? (
                        <div>
                          <p className="text-[11px] text-gray-400 italic text-center py-6">[ No specific medications pre-configured. Prescriber will write manually on lines below ]</p>
                          <div className="space-y-4 pt-2">
                            <div className="border-b border-dashed border-gray-200 pb-1 select-none">&nbsp;</div>
                            <div className="border-b border-dashed border-gray-200 pb-1 select-none">&nbsp;</div>
                            <div className="border-b border-dashed border-gray-200 pb-1 select-none">&nbsp;</div>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] font-inter">
                            <thead>
                              <tr className="border-b border-gray-200 text-[8px] uppercase font-bold tracking-wider text-gray-400">
                                <th className="pb-1 w-6">#</th>
                                <th className="pb-1">Medication</th>
                                <th className="pb-1">Dosage</th>
                                <th className="pb-1">Frequency</th>
                                <th className="pb-1">Duration</th>
                                <th className="pb-1 w-6 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {medsList.map((m, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="py-2 font-medium text-gray-500">{idx + 1}</td>
                                  <td className="py-2 font-bold text-gray-800">{m.name}</td>
                                  <td className="py-2 text-gray-600">{m.dosage}</td>
                                  <td className="py-2 text-gray-600">{m.frequency}</td>
                                  <td className="py-2 text-gray-600">{m.duration}</td>
                                  <td className="py-2 text-right">
                                    <button 
                                      type="button" 
                                      onClick={() => handleDeleteMed(idx)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer block */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end text-[9px] font-inter text-gray-400 leading-normal">
                  <div>
                    <p>Printed from Clinic Telemetry.</p>
                    <p className="mt-0.5">Authorized for Pharmacy Dispensation.</p>
                  </div>
                  <div className="text-center w-36">
                    <div className="border-b border-gray-200 pb-1 select-none">&nbsp;</div>
                    <p className="font-bold text-gray-800 mt-1">{selectedBookingForPrint.doctor?.name || 'Medical Specialist'}</p>
                    <p className="text-[8px] uppercase tracking-wider text-gray-400 mt-0.5">Signature Line</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
