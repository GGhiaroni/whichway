import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logomarca from "./Logomarca";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-brand-primary/10 bg-brand-cream/80 backdrop-blur-md">
      <div className="flex justify-between mx-4">
        <Logomarca />

        <nav className="hidden md:flex items-center gap-4">
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

        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-primary hover:bg-brand-primary/10 hover:text-brand-dark"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-brand-cream border-brand-primary/20"
            >
              <SheetHeader>
                <SheetTitle className="font-serif text-brand-dark text-left">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col items-center gap-4">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-lg font-semibold text-brand-dark hover:bg-brand-primary/10"
                  >
                    Já sou cadastrado
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button className="text-lg font-semibold bg-brand-primary text-white hover:bg-brand-dark shadow-md">
                    Criar conta grátis
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
