import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/*                                Font Configuration                          */
/* -------------------------------------------------------------------------- */
const inter = Inter({ subsets: ["latin"] });

/* -------------------------------------------------------------------------- */
/*                                Metadata                                    */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Arjen Radio",
  description: "Arjen Radio | Created by Arjen",
};

/* -------------------------------------------------------------------------- */
/*                                Root Layout                                 */
/*   This component defines the global HTML structure and applies global      */
/*   styles and font settings. All application pages are rendered as children.*/
/* -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        UI Layer: 
        The body element applies the custom font and global background/text color classes.
        All page content is rendered within the body via the children prop.
      */}
      <body className={`${inter.className} bg-arjen-dark text-white`}>
        {children}
      </body>
    </html>
  );
}
