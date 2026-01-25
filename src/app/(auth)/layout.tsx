import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
          alt="Background Viagem"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-white drop-shadow-lg">
            WhichWay
          </h1>
          <p className="mt-2 text-brand-cream font-medium">
            Seu próximo destino começa aqui.
          </p>
        </div>

        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}
