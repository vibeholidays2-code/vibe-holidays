import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

const SEO = ({
  title = 'Vibes Holidays - Travel & Holiday Booking',
  description = 'Discover unforgettable travel experiences with Vibes Holidays. Browse our curated holiday packages, explore exotic destinations, and book your dream vacation today.',
  keywords = 'travel, holidays, vacation packages, holiday booking, travel agency, tours, destinations, adventure travel',
  image = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
  url = 'https://vibeholidays.com',
  type = 'website',
  structuredData,
}: SEOProps) => {
  const fullTitle = title.includes('Vibes Holidays') ? title : `${title} | Vibes Holidays`;
  const canonicalUrl = url.startsWith('http') ? url : `https://vibeholidays.com${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags for Social Sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Vibes Holidays" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Vibes Holidays" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
