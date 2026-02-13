// Sitemap Generator for Vibe Holidays

export const generateSitemap = (packages: any[] = []) => {
  const baseUrl = 'https://www.vibesholidays.in';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/packages', changefreq: 'daily', priority: '0.9' },
    { url: '/gallery', changefreq: 'weekly', priority: '0.7' },
    { url: '/about', changefreq: 'monthly', priority: '0.6' },
    { url: '/contact', changefreq: 'monthly', priority: '0.8' },
  ];

  // Dynamic package pages
  const packagePages = packages.map((pkg) => ({
    url: `/packages/${pkg._id}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: pkg.updatedAt || currentDate,
  }));

  const allPages = [...staticPages, ...packagePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
};

// Function to download sitemap
export const downloadSitemap = (packages: any[]) => {
  const sitemap = generateSitemap(packages);
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
