import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const Doctors = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const doctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Smith', 
      specialization: 'Cardiologist', 
      email: 'sarah.smith@clinic.com', 
      phone: '+1 234 567 890',
      status: 'Active',
      patients: 1240,
      image: 'https://images.unsplash.com/photo-1559839734-2b71f153678f?q=80&w=200&h=200&auto=format&fit=crop'
    },
    { 
      id: 2, 
      name: 'Dr. Michael Chen', 
      specialization: 'Pediatrician', 
      email: 'michael.chen@clinic.com', 
      phone: '+1 234 567 891',
      status: 'Active',
      patients: 890,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop'
    },
    { 
      id: 3, 
      name: 'Dr. Emily Brown', 
      specialization: 'Dermatologist', 
      email: 'emily.brown@clinic.com', 
      phone: '+1 234 567 892',
      status: 'Inactive',
      patients: 560,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-gray-500 mt-1">Add, edit or remove doctors from your clinic.</p>
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
            placeholder="Search by name, specialty..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 outline-none">
            <option>All Specialties</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                    doctor.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {doctor.status === 'Active' ? <CheckCircle2 className="h-3 w-3 text-white" /> : <XCircle className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-sm font-medium text-[#C8A96B]">{doctor.specialization}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {doctor.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {doctor.phone}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Patients</p>
                  <p className="text-lg font-bold text-gray-900">{doctor.patients}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 border border-gray-100 rounded-xl transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-50 rounded-xl transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal (Simulated) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Add New Doctor</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full transition-all">
                <XCircle className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all" placeholder="Dr. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all" placeholder="e.g. Cardiology" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all" placeholder="+1 234..." />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                >
                  Save Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
