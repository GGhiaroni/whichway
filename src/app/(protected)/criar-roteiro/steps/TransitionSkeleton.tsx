import { Skeleton } from "@/components/ui/skeleton";

export default function TransitionSkeleton() {
  return (
    <div className="fixed inset-0 z-50 bg-[#FDF8F3] animate-in fade-in duration-300">
      <div className="relative h-[45vh] md:h-[55vh] w-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute top-6 left-6 z-20">
          <Skeleton className="h-8 w-24 rounded-full bg-white/30" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
            <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
          </div>

          <Skeleton className="h-12 md:h-16 w-2/3 mb-4 bg-white/40" />

          <Skeleton className="h-8 w-64 rounded-lg bg-white/30" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 mb-8 space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 space-y-3 opacity-80">
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-dark font-medium animate-pulse">
            Construindo seu roteiro dia a dia...
          </p>
        </div>
      </div>
    </div>
  );
}
