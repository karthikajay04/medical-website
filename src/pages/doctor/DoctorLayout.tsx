import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  Bell,
  Stethoscope
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [doctorUser, setDoctorUser] = useState<any>(null);

  // Security layer: enforce DOCTOR role
  useEffect(() => {
    const token = localStorage.getItem('aethera_token');
    const userStr = localStorage.getItem('aethera_user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error(e);
    }

    if (!token || !user || user.role !== 'DOCTOR') {
      navigate('/login');
    } else {
      setDoctorUser(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aethera_token');
    localStorage.removeItem('aethera_user');
    navigate('/login');
  };

  const navigation = [
    { name: 'Patient Queue', href: '/doctor/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0B2C24] text-white z-50">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white text-[#0B2C24] rounded-xl flex items-center justify-center shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">Aethera</span>
                <span className="text-[10px] text-[#C8A96B] font-bold tracking-widest uppercase mt-1 block">Physician</span>
              </div>
            </Link>
          </div>
          <nav className="mt-10 flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#C8A96B] text-white shadow-lg shadow-[#C8A96B]/20' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-white/10 p-4">
          <button 
            onClick={handleLogout}
            className="flex-shrink-0 w-full group flex items-center px-4 py-2.5 text-sm font-semibold text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-400" />
            Logout Workspace
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0B2C24] z-[70] transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white text-[#0B2C24] rounded-xl flex items-center justify-center shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">Aethera</span>
                <span className="text-[10px] text-[#C8A96B] font-bold tracking-widest uppercase mt-1 block">Physician</span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          <nav className="mt-10 flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#C8A96B] text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-white/10 p-4">
          <button 
            onClick={handleLogout}
            className="flex-shrink-0 w-full group flex items-center px-4 py-2.5 text-sm font-semibold text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-400" />
            Logout Workspace
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 ml-2 pl-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900 leading-none">{doctorUser?.name || 'Doctor Workspace'}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Clinical Specialist</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
                  {doctorUser?.name?.replace('Dr. ', '')?.[0] || 'D'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
