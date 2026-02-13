// Structured Data (Schema.org) for SEO

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Vibe Holidays',
  description: 'Leading travel agency offering customized holiday packages and tours',
  url: 'https://vibe-holidays-red.vercel.app',
  logo: 'https://vibe-holidays-red.vercel.app/logo.png',
  image: 'https://vibe-holidays-red.vercel.app/og-image.jpg',
  telephone: '+91-7048505128',
  email: 'vibesholidays.9@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'E-block, 510, PNTC, 5, Times Of India Press Rd, Mahakali Society',
    addressLocality: 'Vejalpur, Ahmedabad',
    addressRegion: 'Gujarat',
    postalCode: '380015',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.0225',
    longitude: '72.5714',
  },
  sameAs: [
    'https://www.facebook.com/vibeholidays',
    'https://www.instagram.com/vibeholidays',
    'https://twitter.com/vibeholidays',
  ],
  priceRange: '₹₹',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vibe Holidays',
  url: 'https://vibe-holidays-red.vercel.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://vibe-holidays-red.vercel.app/packages?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Package/Tour Schema Generator
export const generateTourPackageSchema = (packageData: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: packageData.name,
    description: packageData.description,
    image: packageData.thumbnail || packageData.images?.[0],
    touristType: packageData.category || 'Leisure',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: packageData.duration?.split(' ')[0] || 0,
      itemListElement: packageData.itinerary?.map((day: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: day.title,
        description: day.description,
      })) || [],
    },
    offers: {
      '@type': 'Offer',
      price: packageData.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      url: `https://vibe-holidays-red.vercel.app/packages/${packageData._id}`,
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Vibe Holidays',
      telephone: '+91-7048505128',
      email: 'vibesholidays.9@gmail.com',
    },
  };
};

// Breadcrumb Schema Generator
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

// FAQ Schema Generator
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

// Review Schema Generator
export const generateReviewSchema = (reviews: any[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vibe Holidays',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: reviews.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };
};
