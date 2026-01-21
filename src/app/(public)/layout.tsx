import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
    </div>
  );
}
