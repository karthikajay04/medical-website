import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync login status on navigation transitions
  useEffect(() => {
    const userStr = localStorage.getItem('aethera_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('aethera_token');
    localStorage.removeItem('aethera_user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-black" : "text-[#6F6F6F] hover:text-black";
  };

  // Get initials for avatar display
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
      <Link to="/" className="font-instrument text-3xl tracking-tight text-black decoration-transparent">
        Aethera<sup className="text-xl">®</sup>
      </Link>

      <div className="hidden md:flex gap-8 items-center text-sm font-inter">
        <Link to="/" className={`transition-colors ${isActive('/')}`}>Home</Link>
        <Link to="/services" className={`transition-colors ${isActive('/services')}`}>Services</Link>
        <Link to="/live-queue" className={`transition-colors ${isActive('/live-queue')}`}>Live Queue</Link>
        <Link to="/contact" className={`transition-colors ${isActive('/contact')}`}>Contact</Link>
        <Link to="/about" className={`transition-colors ${isActive('/about')}`}>About</Link>
      </div>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <div className="relative">
            {/* Interactive Profile Avatar Button */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-[#C8A96B] to-[#E5D2A8] border-2 border-white shadow-md hover:scale-105 active:scale-95 transition-all text-white font-bold text-xs font-inter"
            >
              {getInitials(user.name)}
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Background Click Overlay to Gracefully Close Dropdown */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Glassmorphic Dropdown Container */}
                <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-black/5 rounded-[2rem] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 ease-out origin-top-right">
                  <div className="px-4 py-3 border-b border-black/5">
                    <p className="text-sm font-bold text-gray-900 leading-none truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6F6F6F] mt-1.5 font-inter uppercase tracking-wider font-bold">
                      {user.role} Account
                    </p>
                  </div>
                  
                  <div className="py-2 space-y-0.5">
                    {user.role === 'ADMIN' ? (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs font-inter font-semibold text-black hover:bg-black/[0.03] rounded-2xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#C8A96B]" />
                        Admin Panel
                      </Link>
                    ) : (
                      <Link 
                        to="/live-queue" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs font-inter font-semibold text-black hover:bg-black/[0.03] rounded-2xl transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#C8A96B]" />
                        My Bookings
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-black/5 pt-2 pb-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-xs font-inter font-semibold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-black text-white rounded-full px-6 py-2.5 text-sm font-inter hover:scale-103 transition-transform duration-300 ease-out"
          >
            Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
}
