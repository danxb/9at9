import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '9x9.news - Nine news stories at nine o’clock',
  description:
    '9x9.news is a free text-only news site with nine short summaries, plus weather and films, updated daily at 9am.',
  alternates: {
    canonical: 'https://9x9.news/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light">
        {children}
      </body>
    </html>
  );
}
