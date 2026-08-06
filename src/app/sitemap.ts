import { MetadataRoute } from 'next';
import { query } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fuurstudio.com'; // Change to actual production URL

  // Fetch blogs to add to sitemap dynamically if we have dynamic routes in the future
  // For now, since it's a single page app, we just map the index.
  // const blogs = await query('SELECT id, date FROM blogs');
  // const blogRoutes = blogs.map((blog: any) => ({
  //   url: `${baseUrl}/blog/${blog.id}`,
  //   lastModified: new Date(blog.date),
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // ...blogRoutes
  ];
}
