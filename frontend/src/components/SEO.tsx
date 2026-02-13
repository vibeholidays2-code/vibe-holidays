import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

const SEO = ({
  title = 'Vibe Holidays - Best Travel Packages & Holiday Tours',
  description = 'Discover amazing travel packages with Vibe Holidays. Book affordable tours to Bali, Vietnam, Goa, Jaisalmer, and more. Best prices guaranteed!',
  keywords = 'travel packages, holiday tours, Bali packages, Vietnam tours, Goa holidays, Jaisalmer desert safari',
  image = 'https://www.vibesholidays.in/og-image.jpg',
  url = 'https://www.vibesholidays.in/',
  type = 'website',
  schema,
}: SEOProps) => {
  const fullTitle = title.includes('Vibe Holidays') ? title : `${title} | Vibe Holidays`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
