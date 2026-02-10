# WhichWay | Planejamento de Viagens com IA & UX Otimizada

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?style=for-the-badge&logo=playwright)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

O **WhichWay** é uma plataforma de turismo inteligente que resolve de forma estratégica o planejamento de viagens. Utilizando **IA Generativa (Google Gemini)** com saída estruturada, a aplicação converte preferências subjetivas em roteiros tangíveis, visuais e acionáveis, levando em consideração os interesses do usuário, comportamentos, budget disponível, etc.

O diferencial deste projeto não é apenas a IA, mas a toda a engenharia de front-end envolvida, garantindo uma experiência fluida e responsiva.

### 🚀 Deploy em Produção: [whichway-brown.vercel.app](https://whichway-brown.vercel.app)

---

## 🏗 Arquitetura de Frontend & Performance (UX)

Para contornar o tempo de resposta da IA e as buscas/queries constantes no banco, implementei padrões avançados de UI/UX para manter a percepção de performance alta.

### 1. Percepção de Carregamento (Skeletons & Suspense)

Em vez de bloquear a tela com _spinners_ genéricos, utilizei **React Suspense** com **Skeletons** customizados que imitam o layout final do conteúdo (Shimmer Effect). Isso reduz a carga cognitiva e sinaliza progresso visual enquanto o `Streaming SSR` do Next.js entrega os dados em pedaços (chunks), melhorando o **First Contentful Paint (FCP)**.

### 2. Optimistic UI (Interface Otimista)

Em interações críticas, como "Salvar Roteiro" ou "Favoritar Destino", a interface não espera a confirmação do banco de dados (Supabase). O estado é atualizado instantaneamente no cliente (`useOptimistic`), revertendo apenas em caso de erro. Isso cria uma sensação de aplicação "instantânea", essencial para retenção de usuários mobile.

### 3. Code Splitting & Lazy Loading

Para garantir um **Bundle Size** enxuto:

- Componentes pesados (como a biblioteca de geração de PDF `@react-pdf/renderer`) são carregados via **Dynamic Imports** (`next/dynamic`) apenas quando o usuário clica em exportar.
- Imagens e o vídeo da Hero Section utilizam estratégias de carregamento sob demanda, garantindo que o **LCP (Largest Contentful Paint)** permaneça na zona verde do Lighthouse.

---

## ⚙️ Visão de Engenharia de Backend & QA

A robustez da aplicação foi garantida através de uma infraestrutura resiliente e testes automatizados.

- - **Cron Jobs (Automação):** Configurei rotas de API com `Vercel Cron` para atualizar periodicamente a seção de "Destinos em Alta", mantendo o conteúdo da home page fresco sem intervenção manual.
- **Infraestrutura Serverless (Connection Pooling):** Para evitar _exhaustion_ de conexões no PostgreSQL em ambiente Serverless, configurei o **Supabase Transaction Pooler (PgBouncer)** na porta `6543`.
- **Streaming de Mídia (Vercel Blob):** Para contornar as restrições de _autoplay_ do iOS/Safari e economizar banda, a Hero Section utiliza streaming de vídeo via **Vercel Blob**, suportando _Byte-Range Requests_.
- **Pipeline de Testes (CI/CD):**
  - **Unitários (Vitest):** Validam regras de negócio isoladas (cálculos de orçamento, formatação de datas).
  - **End-to-End (Playwright):** Um pipeline no GitHub Actions simula um usuário real completando o fluxo do Wizard e Login, bloqueando deploys que quebrem funcionalidades críticas.

---

## 📸 Galeria da Aplicação

<table width="100%">
  <tr>
    <td width="50%">
      <p align="center"><b>Hero Section com Vídeo</b></p>
      <img src="/public/foto-readme-1.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Página de destinos em alta</b></p>
      <img src="/public/foto-readme-2.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>Login com o Clerk</b></p>
      <img src="/public/foto-readme-3.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Step Date</b></p>
      <img src="/public/foto-readme-4.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>Step Interesses</b></p>
      <img src="/public/foto-readme-5.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Step Budget</b></p>
      <img src="/public/foto-readme-6.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
    <tr>
    <td width="50%">
      <p align="center"><b>Step Viajantes</b></p>
      <img src="/public/foto-readme-7.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Step Mood</b></p>
      <img src="/public/foto-readme-8.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
    <tr>
    <td width="50%">
      <p align="center"><b>Step Summary</b></p>
      <img src="/public/foto-readme-9.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Estado de loading (Skeletons)</b></p>
      <img src="/public/foto-readme-10.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>Destinos sugeridos por IA</b></p>
      <img src="/public/foto-readme-11.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Roteiro criado pela IA</b></p>
      <img src="/public/foto-readme-12.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>PDF Roteiro após download</b></p>
      <img src="/public/foto-readme-13.png" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <p align="center"><b>Perfil do usuário, com locais visitados adicionados & wishlist</b></p>
      <img src="/public/foto-readme-14.png" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
</table>

---

## 🛠 Stack Tecnológica

| Tecnologia                  | Categoria     | Justificativa Arquitetural                                                                                 |
| :-------------------------- | :------------ | :--------------------------------------------------------------------------------------------------------- |
| **Next.js 16 (App Router)** | Framework     | Arquitetura Server-First para SEO e performance, com _Server Actions_ para mutações type-safe.             |
| **Shadcn/ui & Radix**       | UI Primitives | Componentes acessíveis (WAI-ARIA compliant) e customizáveis, garantindo propriedade total do código de UI. |
| **Zustand**                 | State         | Gerenciamento de estado global sem o boilerplate do Redux, focado em hooks simples.                        |
| **React Hook Form + Zod**   | Forms         | Validação robusta no client-side, essencial para o wizard multi-steps.                                     |
| **Prisma ORM**              | Data          | Garantia de integridade de tipos entre o banco de dados e o frontend.                                      |
| **Vercel Blob**             | CDN           | Streaming de mídia otimizado para mobile (bypass de restrições de bateria do iOS).                         |
| **Playwright**              | QA            | Testes E2E confiáveis que rodam em ambiente de CI/CD antes do deploy.                                      |

---

## 👨‍💻 Instalação Local

```bash
# Clone o repositório
git clone [https://github.com/GGhiaroni/whichway.git](https://github.com/GGhiaroni/whichway.git)

# Instale as dependências (React 19 requer legacy-peer-deps)
npm install --legacy-peer-deps

# Configure as variáveis de ambiente (.env.local)
# (Inclua suas chaves do Clerk, Supabase, Gemini e Vercel Blob)

# Sincronize o banco de dados
npx prisma db push

# Inicie o servidor
npm run dev
```
