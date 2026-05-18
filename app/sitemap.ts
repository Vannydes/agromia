import { MetadataRoute } from 'next';

const baseUrl = 'https://agromia.vercel.app';

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },

    {
      url: `${baseUrl}/demo`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
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
}