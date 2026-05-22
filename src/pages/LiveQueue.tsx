import { motion } from 'framer-motion';
import { Clock, Users, Navigation, Calendar, ArrowRight, User, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface DoctorQueue {
  id: string;
  name: string;
  specialization: string;
  currentToken: number;
  totalTokens: number;
  status: 'Serving' | 'On Break' | 'Coming Soon' | 'Inactive';
  type: 'General' | 'Visiting';
  image?: string;
}

export default function LiveQueue() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [doctors, setDoctors] = useState<DoctorQueue[]>([]);
  const [myBooking, setMyBooking] = useState<any | null>(null);
  const [allMyBookings, setAllMyBookings] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadUserData = () => {
    const token = localStorage.getItem('aethera_token');
    setIsLoggedIn(!!token);

    if (token) {
      const todayStr = new Date().toISOString().split('T')[0];
      api.get<any[]>('/bookings/my')
        .then((bookings) => {
          setAllMyBookings(bookings);
          // Find the active booking for today
          const activeToday = bookings.find(
            b => b.date === todayStr && b.status === 'Pending'
          );
          if (activeToday) {
            setMyBooking(activeToday);
          } else {
            setMyBooking(null);
          }
        })
        .catch(err => console.error("Error loading user bookings:", err));
    }
  };

  // 2. Server-Sent Events (SSE) and Booking sync
  useEffect(() => {
    loadUserData();

    // Connect to Server-Sent Events stream for zero-latency queue changes!
    const eventSource = new EventSource('http://localhost:5000/api/queue/live');

    eventSource.onmessage = (event) => {
      try {
        const freshQueueData = JSON.parse(event.data);
        setDoctors(freshQueueData);
      } catch (err) {
        console.error("Failed to parse SSE payload:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection closed or experienced an error, auto-reconnecting:", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`, {});
      alert("Appointment successfully cancelled!");
      loadUserData();
    } catch (err: any) {
      alert(err.message || "Failed to cancel appointment.");
    }
  };

  // Find the queue metrics for the logged in patient's assigned doctor
  const matchedDoctor = myBooking ? doctors.find(d => d.id === myBooking.doctorId) : null;

  // Calculate wait time dynamically: (My Token - Doctor Current Token) * 12 minutes
  const calculateDynamicWait = () => {
    if (!myBooking || !matchedDoctor) return 0;
    const tokensAhead = myBooking.tokenNumber - matchedDoctor.currentToken;
    if (tokensAhead <= 0) return 0;
    return tokensAhead * 12; // 12 minutes average consultation time
  };

  const dynamicWaitTime = calculateDynamicWait();

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header Section */}
      <section className="relative pt-20 pb-12 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-black/5 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-inter font-medium tracking-wide uppercase text-[#6F6F6F]">Live Updates (SSE Connected)</span>
          </div>
          <h1 className="font-instrument text-5xl sm:text-7xl font-normal tracking-tight text-black mb-4">
            Live Queue <i className="text-[#C8A96B]">Status</i>
          </h1>
          <p className="font-inter text-[#6F6F6F] max-w-xl mx-auto text-lg">
            Monitor real-time patient flow and your personal appointment status.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Personal Status */}
        <div className="lg:col-span-5 space-y-6">
          {myBooking && matchedDoctor ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-black/10"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A96B]/10 blur-[100px] rounded-full -mr-20 -mt-20" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-white/60 text-sm font-inter mb-1">Your Appointment</p>
                    <h3 className="text-2xl font-instrument">{myBooking.doctor?.name || matchedDoctor.name}</h3>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                    <Calendar className="w-6 h-6 text-[#C8A96B]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Token Number</p>
                    <p className="text-4xl font-instrument text-[#C8A96B]">#{myBooking.tokenNumber}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Est. Wait</p>
                    <p className="text-4xl font-instrument">
                      {dynamicWaitTime > 0 ? (
                        <>~{dynamicWaitTime}<span className="text-lg">m</span></>
                      ) : (
                        <span className="text-lg text-green-400 font-inter font-semibold uppercase tracking-wider">Now Serving</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group hover:border-[#C8A96B]/30 transition-colors">
                    <div className="bg-[#C8A96B]/20 rounded-xl p-2.5">
                      <Navigation className="w-5 h-5 text-[#C8A96B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/40 text-xs uppercase tracking-wider">Estimated Commute</p>
                      <p className="text-sm font-medium">15 mins travel time</p>
                    </div>
                    <div className="text-white/60 text-xs flex items-center gap-1">
                      4.2 km
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="bg-[#C8A96B]/20 rounded-xl p-2.5">
                      <Clock className="w-5 h-5 text-[#C8A96B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/40 text-xs uppercase tracking-wider">Scheduled for</p>
                      <p className="text-sm font-medium">{myBooking.estimatedTime} (approx)</p>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-8 bg-[#C8A96B] hover:bg-[#B6965A] text-black font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-all group block text-center"
                >
                  Open Maps Navigation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-black/10 text-center space-y-6"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A96B]/10 blur-[100px] rounded-full -mr-20 -mt-20" />
              
              <div className="relative z-10 py-6 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-[#C8A96B]">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-instrument">Track Your Turn</h3>
                  <p className="text-white/60 font-inter text-sm max-w-xs mx-auto leading-relaxed">
                    {!isLoggedIn 
                      ? "Sign in to your patient account to automatically pull your token and view dynamic commute forecasts." 
                      : "You don't have an active booking registered for today."}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" className="bg-[#C8A96B] hover:bg-[#B6965A] text-black font-medium py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm font-inter">
                        Log In to Account
                      </Link>
                      <Link to="/book" className="bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 rounded-full transition-all text-sm font-inter">
                        Book a Visit
                      </Link>
                    </>
                  ) : (
                    <Link to="/book" className="bg-[#C8A96B] hover:bg-[#B6965A] text-black font-medium py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm font-inter">
                      Create a Booking
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hospital Address Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white border border-black/5 rounded-3xl p-6 flex items-start gap-4 shadow-sm"
          >
            <div className="bg-black/5 rounded-2xl p-3">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="font-semibold text-black">Aethera Wellness Center</h4>
              <p className="text-sm text-[#6F6F6F] mt-1 leading-relaxed">
                124 Skyview Plaza, Medical District,<br />
                Bangalore, KA 560001
              </p>
            </div>
          </motion.div>

          {/* My Bookings History / Tracker List */}
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#C8A96B]" />
                <h4 className="font-semibold text-black">My Bookings Portfolio</h4>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {allMyBookings.length === 0 ? (
                  <p className="text-xs text-[#6F6F6F] italic">No active or historic appointments booked.</p>
                ) : (
                  allMyBookings.map((b) => (
                    <div key={b.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between text-xs gap-3">
                      <div>
                        <p className="font-bold text-gray-900">{b.doctor?.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{b.date} • {b.estimatedTime}</p>
                        <span className="text-[9px] font-bold text-[#C8A96B]">Token #{b.tokenNumber}</span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          b.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {b.status}
                        </span>

                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-[10px] font-semibold text-red-600 hover:text-red-700 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: All Doctors Queue */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-instrument text-black">Clinic Board</h2>
            <p className="text-sm font-inter text-[#6F6F6F]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="space-y-4">
            {doctors.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-[2rem] p-12 text-center text-[#6F6F6F] font-inter">
                Connecting to clinical display board...
              </div>
            ) : (
              doctors.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white border border-black/5 rounded-[2rem] p-6 hover:shadow-lg hover:shadow-black/5 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative">
                      {doc.image ? (
                        <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center">
                          <User className="w-8 h-8 text-black/20" />
                        </div>
                      )}
                      {doc.status === 'Serving' && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A96B] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C8A96B]"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-black">{doc.name}</h3>
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold w-fit mx-auto sm:mx-0 ${
                          doc.type === 'General' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-[#6F6F6F] text-sm">{doc.specialization}</p>
                    </div>

                    <div className="flex gap-4 items-center bg-black/[0.02] rounded-2xl p-4 border border-black/[0.05] min-w-[200px]">
                      <div className="text-center border-r border-black/10 pr-4">
                        <p className="text-[10px] uppercase tracking-wider text-[#6F6F6F] mb-1">Current</p>
                        <p className="text-2xl font-instrument text-black">
                          {doc.status === 'Serving' && doc.currentToken > 0 ? `#${doc.currentToken}` : '--'}
                        </p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6F6F6F] mb-1">Total</p>
                        <p className="text-2xl font-instrument text-black">{doc.totalTokens}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        doc.status === 'Serving' ? 'bg-green-100 text-green-700' : 
                        doc.status === 'On Break' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {doc.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="bg-[#C8A96B]/5 border border-[#C8A96B]/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[#C8A96B]" />
              <h4 className="font-semibold text-black">Queue Information</h4>
            </div>
            <p className="text-sm text-[#6F6F6F] leading-relaxed">
              Token numbers are updated in real-time as the medical staff processes each patient. 
              Please arrive at least 15 minutes before your estimated time to reach to ensure a smooth check-in process.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
