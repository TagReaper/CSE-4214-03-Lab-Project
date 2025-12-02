import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from '@/components/navbar/navbarwrapper';
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThriftU",
  description: "University thrifting by you, for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
        </style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: 'bg-green-50 text-green-900 border-green-200',
              error: 'bg-red-50 text-red-900 border-red-200',
            },
          }}
        />
        <div className="relative w-full">
          <NavbarWrapper />
        </div>
        <div>
          {""}
        </div>
        {children}
      </body>
    </html>
  );
}