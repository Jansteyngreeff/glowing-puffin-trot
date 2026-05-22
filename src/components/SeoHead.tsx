import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  pageSlug: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const SeoHead = ({ pageSlug, fallbackTitle, fallbackDescription }: SeoHeadProps) => {
  // This component will be used with react-helmet-async
  // The actual SEO data is fetched at the page level and passed here
  return null;
};

export default SeoHead;
