import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function ChefPersonalPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <NavBar />
      <div className="mt-18">{children}</div>
      <Footer />
    </section>
  );
}
