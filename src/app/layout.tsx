import './globals.css';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export const metadata = {
  title: 'News Foot',
  description: 'Votre source d\'actualités football',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <main className="min-h-screen bg-gray-100">
            <nav className="bg-primary text-white p-4">
              <div className="container mx-auto">
                <h1 className="text-2xl font-bold">News Foot</h1>
              </div>
            </nav>
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
} 