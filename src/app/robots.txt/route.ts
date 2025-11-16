import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `# Robots.txt for Portfolio Website

User-agent: *
Allow: /

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Sitemap
Sitemap: https://your-portfolio-domain.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}