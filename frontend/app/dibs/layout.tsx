import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dibs — last-minute plans, picked for you',
  description: 'Connect what you love. Get tonight, tomorrow and this weekend, matched to you, at a discount.',
};

export default function DibsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
