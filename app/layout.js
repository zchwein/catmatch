import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "CatMatch - Komunitas & Matchmaking Kucing Kesayangan",
  description: "Platform pencarian pasangan terbaik untuk kucing kesayangan Anda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} font-sans bg-amber-50/40 text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

