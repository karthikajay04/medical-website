import { motion } from 'framer-motion';
import { Clock, Users, Navigation, Calendar, ArrowRight, User, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DoctorQueue {
  id: string;
  name: string;
  specialization: string;
  currentToken: number;
  totalTokens: number;
  status: 'Serving' | 'On Break' | 'Coming Soon';
  type: 'General' | 'Visiting';
}

const MOCK_DOCTORS: DoctorQueue[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'General Physician',
    currentToken: 12,
    totalTokens: 25,
    status: 'Serving',
    type: 'General',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    currentToken: 5,
    totalTokens: 10,
    status: 'Serving',
    type: 'Visiting',
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    specialization: 'Dermatologist',
    currentToken: 0,
    totalTokens: 8,
    status: 'Coming Soon',
    type: 'Visiting',
  },
];

const MY_BOOKING = {
  doctorName: 'Dr. Sarah Wilson',
  tokenNumber: 18,
  estimatedWait: '45 mins',
  appointmentTime: '11:30 AM',
  hospitalDistance: '4.2 km',
  travelTime: '15 mins',
};

export default function LiveQueue() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            <span className="text-xs font-inter font-medium tracking-wide uppercase text-[#6F6F6F]">Live Updates</span>
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-black/10"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A96B]/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-white/60 text-sm font-inter mb-1">Your Appointment</p>
                  <h3 className="text-2xl font-instrument">{MY_BOOKING.doctorName}</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                  <Calendar className="w-6 h-6 text-[#C8A96B]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Token Number</p>
                  <p className="text-4xl font-instrument text-[#C8A96B]">#{MY_BOOKING.tokenNumber}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Est. Wait</p>
                  <p className="text-4xl font-instrument">~{MY_BOOKING.estimatedWait.split(' ')[0]}<span className="text-lg">m</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group hover:border-[#C8A96B]/30 transition-colors">
                  <div className="bg-[#C8A96B]/20 rounded-xl p-2.5">
                    <Navigation className="w-5 h-5 text-[#C8A96B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">Time to reach hospital</p>
                    <p className="text-sm font-medium">{MY_BOOKING.travelTime} from your location</p>
                  </div>
                  <div className="text-white/60 text-xs flex items-center gap-1">
                    {MY_BOOKING.hospitalDistance}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="bg-[#C8A96B]/20 rounded-xl p-2.5">
                    <Clock className="w-5 h-5 text-[#C8A96B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs uppercase tracking-wider">Scheduled for</p>
                    <p className="text-sm font-medium">{MY_BOOKING.appointmentTime} (approx)</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 bg-[#C8A96B] hover:bg-[#B6965A] text-black font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-all group">
                Open Maps Navigation
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

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
            {MOCK_DOCTORS.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className="bg-white border border-black/5 rounded-[2rem] p-6 hover:shadow-lg hover:shadow-black/5 transition-all group"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center">
                      <User className="w-8 h-8 text-black/20" />
                    </div>
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
                        {doc.status === 'Serving' ? `#${doc.currentToken}` : '--'}
                      </p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#6F6F6F] mb-1">In Queue</p>
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
            ))}
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
