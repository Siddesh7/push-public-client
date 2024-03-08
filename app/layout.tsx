import type {Metadata} from "next";
import {PT_Sans} from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {Providers} from "./providers";

const ptSans = PT_Sans({weight: "400", subsets: ["latin"]});
export const metadata: Metadata = {
  title: "Push Public Client",
  description: "Public Client to interact Push Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ptSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
