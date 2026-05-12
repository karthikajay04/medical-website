import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';

const Availability = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(1);
  
  const doctors = [
    { id: 1, name: 'Dr. Sarah Smith', specialization: 'Cardiology' },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Pediatrics' },
    { id: 3, name: 'Dr. Emily Brown', specialization: 'Dermatology' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [schedule, setSchedule] = useState([
    { day: 'Monday', start: '09:00', end: '14:00', active: true },
    { day: 'Tuesday', start: '09:00', end: '14:00', active: true },
    { day: 'Wednesday', start: '10:00', end: '16:00', active: true },
    { day: 'Thursday', start: '09:00', end: '14:00', active: true },
    { day: 'Friday', start: '09:00', end: '14:00', active: true },
    { day: 'Saturday', start: '10:00', end: '13:00', active: false },
    { day: 'Sunday', start: '00:00', end: '00:00', active: false },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-gray-500 mt-1">Set working hours and leaves for your doctors.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Doctor Selection Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">Select Doctor</h3>
          <div className="space-y-2">
            {doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedDoctor === doctor.id 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                }`}
              >
                <p className="font-bold text-sm">{doctor.name}</p>
                <p className={`text-xs mt-1 ${selectedDoctor === doctor.id ? 'text-gray-400' : 'text-gray-500'}`}>
                  {doctor.specialization}
                </p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-8">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-900">Pro Tip</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Changes made here will reflect in the booking calendar for patients immediately.
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
                  <h3 className="font-bold text-gray-900">Weekly Schedule</h3>
                  <p className="text-xs text-gray-500">Set regular working hours</p>
                </div>
              </div>
            </div>

            <div className="p-6 divide-y divide-gray-50">
              {schedule.map((item, index) => (
                <div key={item.day} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-32">
                    <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="font-bold text-gray-900">{item.day}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    {item.active ? (
                      <>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                              type="time" 
                              value={item.start}
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                            />
                          </div>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                              type="time" 
                              value={item.end}
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                            />
                          </div>
                        </div>
                        <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 py-2.5 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 font-medium italic text-center">
                        Unavailable / Day Off
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <button 
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.active ? 'bg-black' : 'bg-gray-200'}`}
                      onClick={() => {
                        const newSchedule = [...schedule];
                        newSchedule[index].active = !newSchedule[index].active;
                        setSchedule(newSchedule);
                      }}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Dates Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Custom Leaves & Special Dates</h3>
                <p className="text-xs text-gray-500 mt-1">Add holidays or specific unavailable dates</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-200">
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add Date
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">May 25, 2026</p>
                    <p className="text-xs text-red-600 font-medium">Public Holiday</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">June 10-12, 2026</p>
                    <p className="text-xs text-orange-600 font-medium">Medical Conference</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
