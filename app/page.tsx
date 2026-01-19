export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-serif text-5xl font-bold text-brand-primary">
        WhichWay?
      </h1>
      <p className="text-xl text-brand-dark">Sua jornada começa aqui.</p>
      <button className="rounded bg-brand-primary px-4 py-2 text-white hover:bg-brand-dark">
        Começar
      </button>
    </div>
  );
}
