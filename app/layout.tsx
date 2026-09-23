import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Insights360 — Race to Recognition Dashboard",
  description: "Consolidated ALC performance dashboard across Index 1-4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">{children}</div>

      </body>
    </html>
  );
}
