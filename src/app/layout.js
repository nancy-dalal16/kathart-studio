import "./globals.css";
import localFont from "next/font/local";
import { Questrial } from "next/font/google";
import { draftMode } from "next/headers";
import AmbientMusic from "@/components/AmbientMusic";
import ConditionalLayout from "@/components/ConditionalLayout";
import HomeLoader from "@/components/HomeLoader";
import ThemeScript from "@/components/ThemeScript";
import GlowCursorWrapper from "@/components/atmosphere/GlowCursorWrapper";
import VisualEditingOverlay from "@/components/VisualEditingOverlay";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
  display: "swap",
});

// Load Geologica font from local files
const geologica = localFont({
  src: [
    {
      path: "../../public/fonts/geologica/Geologica-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/geologica/Geologica-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geologica",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Kathart Studios",
    template: "%s | Kathart Studios",
  },
  description:
    "Kathart Studios is an end-to-end creative agency specialising in brand design, UI/UX, web development, and video production.",
  keywords: [
    "creative agency",
    "branding",
    "UI/UX design",
    "web development",
    "video production",
    "marketing agency",
    "Kathart Studios",
  ],
  authors: [{ name: "Kathart Studios" }],
  creator: "Kathart Studios",
  publisher: "Kathart Studios",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Kathart Studios",
    title: "Kathart Studios",
    description: "An end-to-end creative agency for brands that demand more.",
    images: [
      {
        url: "/images/Kathart_logo-light.svg",
        width: 1200,
        height: 630,
        alt: "Kathart Studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kathart Studios",
    description: "An end-to-end creative agency for brands that demand more.",
    images: ["/images/Kathart_logo-light.svg"],
  },
  icons: {
    icon: "/images/Kathart_logo-light.svg",
  },
};

export default async function RootLayout({ children }) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geologica.variable} ${questrial.variable}`}
    >
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeScript />
        <HomeLoader />
        <GlowCursorWrapper />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        {isDraft && <VisualEditingOverlay />}
      </body>
    </html>
  );
}
