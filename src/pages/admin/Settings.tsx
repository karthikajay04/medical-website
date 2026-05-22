import { useState, useEffect } from 'react';
import { 
  Bell, 
  Shield, 
  Database, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';

const Settings = () => {
  const [clinicName, setClinicName] = useState('Aethera Wellness Center');
  const [clinicAddress, setClinicAddress] = useState('124 Skyview Plaza, Medical District, Bangalore');
  const [slotDuration, setSlotDuration] = useState('12');
  const [notifyOnToken, setNotifyOnToken] = useState('2');
  const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/mock-community-link');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. Fetch settings from PostgreSQL on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get<any>('/settings');
        if (res.clinicName) setClinicName(res.clinicName);
        if (res.clinicAddress) setClinicAddress(res.clinicAddress);
        if (res.slotDuration) setSlotDuration(res.slotDuration);
        if (res.notifyOnToken) setNotifyOnToken(res.notifyOnToken);
        if (res.whatsappLink) setWhatsappLink(res.whatsappLink);
      } catch (err) {
        console.error('Failed to load clinic settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Post settings to PostgreSQL
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.post('/settings', {
        clinicName,
        clinicAddress,
        slotDuration,
        notifyOnToken,
        whatsappLink
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to commit settings to database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Manage your clinic preferences, consultation schedules, and notification criteria.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#6F6F6F] font-inter bg-white border border-gray-100 rounded-3xl">
          Retrieving clinic system preferences...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-250">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              Settings successfully committed to PostgreSQL database!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Selector List */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                <Database className="w-5 h-5 text-[#C8A96B] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">Clinic Profile</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">Customize clinic credentials, support routes, and details.</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                <Bell className="w-5 h-5 text-[#C8A96B] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">SMS & Live Alerts</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">Control notifications when queue tokens reach a specific limit.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#C8A96B] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">Database Synced</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">All setting adjustments map to PostgreSQL config rows.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Setting Form Panels */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Profile Config */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C8A96B]" /> Clinic Identity Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Clinic Official Name</label>
                    <input 
                      type="text" 
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Clinic Location Address</label>
                    <input 
                      type="text" 
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp Community Link</label>
                    <input 
                      type="url" 
                      value={whatsappLink}
                      onChange={(e) => setWhatsappLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Scheduling Config */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C8A96B]" /> Consultation Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Est. Slot Duration (Minutes)</label>
                    <input 
                      type="number" 
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Queue Alert Boundary (Tokens)</label>
                    <input 
                      type="number" 
                      value={notifyOnToken}
                      onChange={(e) => setNotifyOnToken(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-xs" 
                      placeholder="e.g. 2 tokens away"
                    />
                  </div>
                </div>
                <div className="p-3 bg-yellow-50/50 border border-yellow-100 text-yellow-800 rounded-xl flex items-start gap-2.5 text-[11px] font-inter leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  Altering Slot Duration directly updates patient-facing appointment estimates. E.g. placing `12` assumes a patient consultation wait decay rate of 12 mins.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold font-inter inline-flex items-center gap-2 transition-all shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving preferences...' : 'Save Settings'}
                </button>
              </div>

            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
