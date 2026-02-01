import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="relative h-[40vh] w-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <Skeleton className="h-12 w-1/2 mb-4 bg-white/30" />
          <Skeleton className="h-6 w-1/3 bg-white/20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10 pb-20">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 mb-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-stone-100 rounded-2xl p-6 h-24 flex items-center gap-4"
            >
              <Skeleton className="w-12 h-12 rounded-full bg-brand-primary/10" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-brand-primary font-medium animate-pulse">
            Criando seu itinerário dia a dia...
          </p>
          <p className="text-xs text-gray-400">
            Isso pode levar alguns segundos.
          </p>
        </div>
      </div>
    </div>
  );
}
