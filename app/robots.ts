import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        disallow: ['/nogooglebot/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/calculator/*/calculator',
          '/*/zlib',
          '/*/lib',
          '/*/utils',
          '/*/common',
          '/*/adler32',
          '/*/inffast',
          '/*/inftrees',
          '/*/crc32',
          '/404',
        ],
      },
    ],
    sitemap: 'https://doubtlet.com/sitemap_index.xml',
  };
}
