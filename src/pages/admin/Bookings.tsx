import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  MoreVertical,
  Check,
  X,
  Clock,
  User,
  Hash
} from 'lucide-react';

const Bookings = () => {
  const bookings = [
    { id: 'BK-7821', patient: 'Alex Johnson', doctor: 'Dr. Sarah Smith', date: '2026-05-12', time: '09:30 AM', type: 'Checkup', status: 'Confirmed', token: 12 },
    { id: 'BK-7822', patient: 'Maria Garcia', doctor: 'Dr. Michael Chen', date: '2026-05-12', time: '10:15 AM', type: 'Consultation', status: 'Pending', token: 13 },
    { id: 'BK-7823', patient: 'James Wilson', doctor: 'Dr. Emily Brown', date: '2026-05-12', time: '11:00 AM', type: 'Follow-up', status: 'Completed', token: 14 },
    { id: 'BK-7824', patient: 'Sarah Lee', doctor: 'Dr. Sarah Smith', date: '2026-05-12', time: '11:45 AM', type: 'Emergency', status: 'Cancelled', token: 15 },
    { id: 'BK-7825', patient: 'Robert Taylor', doctor: 'Dr. Michael Chen', date: '2026-05-12', time: '01:30 PM', type: 'Consultation', status: 'Confirmed', token: 16 },
    { id: 'BK-7826', patient: 'Emma Davis', doctor: 'Dr. Emily Brown', date: '2026-05-12', time: '02:15 PM', type: 'Checkup', status: 'Confirmed', token: 17 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings & Appointments</h1>
          <p className="text-gray-500 mt-1">Manage and track all patient appointments.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
            <Calendar className="h-4 w-4 mr-2" />
            Add Booking
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: '48', color: 'bg-black' },
          { label: 'Pending', value: '12', color: 'bg-yellow-500' },
          { label: 'Confirmed', value: '32', color: 'bg-green-500' },
          { label: 'Cancelled', value: '4', color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-1 h-10 rounded-full ${stat.color}`} />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, patient or doctor..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 outline-none">
              <option>Status: All</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient & ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time & Token</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Appointment Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-bold text-gray-900">{booking.patient}</p>
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <Hash className="h-3 w-3" /> {booking.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-700">{booking.doctor}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {booking.time}
                      </p>
                      <p className="text-xs text-[#C8A96B] font-bold">Token #{booking.token}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-medium">{booking.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Confirm">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Cancel">
                        <X className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500">Showing 1-6 of 48 bookings</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:border-black transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
