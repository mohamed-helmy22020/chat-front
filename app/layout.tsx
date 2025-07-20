import Navbar from "@/components/Navbar";
import { getUserData } from "@/lib/actions/user.actions";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter, Lora } from "next/font/google";
import { getLangDir } from "rtl-detect";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["sans-serif"],
});
const loraFont = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const direction = getLangDir(locale);
  const getUserRes = await getUserData();
  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className="h-fit"
    >
      <body
        className={`${interFont.variable} ${loraFont.variable} h-full bg-site-background font-inter antialiased transition-all`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {!getUserRes.success && <Navbar />}
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
