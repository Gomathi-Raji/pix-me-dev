import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const runtime = 'edge'

export async function GET() {
  try {
    const fontData = await fetch(
      new URL('https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3pQP7yJ.ttf')
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            fontFamily: 'IBM Plex Mono',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              marginBottom: 40,
            }}
          >
            <span style={{ fontSize: 60, color: 'white' }}>🚀</span>
          </div>

          <h1
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            {siteConfig.profile.name}
          </h1>

          <p
            style={{
              fontSize: 30,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            AI Enthusiast • Machine Learning • Data Science
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 40,
              fontSize: 24,
              color: '#64748b',
            }}
          >
            <span>your-portfolio-domain.com</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'IBM Plex Mono',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e) {
    console.log(`${e}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}