import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const Dashboard = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [doctorsList, bookingsList] = await Promise.all([
          api.get<any[]>('/doctors'),
          api.get<any[]>('/bookings')
        ]);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const merged = doctorsList.map(doc => {
          const todayDocBookings = bookingsList.filter(
            b => b.doctorId === doc.id && b.date === todayStr && b.status !== 'Cancelled'
          );
          return {
            ...doc,
            totalTokens: todayDocBookings.length
          };
        });

        setDoctors(merged);
        setBookings(bookingsList);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.date === todayStr).length;
  
  // Total active/serving tokens in play across the clinic today
  const activeTokensSum = doctors.reduce((acc, doc) => acc + doc.currentToken, 0);

  const stats = [
    { name: 'Total Doctors', value: doctors.length.toString(), icon: Users, change: '+0', changeType: 'increase' },
    { name: "Today's Bookings", value: todayBookingsCount.toString(), icon: Calendar, change: '+12%', changeType: 'increase' },
    { name: 'Active Serving Tokens', value: activeTokensSum.toString(), icon: TrendingUp, change: '+5%', changeType: 'increase' },
    { name: 'Avg. Wait Time', value: '12m', icon: Clock, change: '-2m', changeType: 'decrease' },
  ];

  // Get first 5 bookings for recent bookings panel
  const recentBookings = bookings.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-500 mt-1 font-inter">Here's what's happening with your clinic today.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#6F6F6F] font-inter bg-white border border-gray-100 rounded-3xl">
          Recalculating real-time clinical dashboard telemetry...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <stat.icon className="h-6 w-6 text-black" />
                  </div>
                  <span className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {stat.change}
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                <Link to="/admin/bookings" className="text-sm font-semibold text-black hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 italic">No bookings placed yet.</td>
                      </tr>
                    ) : (
                      recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-bold text-gray-900">{booking.patientName}</p>
                                <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                  <Hash className="w-2.5 h-2.5" /> {booking.bookingRef}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {booking.doctor?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.date)} at {booking.estimatedTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Availability Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Live Doctor Board</h2>
                <Link to="/admin/doctors" className="text-sm font-semibold text-black hover:underline">Manage</Link>
              </div>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center">
                      <img src={doctor.image} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white" />
                      <div className="ml-3">
                        <p className="text-sm font-bold text-gray-900">{doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">{doctor.availability}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        doctor.status === 'Serving' ? 'text-green-600' : doctor.status === 'On Break' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {doctor.status} (Serving #{doctor.currentToken}/{doctor.totalTokens})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
