import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logomarca from "./Logomarca";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-brand-primary/10 bg-brand-cream/80 backdrop-blur-md">
      <div className="flex justify-around px-6">
        <Logomarca />

        <nav className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="hover:cursor-pointer font-semibold text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              Já sou cadastrado
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="font-semibold hover:cursor-pointer bg-brand-primary text-white hover:bg-brand-dark shadow-md">
              Criar conta grátis
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
