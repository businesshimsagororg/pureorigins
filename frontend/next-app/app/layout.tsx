import "./globals.css";

export const metadata = {
  title: "PureOrigins",
  description: "Premium health seeds & superfoods",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
