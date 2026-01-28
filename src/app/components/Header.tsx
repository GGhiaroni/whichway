"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logomarca from "./Logomarca";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full bg-brand-cream backdrop-blur-md border-b border-stone-100 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <Logomarca />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/em-alta"
            className={`text-sm font-medium transition-colors hover:text-brand-primary ${isActive("/em-alta") ? "text-brand-primary" : "text-gray-600"}`}
          >
            Em Alta
          </Link>
          <Link
            href="/criar-roteiro"
            className={`text-sm font-medium transition-colors hover:text-brand-primary ${isActive("/criar-roteiro") ? "text-brand-primary" : "text-gray-600"}`}
          >
            Criar Roteiro
          </Link>
          <Link
            href="/comunidade"
            className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
          >
            Comunidade
          </Link>
        </nav>

        <div className="flex-1 flex justify-end items-center gap-4">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="w-9 h-9 border border-gray-200 transition-all hover:ring-2 hover:ring-brand-primary/20">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || "User"}
                    />
                    <AvatarFallback className="bg-brand-primary text-white">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 p-2 bg-white rounded-xl shadow-xl border-stone-100"
              >
                <div className="px-2 py-1.5 mb-1">
                  <p className="font-bold text-sm text-brand-dark">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/meu-perfil"
                    className="cursor-pointer w-full flex items-center rounded-lg focus:bg-stone-50 text-gray-600 focus:text-brand-primary py-2"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/criar-roteiro"
                    className="cursor-pointer w-full flex items-center rounded-lg focus:bg-stone-50 text-gray-600 focus:text-brand-primary py-2"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Novo Roteiro
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="cursor-pointer rounded-lg focus:bg-red-50 text-red-500 focus:text-red-600 py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-bold text-brand-primary hover:text-brand-dark md:block"
              >
                Entrar
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full bg-brand-primary hover:bg-brand-dark text-white shadow-lg shadow-brand-primary/20 px-6">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
