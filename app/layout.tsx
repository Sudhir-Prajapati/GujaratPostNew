import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://gujaratpost.example.com"),
  manifest: "/manifest.json",
  title: {
    default: "Gujarat Post - Gujarati News Portal",
    template: "%s | Gujarat Post",
  },
  description: "Premium Gujarati news portal demo for breaking news, politics, crime, business, sports, videos and photo stories.",
  keywords: ["Gujarat news", "Gujarati news", "Gujarat Post", "Breaking news Gujarat", "Gujarat politics"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gujarat Post",
    description: "Latest Gujarati breaking news, politics, business, sports and entertainment.",
    url: "/",
    siteName: "Gujarat Post",
    locale: "gu_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gujarat Post",
    description: "Latest Gujarati breaking news.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Vadodara:wght@300;400;500;600;700;800&family=Mukta:wght@400;500;600;700;800;900&family=Mukta+Vaani:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800;900&family=Baloo+Bhai+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'gu',
                  includedLanguages: 'gu,en,hi',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            }
          `}
        </Script>
      </head>
      <body className="antialiased">
        <div id="google_translate_element" style={{ display: 'none' }} />
        <AppProvider>
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </AppProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}

