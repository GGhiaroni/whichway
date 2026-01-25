import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          footer: "hidden",
          card: "bg-white/95 border border-white/20 shadow-2xl rounded-3xl",
          formButtonPrimary:
            "bg-brand-primary hover:bg-brand-dark text-white text-sm normal-case",
          formFieldInput:
            "rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20",
        },
        variables: {
          colorPrimary: "#E11D48",
          borderRadius: "1rem",
        },
      }}
    />
  );
}
