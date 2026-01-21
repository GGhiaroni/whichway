import { Share2, Sparkles, Wallet } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Inteligência Artificial",
    description:
      "Nossos algoritmos, integrados ao Gemini, criam roteiros únicos baseados nas suas preferências reais.",
  },
  {
    icon: Wallet,
    title: "Controle de Budget",
    description:
      "Defina quanto quer gastar. O WhichWay seleciona restaurantes e passeios que cabem no seu bolso.",
  },
  {
    icon: Share2,
    title: "Compartilhe Fácil",
    description:
      "Convide amigos para editar o roteiro ou envie o PDF finalizado com um clique para o grupo da viagem.",
  },
];

export default function Features() {
  return (
    <section className="bg-brand-dark py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((f, index) => (
            <div
              key={index}
              className="hover:cursor-default flex flex-col items-center text-center p-6 rounded-2xl hover:bg-brand-cream/30 transition-colors"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/20 text-brand-cream">
                <f.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-serif text-2xl font-bold text-brand-cream">
                {f.title}
              </h3>
              <p className="text-brand-cream">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
