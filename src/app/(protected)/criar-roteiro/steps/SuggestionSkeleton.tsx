import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export default function SuggestionSkeleton() {
  return (
    <div className="pt-2 animate-in fade-in duration-500">
      <div className="text-center mb-6 space-y-2">
        <Skeleton className="h-8 w-64 mx-auto bg-brand-primary/10" />
        <Skeleton className="h-4 w-48 mx-auto bg-white/20" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 md:h-40 w-full rounded-2xl bg-black/10 animate-pulse border-2 border-transparent relative overflow-hidden"
          >
            <div className="absolute bottom-4 left-4 space-y-2 w-full">
              <Skeleton className="h-6 w-1/2 bg-white/30" />
              <Skeleton className="h-4 w-3/4 bg-white/20" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center text-brand-cream text-sm animate-pulse flex-col items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin" />
        <p>Consultando nossa base de destinos...</p>
      </div>
    </div>
  );
}
