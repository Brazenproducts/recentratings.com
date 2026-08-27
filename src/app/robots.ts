import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/verify'],
      },
    ],
    sitemap: 'https://recentratings.com/sitemap.xml',
    host: 'https://recentratings.com',
  }
}
