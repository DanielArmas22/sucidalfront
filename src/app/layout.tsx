import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bienestar Estudiantil - Sistema de Apoyo Universitario",
  description:
    "Plataforma segura de apoyo y bienestar para estudiantes universitarios",
  keywords: [
    "bienestar estudiantil",
    "apoyo universitario",
    "salud mental",
    "estudiantes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <AuthProvider>
          <AuthGuard>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
