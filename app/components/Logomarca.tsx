import { Map } from "lucide-react";
import Link from "next/link";

export default function Logomarca() {
  return (
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2 hover:cursor-pointer">
        <Link href="/" className="flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
            <Map className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-brand-primary">
            WhichWay
          </span>
        </Link>
      </div>
    </div>
  );
}
