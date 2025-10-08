import Footer from "@/components/Footer";

export default function ChefPersonalPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}
      <Footer />
    </section>
  );
}
