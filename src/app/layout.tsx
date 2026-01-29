import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// =============================================================================
// FONTS — Gallery Aesthetic Typography
// - Display: Cormorant Garamond (elegant, warm)
// - Body: Inter (clean, invisible)
// - Data: JetBrains Mono (technical)
// =============================================================================

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// =============================================================================
// METADATA — The Morocco Oracle
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'The Morocco Oracle',
    template: '%s | The Morocco Oracle',
  },
  description:
    'Investment intelligence for Morocco 2030. Infrastructure mapping, development tracking, and market signals.',
  keywords: [
    'Morocco investment',
    'World Cup 2030',
    'Morocco infrastructure',
    'real estate intelligence',
    'development tracker',
    'TGV Morocco',
    'Morocco stadiums',
  ],
  authors: [{ name: 'The Damn Penguin', url: 'https://thedamnpenguin.com' }],
  creator: 'The Damn Penguin',
  publisher: 'The Damn Penguin',
  manifest: '/manifest.json',
  applicationName: 'Morocco Oracle',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Oracle',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR'],
    siteName: 'The Morocco Oracle',
    title: 'The Morocco Oracle — National Investment Intelligence',
    description:
      'Investment intelligence for Morocco 2030. Infrastructure, developments, and market signals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Morocco Oracle — Investment Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Morocco Oracle',
    description: 'National Investment Intelligence for Morocco 2030',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="preconnect" href="https://supabase.co" />
      </head>
      <body 
        className="min-h-screen antialiased bg-white text-black"
      >
        {/* Skip to main content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:outline-none"
          style={{ backgroundColor: 'var(--charcoal)', color: 'var(--paper)' }}
        >
          Skip to main content
        </a>

        {/* Main application */}
        <main id="main-content" className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
