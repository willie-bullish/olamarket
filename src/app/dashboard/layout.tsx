import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dashboard | IFSA Investment",
  description: "Choose your investment options",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}