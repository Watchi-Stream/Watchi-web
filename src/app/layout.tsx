import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Watchi - Anime Streaming Platform",
  description: "Watch anime online for free with Watchi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`} style={{ backgroundColor: "#0d0d0d", color: "#ffffff" }}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {children}
            <footer className="bg-black border-t border-gray-800 py-6" style={{ backgroundColor: "#000000", borderTopWidth: "1px", borderColor: "#1f2937", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
              <div className="px-6 text-center text-white/60" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", textAlign: "center", color: "rgba(255, 255, 255, 0.6)" }}>
                <p>© {new Date().getFullYear()} Watchi. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
