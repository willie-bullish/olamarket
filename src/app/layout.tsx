import type { Metadata } from "next";
import "./globals.css";
import { initializeTable } from "@/lib/store";

// Initialize database tables on server startup
initializeTable().catch((error: unknown) => {
  console.error('Failed to initialize database tables on startup:', error);
});

export const metadata: Metadata = {
  title: "IFSA Investment",
  description: "Build wealth through smart investments",
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