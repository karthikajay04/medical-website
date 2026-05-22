import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, ChevronRight, MapPin, Phone, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Stores YYYY-MM-DD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  // Doctor schedules & custom leaves for calendar constraints validation
  const [docSchedule, setDocSchedule] = useState<any[]>([]);
  const [docLeaves, setDocLeaves] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form input states (pre-populated if logged in)
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [reason, setReason] = useState('');

  // 1. Fetch real doctor profiles from PostgreSQL on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get<any[]>('/doctors');
        setDoctors(response);
      } catch (err) {
        console.error('Failed to load doctors from backend:', err);
      }
    };
    fetchDoctors();

    // Load logged in user details if available
    const userStr = localStorage.getItem('aethera_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setPatientName(user.name || '');
        setPatientPhone(user.phone || '');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch selected doctor schedule and custom leaves on Step 2 entry
  useEffect(() => {
    if (selectedDoctor && step === 2) {
      setLoadingSchedule(true);
      setValidationError(null);
      setSelectedDate(null); // Clear selected date to prevent choosing old invalid dates
      
      api.get<any>(`/doctors/${selectedDoctor}/schedule`)
        .then((res) => {
          setDocSchedule(res.schedules || []);
          setDocLeaves(res.leaves || []);
        })
        .catch(err => console.error("Error loading doctor schedule constraints:", err))
        .finally(() => setLoadingSchedule(false));
    }
  }, [selectedDoctor, step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Check date constraints against active weekly schedules and leaves
  const handleDateSelect = (isoDate: string) => {
    setValidationError(null);
    const dateObj = new Date(isoDate);
    
    // A. Validate day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDayName = daysOfWeek[dateObj.getDay()];

    if (docSchedule.length > 0) {
      const dayConfig = docSchedule.find(s => s.day === selectedDayName);
      if (dayConfig && !dayConfig.active) {
        setValidationError(`Dr. ${selectedDoctorDetails?.name} is unavailable on ${selectedDayName}s.`);
        setSelectedDate(null);
        return;
      }
    }

    // B. Validate custom vacation/leave days
    if (docLeaves.length > 0) {
      const formattedCalendarDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // e.g. "May 25, 2026"
      
      const matchingLeave = docLeaves.find(leave => {
        const lr = leave.dateRange.toLowerCase();
        const fd = formattedCalendarDate.toLowerCase();
        const iso = isoDate.toLowerCase();
        return lr.includes(fd) || lr.includes(iso) || fd.includes(lr) || iso.includes(lr);
      });

      if (matchingLeave) {
        setValidationError(`Dr. ${selectedDoctorDetails?.name} is on leave on this date: "${matchingLeave.dateRange}" (Reason: ${matchingLeave.reason}).`);
        setSelectedDate(null);
        return;
      }
    }

    // Passed constraints!
    setSelectedDate(isoDate);
  };

  // 2. Submit the booking request to database
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) return;

    setIsSubmitting(true);
    try {
      const response = await api.post<any>('/bookings', {
        doctorId: selectedDoctor,
        date: selectedDate,
        patientName,
        patientPhone,
        patientAge: patientAge || undefined,
        reason: reason || undefined,
      });

      setBookingResult(response);
      setStep(4);
    } catch (error: any) {
      alert(error.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDoctorDetails = doctors.find(d => d.id === selectedDoctor);

  // Format date display for patients (e.g. "Thursday, May 21")
  const formatDateString = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-inter text-sm font-medium transition-all duration-500 ${
                step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-0.5 flex-1 mx-4 transition-all duration-500 ${
                  step > s ? 'bg-black' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="font-instrument text-4xl md:text-5xl mb-4">Select a <i className="text-[#C8A96B]">Specialist</i></h1>
                <p className="text-[#6F6F6F] font-inter">Choose the doctor you would like to consult with.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-[#6F6F6F] font-inter">
                    Loading clinical specialists...
                  </div>
                ) : (
                  doctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => { setSelectedDoctor(doc.id); nextStep(); }}
                      className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left hover:shadow-xl hover:shadow-black/5 ${
                        selectedDoctor === doc.id ? 'border-black bg-white' : 'border-transparent bg-white'
                      }`}
                    >
                      <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <h3 className="font-inter font-semibold text-black">{doc.name}</h3>
                        <p className="text-sm text-[#6F6F6F]">{doc.specialty}</p>
                        <p className="text-[10px] uppercase tracking-wider text-[#C8A96B] font-bold mt-1">{doc.availability}</p>
                      </div>
                      <ChevronRight className="ml-auto w-5 h-5 text-gray-300" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-black mb-6 mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Back to doctors
                </button>
                <h1 className="font-instrument text-4xl md:text-5xl mb-4">Choose <i className="text-[#C8A96B]">Date</i></h1>
                <p className="text-[#6F6F6F] font-inter">When would you like to visit {selectedDoctorDetails?.name}?</p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-10">
                {validationError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Doctor Unavailable</p>
                      <p className="text-[11px] text-red-700 mt-1 font-normal leading-normal">{validationError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-inter font-medium flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C8A96B]" /> Select Date
                  </h3>
                  
                  {loadingSchedule ? (
                    <div className="py-6 text-center text-xs text-gray-400 italic">
                      Retrieving specialist calendar schedules...
                    </div>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((offset) => {
                        const date = new Date();
                        date.setDate(date.getDate() + offset);
                        
                        // Format ISO Date String for backend: YYYY-MM-DD
                        const isoDate = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === isoDate;
                        
                        return (
                          <button
                            key={offset}
                            type="button"
                            onClick={() => {
                              handleDateSelect(isoDate);
                            }}
                            className={`flex flex-col items-center justify-center min-w-[80px] p-4 rounded-2xl border transition-all ${
                              isSelected ? 'bg-black text-white border-black' : 'bg-gray-50 border-transparent hover:border-gray-200'
                            }`}
                          >
                            <span className="text-xs uppercase opacity-60 font-inter">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-xl font-instrument font-bold">
                              {date.getDate()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selectedDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-black/[0.02] border border-black/5 rounded-3xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Queue Status</p>
                        <p className="text-xl font-instrument text-black">Automatic Token Allotment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Clinic Policy</p>
                        <p className="text-sm font-inter text-[#C8A96B]">First Come First Served</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#C8A96B]/10 p-4 rounded-2xl">
                      <Clock className="w-5 h-5 text-[#C8A96B] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#8a6d3b] leading-relaxed font-inter">
                        Your exact Token Number and estimated consultation hour will be calculated instantly upon confirming patient metadata in the final step.
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  disabled={!selectedDate}
                  onClick={nextStep}
                  className="w-full bg-black text-white py-5 rounded-2xl font-inter font-medium flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                >
                  Continue to Patient Details
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-black mb-6 mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Change date
                </button>
                <h1 className="font-instrument text-4xl md:text-5xl mb-4">Patient <i className="text-[#C8A96B]">Details</i></h1>
                <p className="text-[#6F6F6F] font-inter">Please provide information for the consultation.</p>
              </div>

              <form onSubmit={handleBooking} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Phone Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 98765 43210" 
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Age (Years)</label>
                    <input 
                      required 
                      type="number" 
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="30" 
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Reason for Visit (Optional)</label>
                  <textarea 
                    rows={3} 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms..." 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter resize-none" 
                  />
                </div>

                <div className="p-6 bg-[#C8A96B]/5 rounded-3xl border border-[#C8A96B]/20 space-y-3">
                  <p className="text-sm font-inter text-gray-700 font-medium">Booking Summary:</p>
                  <div className="grid grid-cols-2 gap-4 text-xs font-inter">
                    <div>
                      <p className="text-[#6F6F6F] mb-1">Doctor</p>
                      <p className="text-black font-semibold">{selectedDoctorDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-[#6F6F6F] mb-1">Appointment Date</p>
                      <p className="text-black font-semibold">{formatDateString(selectedDate)}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-5 rounded-2xl font-inter font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm Appointment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 4 && bookingResult && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h1 className="font-instrument text-5xl mb-4">Booking <i className="text-[#C8A96B]">Confirmed</i></h1>
                <p className="text-[#6F6F6F] font-inter max-w-md mx-auto">
                  Your appointment has been successfully scheduled. We've locked your slot in our live hospital database.
                </p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96B]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                    <div className="text-left space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F]">Token Reference</p>
                      <p className="text-2xl font-instrument font-bold text-black">{bookingResult.bookingRef}</p>
                      <div className="inline-flex items-center gap-1.5 bg-black text-white px-2 py-0.5 rounded-md">
                        <span className="text-[10px] font-inter">TOKEN</span>
                        <span className="text-sm font-bold font-inter">#{bookingResult.tokenNumber}</span>
                      </div>
                    </div>
                    <img src={bookingResult.doctor?.image || selectedDoctorDetails?.image} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50" />
                  </div>

                  <div className="grid grid-cols-2 gap-8 text-left">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Doctor</p>
                      <p className="font-inter font-semibold">{bookingResult.doctor?.name || selectedDoctorDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Specialty</p>
                      <p className="font-inter font-semibold">{bookingResult.doctor?.specialty || selectedDoctorDetails?.specialty}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Date</p>
                      <p className="font-inter font-semibold">{formatDateString(bookingResult.date)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Est. Time</p>
                      <p className="font-inter font-semibold text-[#C8A96B]">{bookingResult.estimatedTime}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-[#6F6F6F]">
                      <MapPin className="w-4 h-4" />
                      124 Skyview Plaza, Bangalore
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#6F6F6F]">
                      <Phone className="w-4 h-4" />
                      +91 80 4567 8900
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/live-queue" className="bg-black text-white px-8 py-4 rounded-full font-inter font-medium hover:scale-105 transition-transform">
                  Track Live Queue
                </Link>
                <Link to="/" className="bg-gray-100 text-black px-8 py-4 rounded-full font-inter font-medium hover:bg-gray-200 transition-colors">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
