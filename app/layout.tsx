import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import ThemeCord from "@/components/feral/ThemeCord";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SiteNav from "@/components/sections/SiteNav";
import "./globals.css";

/*
 * Typography: Grenette (display serif) + Styrene (body sans) are commercial fonts.
 * Free stand-ins are wired under the same CSS variables; to switch to the licensed
 * files, replace these two with next/font/local using the same `variable` names.
 */
const grenette = Newsreader({
  variable: "--font-grenette",
  subsets: ["latin"],
  axes: ["opsz"],
});

const styrene = Hanken_Grotesk({
  variable: "--font-styrene",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yopersh — Shop the world, delivered home",
  description:
    "Concept redesign: a personal shopper for Shein, Temu, Amazon & more — purchased, consolidated in Dubai, and delivered to your door in Uganda & Kenya, with live tracking.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${grenette.variable} ${styrene.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <MotionProvider>
            <SiteNav />
            {children}
            <ThemeCord />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
