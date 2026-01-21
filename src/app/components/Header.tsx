import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logomarca from "./Logomarca";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-brand-primary/10 bg-brand-cream/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Logomarca />

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="font-semibold text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary cursor-pointer"
            >
              Já sou cadastrado
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="bg-brand-primary font-semibold text-white shadow-md hover:bg-brand-dark cursor-pointer">
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
                className="text-brand-primary hover:bg-brand-primary/10 hover:text-brand-dark cursor-pointer"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] bg-brand-cream border-brand-primary/20 flex flex-col"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="font-serif text-2xl text-brand-primary border-b border-brand-primary/10 pb-4">
                  WhichWay
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col items-start gap-2">
                <Link href="/sign-in" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg font-normal text-brand-dark hover:bg-brand-primary/10 hover:text-brand-primary pl-0"
                  >
                    Já sou cadastrado
                  </Button>
                </Link>

                <Link href="/sign-up" className="w-full">
                  <Button className="w-full justify-start text-lg font-semibold bg-brand-primary text-white hover:bg-brand-dark shadow-md mt-2">
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
