import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AnalyticsSettings {
  id: string;
  facebook_pixel_id: string | null;
  ga4_measurement_id: string | null;
  is_enabled: boolean;
}

interface AnalyticsContextType {
  facebookPixelId: string;
  ga4MeasurementId: string;
  isEnabled: boolean;
  isLoading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  facebookPixelId: '',
  ga4MeasurementId: '',
  isEnabled: false,
  isLoading: true,
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery<AnalyticsSettings | null>({
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

  const value: AnalyticsContextType = {
    facebookPixelId: data?.facebook_pixel_id || '',
    ga4MeasurementId: data?.ga4_measurement_id || '',
    isEnabled: data?.is_enabled || false,
    isLoading,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
