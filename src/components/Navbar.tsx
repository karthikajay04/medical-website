import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-black" : "text-[#6F6F6F] hover:text-black";
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

      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-xs font-inter text-gray-400 hover:text-black transition-colors flex items-center gap-1 group">
          <span className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-pulse"></span>
          Admin Panel
        </Link>
        <Link to="/login" className="bg-black text-white rounded-full px-6 py-2.5 text-sm font-inter hover:scale-103 transition-transform duration-300 ease-out">
          Login/Signup
        </Link>
      </div>
    </nav>
  );
}
