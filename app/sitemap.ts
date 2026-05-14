import type { MetadataRoute } from 'next';

const baseUrl = 'https://agromia.vercel.app';

const now = new Date();

const pages: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${baseUrl}/login`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/register`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/add-crop`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  },
  {
    url: `${baseUrl}/privacy-policy`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/terms-of-service`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages;
}
