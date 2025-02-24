import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import ClientLayout from "./client-layout";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2E7D32" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
