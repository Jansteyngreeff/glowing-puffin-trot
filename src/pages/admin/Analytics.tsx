import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Save, BarChart3, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Analytics = () => {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [facebookPixelId, setFacebookPixelId] = useState('');
  const [ga4MeasurementId, setGa4MeasurementId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['analytics-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_settings')
        .select('*')
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setFacebookPixelId(settings.facebook_pixel_id || '');
      setGa4MeasurementId(settings.ga4_measurement_id || '');
      setIsEnabled(settings.is_enabled || false);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        facebook_pixel_id: facebookPixelId || null,
        ga4_measurement_id: ga4MeasurementId || null,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
      };

      if (settings?.id) {
        await supabase.from('analytics_settings').update(payload).eq('id', settings.id);
      } else {
        const { data } = await supabase.from('analytics_settings').insert(payload).select().single();
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const isActive = isEnabled && (!!facebookPixelId || !!ga4MeasurementId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C05A1E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          Analytics settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Master Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#2A3A4A]">Tracking Status</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enable or disable all tracking scripts at once
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-[#C05A1E]"
                />
              </div>
            </div>
          </div>

          {/* Facebook Pixel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <BarChart3 size={20} className="text-[#C05A1E]" />
              <span>Facebook Pixel</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Pixel ID
                </label>
                <input
                  value={facebookPixelId}
                  onChange={(e) => setFacebookPixelId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="e.g. 123456789012345"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Find your Pixel ID in{' '}
                  <a
                    href="https://business.facebook.com/events_manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C05A1E] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Meta Events Manager</span>
                    <ExternalLink size={10} />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Google Analytics GA4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <BarChart3 size={20} className="text-[#C05A1E]" />
              <span>Google Analytics 4</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GA4 Measurement ID
                </label>
                <input
                  value={ga4MeasurementId}
                  onChange={(e) => setGa4MeasurementId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="e.g. G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Find your Measurement ID in{' '}
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C05A1E] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Google Analytics Admin</span>
                    <ExternalLink size={10} />
                  </a>{' '}
                  → Data Streams → Web
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Save size={18} />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save Analytics Settings'}</span>
          </button>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tracking</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Facebook Pixel</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isEnabled && facebookPixelId
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isEnabled && facebookPixelId ? 'Loaded' : 'Off'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Google Analytics</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isEnabled && ga4MeasurementId
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isEnabled && ga4MeasurementId ? 'Loaded' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Tracked Events
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Page views (all pages)</p>
              <p>• Contact form submitted</p>
              <p>• WhatsApp button clicked</p>
              <p>• Quote requested</p>
              <p>• Outbound link clicks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
