import Footer from "@/components/Footer";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ChatComponent from "@/components/ChatComponent";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
