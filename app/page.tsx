import Features from "./components/Features";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <Header />
      <main className="flex-1 pt-16">
        <Hero />

        <Features />
      </main>
      <Footer />
    </div>
  );
}
