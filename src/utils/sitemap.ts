import { supabase } from '@/lib/supabase';

const EDGE_FUNCTION_URL = 'https://clpbflxkbaqcimrrbqkw.supabase.co/functions/v1/regenerate-sitemap';

export interface SitemapResult {
  success: boolean;
  message: string;
  urlCount?: number;
  publicUrl?: string;
  error?: string;
}

export const regenerateSitemap = async (): Promise<SitemapResult> => {
  const { data, error } = await supabase.functions.invoke('regenerate-sitemap', {
    method: 'POST',
  });

  if (error) {
    return {
      success: false,
      message: 'Failed to regenerate sitemap',
      error: error.message,
    };
  }

  return data as SitemapResult;
};