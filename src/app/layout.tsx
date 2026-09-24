import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "../components/navigation/Footer";
import { Navbar } from "../components/navigation/Navbar";
import { FeedbackWidget } from "../components/feedback/FeedbackWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Turn | İhtiyacını söyle, teklifler sana gelsin",
  description: "Aradığını aramak yerine ihtiyacını anlat, sana gelen teklifleri karşılaştır.",
  icons: {
    icon: "/logo2.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900"><Navbar /><div className="app-content">{children}</div><Footer /><FeedbackWidget /></body>
    </html>
  );
}
