import Footer from "@/components/Footer";
import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <NavBar />
        <div className="mt-18">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
