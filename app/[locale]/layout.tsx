import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import FloatingActions from "@/components/FloatingActions";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JIRoom",
  description: "Rental Viewing Evaluator",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pb-16">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Navigation />
            <FloatingActions />
            <a
              href="https://github.com/AllardQuek/jiroom"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block fixed bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] left-4 z-40 rounded-full border border-border/40 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs leading-none text-muted-foreground/60 hover:text-muted-foreground hover:border-border/60 transition-colors"
            >
              🏡-cooked on GitHub
            </a>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
