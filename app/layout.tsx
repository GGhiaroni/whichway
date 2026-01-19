import { Toaster } from "@/components/ui/sonner";
import { Baskervville } from "next/font/google";
import "./globals.css";

const baskervville = Baskervville({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-baskervville",
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${baskervville.variable} font-serif antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
