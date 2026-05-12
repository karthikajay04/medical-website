import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const DOCTORS = [
  { id: '1', name: 'Dr. Robert Chen', specialty: 'General Physician', availability: 'Mon - Sat', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Dr. Sarah Adams', specialty: 'Pediatrician', availability: 'Mon, Wed, Fri', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Dr. Amit Patel', specialty: 'Orthopedics', availability: 'Tue, Thu', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Dr. Emily Lee', specialty: 'Gynecologist', availability: 'Sat', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=200&q=80' },
];



export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBookingRef('ATH-' + Math.random().toString(36).substr(2, 6).toUpperCase());
    setStep(4);
    setIsSubmitting(false);
  };

  const selectedDoctorDetails = DOCTORS.find(d => d.id === selectedDoctor);

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
                {DOCTORS.map((doc) => (
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
                ))}
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
                <h1 className="font-instrument text-4xl md:text-5xl mb-4">Choose <i className="text-[#C8A96B]">Date & Time</i></h1>
                <p className="text-[#6F6F6F] font-inter">When would you like to visit {selectedDoctorDetails?.name}?</p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-10">
                <div className="space-y-4">
                  <h3 className="font-inter font-medium flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C8A96B]" /> Select Date
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {[0, 1, 2, 3, 4, 5].map((offset) => {
                      const date = new Date();
                      date.setDate(date.getDate() + offset);
                      const isSelected = selectedDate === date.toDateString();
                      return (
                        <button
                          key={offset}
                          onClick={() => {
                            setSelectedDate(date.toDateString());
                            // Simulate getting the next token for this date
                            const baseToken = 10 + Math.floor(Math.random() * 20);
                            setSelectedTime(`~${10 + Math.floor(baseToken * 10 / 60)}:${(baseToken * 10) % 60 === 0 ? '00' : (baseToken * 10) % 60} AM`);
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
                </div>

                {selectedDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-black/[0.02] border border-black/5 rounded-3xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Your Assigned Token</p>
                        <p className="text-4xl font-instrument text-black">#24</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Estimated Time</p>
                        <p className="text-2xl font-instrument text-[#C8A96B]">11:45 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#C8A96B]/10 p-4 rounded-2xl">
                      <Clock className="w-5 h-5 text-[#C8A96B] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#8a6d3b] leading-relaxed font-inter">
                        Times are estimated based on average consultation length. We recommend arriving 15 minutes early or tracking the live queue for better accuracy.
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  disabled={!selectedDate}
                  onClick={() => {
                    setSelectedTime("11:45 AM"); // Mock value for the next step
                    nextStep();
                  }}
                  className="w-full bg-black text-white py-5 rounded-2xl font-inter font-medium flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                >
                  Confirm Token
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
                  <ArrowLeft className="w-4 h-4" /> Change time
                </button>
                <h1 className="font-instrument text-4xl md:text-5xl mb-4">Patient <i className="text-[#C8A96B]">Details</i></h1>
                <p className="text-[#6F6F6F] font-inter">Please provide information for the consultation.</p>
              </div>

              <form onSubmit={handleBooking} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Phone Number</label>
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter font-semibold uppercase tracking-wider text-gray-500 ml-1">Reason for Visit (Optional)</label>
                  <textarea rows={3} placeholder="Briefly describe your symptoms..." className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-inter resize-none" />
                </div>

                <div className="p-6 bg-[#C8A96B]/5 rounded-3xl border border-[#C8A96B]/20 space-y-3">
                  <p className="text-sm font-inter text-gray-700 font-medium">Booking Summary:</p>
                  <div className="grid grid-cols-2 gap-4 text-xs font-inter">
                    <div>
                      <p className="text-[#6F6F6F] mb-1">Doctor</p>
                      <p className="text-black font-semibold">{selectedDoctorDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-[#6F6F6F] mb-1">Appointment</p>
                      <p className="text-black font-semibold">{selectedDate} at {selectedTime}</p>
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

          {step === 4 && (
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
                  Your appointment has been successfully scheduled. We've sent the details to your phone number.
                </p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96B]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                    <div className="text-left space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F]">Token Reference</p>
                      <p className="text-2xl font-instrument font-bold text-black">{bookingRef}</p>
                      <div className="inline-flex items-center gap-1.5 bg-black text-white px-2 py-0.5 rounded-md">
                        <span className="text-[10px] font-inter">TOKEN</span>
                        <span className="text-sm font-bold font-inter">#24</span>
                      </div>
                    </div>
                    <img src={selectedDoctorDetails?.image} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50" />
                  </div>

                  <div className="grid grid-cols-2 gap-8 text-left">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Doctor</p>
                      <p className="font-inter font-semibold">{selectedDoctorDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Specialty</p>
                      <p className="font-inter font-semibold">{selectedDoctorDetails?.specialty}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Date</p>
                      <p className="font-inter font-semibold">{selectedDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6F6F6F] mb-1">Time</p>
                      <p className="font-inter font-semibold">{selectedTime}</p>
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
