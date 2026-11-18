import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Footer from "@/components/shared/Footer/Footer";
import SessionProviderWrap from "@/components/Providers/SessionProvider";
import ToastsProvider from "@/components/Providers/ToastsProvider";
import MarketProvider from "@/components/Providers/MarketProvider";
import SmoothScroll from "@/components/shared/SmoothScroll/SmoothScroll";
import ScrollToTop from "@/components/shared/ScrollToTop/ScrollToTop";
import ScrollProgress from "@/components/shared/ScrollProgress/ScrollProgress";
import PlausibleProvider from "next-plausible";
import { SITE } from "@/config/site";
import { buildBusinessSchema } from "@/lib/schema";
import { getCompanySettings } from "../../actions/admin/companySettings";
import { getMarket } from "@/lib/market";
import { getBrand } from "@/lib/brand";
import BrandProvider from "@/components/Providers/BrandProvider";

const SofiaSansExtraCondensedBold = localFont({
  src: "../../public/fonts/SofiaSansExtraCondensed-Bold.ttf",
  variable: "--SofiaSansExtraCondensedBold",
  display: "swap",
});

const SofiaSansExtraCondensedExtraBold = localFont({
  src: "../../public/fonts/SofiaSansExtraCondensed-ExtraBold.ttf",
  variable: "--SofiaSansExtraCondensedExtraBold",
  display: "swap",
});

const SofiaSansRegular = localFont({
  src: "../../public/fonts/SofiaSans-Regular.ttf",
  variable: "--SofiaSansRegular",
  display: "swap",
});

const SofiaSansLight = localFont({
  src: "../../public/fonts/SofiaSans-Light.ttf",
  variable: "--SofiaSansLight",
  display: "swap",
});

const SofiaSansBold = localFont({
  src: "../../public/fonts/SofiaSans-Bold.ttf",
  variable: "--SofiaSansBold",
  display: "swap",
});

// The name is the operator's (Admin → Company Settings) and the tagline
// and description are the market's, so a demo's tab and link previews show
// the prospect's business in their city.
export async function generateMetadata(): Promise<Metadata> {
  const [brand, market] = await Promise.all([getBrand(), getMarket()]);
  const tagline = `Black Car Service in ${market.city}`;
  const description = market.copy.hero.subhead;
  return {
    title: {
      default: `${brand.name} | ${tagline}`,
      template: `%s | ${brand.name}`,
    },
    description,
    openGraph: {
      title: `${brand.name} | ${tagline}`,
      description,
      url: SITE.url,
      siteName: brand.name,
      type: "website",
      images: [
        {
          url: `${SITE.url}${SITE.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${brand.name} — ${tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} | ${tagline}`,
      description,
      images: [`${SITE.url}${SITE.ogImage}`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Same settings the footer reads; its profile URLs feed `sameAs`/`hasMap`.
  // If the database can't be reached, the schema falls back to site config.
  const settings = await getCompanySettings().catch(() => ({}));
  const businessSchema = buildBusinessSchema(settings);
  const [market, brand] = await Promise.all([getMarket(), getBrand()]);

  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://plausible.io' />
        <link
          rel='preconnect'
          href='https://res.cloudinary.com'
          crossOrigin='anonymous'
        />

        {/* ── PWA ── */}
        <meta name='theme-color' content={SITE.themeColor} />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content={brand.name} />
        {/* Icons: src/app/favicon.ico, icon.svg and apple-icon.png. */}
      </head>
      <body
        className={`${SofiaSansExtraCondensedBold.variable} ${SofiaSansRegular.variable} ${SofiaSansLight.variable} ${SofiaSansBold.variable} ${SofiaSansExtraCondensedExtraBold.variable}`}
      >
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />
        <PlausibleProvider
          domain={SITE.domain}
          trackLocalhost={false}
          enabled={true}
        >
          <SessionProviderWrap>
            <MarketProvider market={market}>
              <BrandProvider brand={brand}>
                <ToastsProvider />
                <SmoothScroll>
                  <ScrollToTop />
                  {children}
                  <Footer />
                  {/* How far down the page you are, bottom right (public pages). */}
                  <ScrollProgress />
                </SmoothScroll>
              </BrandProvider>
            </MarketProvider>
          </SessionProviderWrap>
        </PlausibleProvider>
      </body>
    </html>
  );
}
