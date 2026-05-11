import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Banner } from '@/components/ui/banner';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="relative min-h-screen w-full bg-white text-black flex flex-col font-inter">
      {!isAuthPage && (
        <>
          <Banner
            id="top-banner"
            variant="rainbow"
            height="auto"
            className="bg-black text-white p-0 z-50 border-b border-white/10"
            rainbowColors={[
              "rgba(200,169,107,0.5)",
              "transparent",
              "rgba(200,169,107,0.5)",
              "transparent",
              "rgba(200,169,107,0.5)",
              "transparent",
            ]}
          >
            <Link to="/services#schedule" className="w-full h-full text-xs sm:text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors z-50">
              <span>Need to see a doctor? Check our <span className="text-[#C8A96B]">visiting schedule</span></span>
              <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
            </Link>
          </Banner>
          <Navbar />
        </>
      )}
      <div className="flex-1 w-full flex flex-col relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
