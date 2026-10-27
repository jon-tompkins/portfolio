import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Dibs — last-minute plans, picked for you',
  description: 'Connect what you love. Get tonight, tomorrow and this weekend, matched to you, at a discount.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0f0e17' };

export default function DibsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
