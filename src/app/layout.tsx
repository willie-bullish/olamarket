import type { Metadata } from "next";
import "./globals.css";
import { initializeTable } from "@/lib/store";

// Initialize database tables on server startup
initializeTable().catch((error: unknown) => {
  console.error('Failed to initialize database tables on startup:', error);
});

export const metadata: Metadata = {
  title: "Amira Gold Store",
  description: "Build wealth through smart investments in gold",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}