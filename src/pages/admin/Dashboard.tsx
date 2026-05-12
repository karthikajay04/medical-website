import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Doctors', value: '12', icon: Users, change: '+1', changeType: 'increase' },
    { name: 'Today\'s Bookings', value: '48', icon: Calendar, change: '+12%', changeType: 'increase' },
    { name: 'Current Tokens', value: '156', icon: TrendingUp, change: '+5%', changeType: 'increase' },
    { name: 'Avg. Wait Time', value: '18m', icon: Clock, change: '-2m', changeType: 'decrease' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your clinic today.</p>
      </div>

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
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
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
            <button className="text-sm font-semibold text-black hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          P{i}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Patient Name</p>
                          <p className="text-xs text-gray-500">ID: #BT-00{i}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Dr. Sarah Smith
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      10:30 AM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Availability Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Doctor Schedule</h2>
            <button className="text-sm font-semibold text-black hover:underline">Manage</button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Dr. Sarah Smith', specialization: 'Cardiology', status: 'In Consultation', time: '9:00 - 14:00' },
              { name: 'Dr. Michael Chen', specialization: 'Pediatrics', status: 'Available', time: '10:00 - 16:00' },
              { name: 'Dr. Emily Brown', specialization: 'Dermatology', status: 'On Break', time: '11:00 - 18:00' },
            ].map((doctor) => (
              <div key={doctor.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{doctor.time}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    doctor.status === 'Available' ? 'text-green-600' : doctor.status === 'In Consultation' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {doctor.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
