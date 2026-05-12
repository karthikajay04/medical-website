import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, Microscope, Scan, Pill, CalendarClock, Clock, Building, GraduationCap } from 'lucide-react';

const facilities = [
  {
    title: 'Diagnostic Lab',
    description: 'In-house laboratory for quick, accurate blood work and routine testing.',
    icon: Microscope,
    color: 'from-[#f5f7fa] to-[#e6ecf5]',
  },
  {
    title: 'Digital X-Ray',
    description: 'Modern, low-dose digital imaging system for immediate diagnostics.',
    icon: Scan,
    color: 'from-[#f5fcfc] to-[#e6f5f5]',
  },
  {
    title: 'Pharmacy',
    description: 'Fully stocked in-house pharmacy providing all essential medicines.',
    icon: Pill,
    color: 'from-[#fdf8f5] to-[#faebe3]',
  },
];

const schedule = [
  {
    day: 'Monday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 5:00 PM' },
      { name: 'Dr. Sarah Adams', qualification: 'MBBS, DCH', specialty: 'Pediatrician', hospital: 'City Children\'s Hospital', time: '10:00 AM - 2:00 PM' },
    ]
  },
  {
    day: 'Tuesday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 5:00 PM' },
      { name: 'Dr. Amit Patel', qualification: 'MBBS, MS (Ortho)', specialty: 'Orthopedics', hospital: 'Metro General Hospital', time: '4:00 PM - 7:00 PM' },
    ]
  },
  {
    day: 'Wednesday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 5:00 PM' },
      { name: 'Dr. Sarah Adams', qualification: 'MBBS, DCH', specialty: 'Pediatrician', hospital: 'City Children\'s Hospital', time: '10:00 AM - 2:00 PM' },
    ]
  },
  {
    day: 'Thursday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 5:00 PM' },
      { name: 'Dr. Amit Patel', qualification: 'MBBS, MS (Ortho)', specialty: 'Orthopedics', hospital: 'Metro General Hospital', time: '4:00 PM - 7:00 PM' },
    ]
  },
  {
    day: 'Friday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 5:00 PM' },
      { name: 'Dr. Sarah Adams', qualification: 'MBBS, DCH', specialty: 'Pediatrician', hospital: 'City Children\'s Hospital', time: '10:00 AM - 2:00 PM' },
    ]
  },
  {
    day: 'Saturday',
    doctors: [
      { name: 'Dr. Robert Chen', qualification: 'MBBS, MD', specialty: 'General Physician', hospital: 'Aethera Clinic', time: '9:00 AM - 1:00 PM' },
      { name: 'Dr. Emily Lee', qualification: 'MBBS, MS (OBG)', specialty: 'Gynecologist', hospital: 'Women\'s Care Center', time: '10:00 AM - 1:00 PM' },
    ]
  },
  {
    day: 'Sunday',
    doctors: [
      { name: 'Clinic Closed', qualification: '-', specialty: 'Emergency Only', hospital: '-', time: '-' },
    ]
  }
];

export default function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        // Small timeout ensures the DOM has fully painted
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="relative z-10 w-full px-6 pb-32 pt-16 md:pt-24 max-w-7xl mx-auto flex-1">
      
      {/* Top Section: Facilities */}
      <div className="text-center mb-16 opacity-0 animate-fade-rise">
        <h2 className="font-instrument text-5xl md:text-7xl mb-6 tracking-tight">
          Our <i className="text-[#C8A96B]">Facilities</i>
        </h2>
        <p className="font-inter text-[#6F6F6F] max-w-2xl mx-auto text-lg leading-relaxed">
          Everything you need for immediate care, right under one roof. We've equipped our clinic with essential, modern facilities for your convenience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 opacity-0 animate-fade-rise-delay mb-32">
        {facilities.map((facility, index) => {
          const Icon = facility.icon;
          return (
            <div 
              key={index}
              className="group relative bg-white border border-gray-100 p-8 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ease-out hover:-translate-y-2 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${facility.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-white group-hover:shadow-sm transition-colors duration-300">
                  <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-instrument text-3xl mb-4 group-hover:text-[#C8A96B] transition-colors duration-300">
                  {facility.title}
                </h3>
                
                <p className="font-inter text-[#6F6F6F] leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
                  {facility.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Doctor Schedule */}
      <div id="schedule" className="opacity-0 animate-fade-rise-delay-2 scroll-mt-32">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
          <div>
            <h2 className="font-instrument text-4xl md:text-5xl mb-2">
              Visiting <i className="text-[#C8A96B]">Schedule</i>
            </h2>
            <p className="font-inter text-[#6F6F6F]">Weekly availability for our resident and visiting specialists.</p>
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-full bg-gray-50 items-center justify-center">
            <CalendarClock className="w-8 h-8 text-black" strokeWidth={1.5} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {schedule.map((daySchedule, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start group">
              <div className="w-32 pt-1 font-instrument text-2xl text-black group-hover:text-[#C8A96B] transition-colors">
                {daySchedule.day}
              </div>
              <div className="flex-1 w-full space-y-4">
                {daySchedule.doctors.map((doc, docIdx) => (
                  <div key={docIdx} className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-gray-200 transition-colors">
                    <div>
                      <h4 className="font-inter font-medium text-black text-lg">{doc.name}</h4>
                      <p className="font-inter text-[#6F6F6F] text-sm mt-0.5">{doc.specialty}</p>
                      {doc.hospital !== '-' && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-inter text-[#8a8a8a]">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {doc.qualification}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-inter text-[#8a8a8a]">
                            <Building className="w-3.5 h-3.5" />
                            {doc.hospital}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-inter font-medium text-black bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                      <Clock className="w-4 h-4 text-[#C8A96B]" />
                      {doc.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: CTA */}
      <div className="mt-32 bg-black rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group opacity-0 animate-fade-rise-delay-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <h2 className="font-instrument text-4xl md:text-6xl text-white mb-6">
            Need to see a doctor?
          </h2>
          <p className="font-inter text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Walk-ins are always welcome, but booking ahead ensures you see our specialists without the wait.
          </p>
          <Link to="/book" className="bg-white text-black rounded-full px-10 py-4 text-base font-inter hover:scale-105 transition-transform duration-300 ease-out flex items-center justify-center gap-2 mx-auto">
            Book an Appointment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
