import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Save, Phone, Mail, MapPin, Facebook, Instagram, Clock, Building2 } from 'lucide-react';

const defaultHours = {
  monday: { open: '07:00', close: '17:00', closed: false },
  tuesday: { open: '07:00', close: '17:00', closed: false },
  wednesday: { open: '07:00', close: '17:00', closed: false },
  thursday: { open: '07:00', close: '17:00', closed: false },
  friday: { open: '07:00', close: '17:00', closed: false },
  saturday: { open: '07:00', close: '12:00', closed: false },
  sunday: { open: '00:00', close: '00:00', closed: true },
};

const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const BusinessDetails = () => {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    tagline: '',
    phone: '',
    email: '',
    whatsapp: '',
    service_area: '',
    facebook_url: '',
    instagram_url: '',
    logo_url: '',
  });
  const [hours, setHours] = useState(defaultHours);

  const { data: details, isLoading } = useQuery({
    queryKey: ['business-details'],
    queryFn: async () => {
      const { data } = await supabase.from('business_details').select('*').limit(1).single();
      return data;
    },
  });

  useEffect(() => {
    if (details) {
      setFormData({
        company_name: details.company_name || '',
        tagline: details.tagline || '',
        phone: details.phone || '',
        email: details.email || '',
        whatsapp: details.whatsapp || '',
        service_area: details.service_area || '',
        facebook_url: details.facebook_url || '',
        instagram_url: details.instagram_url || '',
        logo_url: details.logo_url || '',
      });
      if (details.business_hours) {
        setHours({ ...defaultHours, ...details.business_hours });
      }
    }
  }, [details]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...formData, business_hours: hours, updated_at: new Date().toISOString() };
      if (details?.id) {
        await supabase.from('business_details').update(payload).eq('id', details.id);
      } else {
        await supabase.from('business_details').insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-details'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHourChange = (day: string, field: string, value: string | boolean) => {
    setHours({
      ...hours,
      [day]: { ...hours[day as keyof typeof hours], [field]: value },
    });
  };

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
          Business details saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Building2 size={20} className="text-[#C05A1E]" />
              <span>Company Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input name="company_name" value={formData.company_name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input name="tagline" value={formData.tagline} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                <input name="service_area" value={formData.service_area} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input name="logo_url" value={formData.logo_url} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Phone size={20} className="text-[#C05A1E]" />
              <span>Contact Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Facebook size={20} className="text-[#C05A1E]" />
              <span>Social Media</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input name="facebook_url" value={formData.facebook_url} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input name="instagram_url" value={formData.instagram_url} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Clock size={20} className="text-[#C05A1E]" />
              <span>Business Hours</span>
            </h2>
            <div className="space-y-3">
              {Object.keys(hours).map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <span className="w-24 text-sm font-medium text-gray-700">{dayLabels[day]}</span>
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="checkbox"
                      checked={!hours[day as keyof typeof hours].closed}
                      onChange={(e) => handleHourChange(day, 'closed', !e.target.checked)}
                      className="rounded border-gray-300 text-[#C05A1E] focus:ring-[#C05A1E]"
                    />
                    <span className="text-gray-500">Open</span>
                  </label>
                  {!hours[day as keyof typeof hours].closed && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours[day as keyof typeof hours].open}
                        onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="time"
                        value={hours[day as keyof typeof hours].close}
                        onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Save size={18} />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {formData.logo_url && <img src={formData.logo_url} alt="Logo" className="h-10 w-auto" />}
                <div>
                  <p className="font-bold text-[#2A3A4A]">{formData.company_name || 'Company Name'}</p>
                  <p className="text-xs text-[#C05A1E]">{formData.tagline || 'Tagline'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={14} className="text-[#C05A1E]" />
                  <span>{formData.phone || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={14} className="text-[#C05A1E]" />
                  <span>{formData.email || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={14} className="text-[#C05A1E]" />
                  <span>{formData.service_area || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
