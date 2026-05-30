import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "PureOrigins - প্রিমিয়াম হেলথ সিড ও সুপারফুড | বাংলাদেশ",
    template: "%s | PureOrigins"
  },
  description:
    "বাংলাদেশের সেরা অর্গানিক সুপারফুড ও হেলথ সিড শপ। কালোজিরা, চিয়া সিড, মরিঙ্গা পাউডার ও আরও পণ্য হোম ডেলিভারিতে পান। COD সুবিধা।",
  openGraph: {
    title: "PureOrigins - প্রিমিয়াম হেলথ সিড ও সুপারফুড",
    description:
      "কালোজিরা, চিয়া সিড, মরিঙ্গা পাউডার ও খাঁটি মধু — সারাদেশে হোম ডেলিভারি ও COD সুবিধা।",
    locale: "bn_BD",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className={hindSiliguri.variable}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
