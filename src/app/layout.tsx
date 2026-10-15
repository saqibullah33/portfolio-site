import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Saqib Ullah — Software Engineer",
  description:
    "Software Engineer building web applications, backend systems and AI products. Organizer of developer meetups in Peshawar, Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
