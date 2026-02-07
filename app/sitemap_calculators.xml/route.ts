import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { baseUrl } from '@/service/config';

const appDirectory = path.join(process.cwd(), './app/(withLayout)/calculator');

function getStaticPages(directory: string) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const paths: string[] = [];
  entries.forEach((entry) => {
    if (entry.name.startsWith('layout') || entry.name.startsWith('calculator'))
      return;
    const relativePath = entry.name.replace('page.jsx', '');
    const formattedPath = relativePath === '' ? '/' : '/' + relativePath;

    paths.push(formattedPath);
  });

  return paths;
}

export async function GET() {
  const staticPages = getStaticPages(appDirectory);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((url) => {
        return `
        <url>
          <loc>${baseUrl}/calculator${url}/</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>`;
      })
      .join('')}
       <url>
          <loc>${baseUrl}/sitemap_index.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>
  </urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
