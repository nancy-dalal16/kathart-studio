import "./globals.css";
import { ThemeScript } from "./theme-script";
import localFont from "next/font/local";
import { Questrial } from "next/font/google";
import AmbientMusic from "@/components/AmbientMusic";

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
  title: "Kathart Studios",
  description: "Creative marketing agency",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geologica.variable} ${questrial.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        {children}
        {/* <AmbientMusic /> */}
      </body>
    </html>
  );
}
