import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/contexts/AnalyticsContext';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackFbEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params || {});
  }
};

export const trackGaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params || {});
  }
};

const AnalyticsScripts = () => {
  const { facebookPixelId, ga4MeasurementId, isEnabled } = useAnalytics();

  const hasFbPixel = isEnabled && !!facebookPixelId;
  const hasGa4 = isEnabled && !!ga4MeasurementId;

  // GA4 outbound link tracking
  useEffect(() => {
    if (!hasGa4) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Check if it's an external link
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        trackGaEvent('outbound_link_click', {
          link_url: href,
          link_text: anchor.textContent?.trim() || '',
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [hasGa4]);

  if (!isEnabled) return null;

  return (
    <Helmet>
      {/* Facebook Pixel */}
      {hasFbPixel && (
        <>
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </script>
          <noscript>
            {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1"/>`}
          </noscript>
        </>
      )}

      {/* Google Analytics GA4 */}
      {hasGa4 && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4MeasurementId}');
            `}
          </script>
        </>
      )}
    </Helmet>
  );
};

export default AnalyticsScripts;
