import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Halant } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const halant = Halant({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-halant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SciSpark — Never miss a breakthrough that could save lives",
  description:
    "AI-powered clinical evidence assistant. Personalized research delivered daily, AI-summarized, always grounded in source papers.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${halant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
