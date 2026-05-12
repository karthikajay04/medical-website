import { Settings as SettingsIcon, Bell, Shield, Database, Palette } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your clinic preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Clinic Profile', description: 'Update your clinic name, address and contact info.', icon: Database },
          { title: 'Notifications', description: 'Configure email and SMS alerts for patients.', icon: Bell },
          { title: 'Security', description: 'Manage admin passwords and access roles.', icon: Shield },
          { title: 'Appearance', description: 'Customize the look of your booking page.', icon: Palette },
        ].map((item) => (
          <div key={item.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
