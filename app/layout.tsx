import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Calendar Breakout - Break Through Your Schedule!',
  description: 'A unique calendar-themed breakout game where you break through your Google Calendar events. Play on any device with stunning UI and smooth gameplay.',
  keywords: 'calendar game, breakout game, productivity, schedule, calendar app, web game',
  authors: [{ name: 'Calendar Breakout Team' }],
  creator: 'Calendar Breakout',
  publisher: 'Calendar Breakout',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://calendar-breakout.vercel.app'),
  openGraph: {
    title: 'Calendar Breakout - Break Through Your Schedule!',
    description: 'A unique calendar-themed breakout game where you break through your Google Calendar events.',
    url: 'https://calendar-breakout.vercel.app',
    siteName: 'Calendar Breakout',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calendar Breakout Game Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendar Breakout - Break Through Your Schedule!',
    description: 'A unique calendar-themed breakout game where you break through your Google Calendar events.',
    images: ['/og-image.png'],
    creator: '@calendarbreakout',
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
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Calendar Breakout" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
