import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      {/* 1. Header Fixo no topo */}
      <Header />

      <main className="flex-1 pt-16"></main>
    </div>
  );
}
