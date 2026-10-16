import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-background">
      <Link
        href={'/profissional/home'}
        className="group flex flex-col items-center justify-center bg-primary text-xl font-semibold h-40 w-80 rounded-2xl shadow-xl  hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border border-white/10 p-6 text-center"
      >
        <span>Área do Profissional</span>
        <span className="text-xs font-normal mt-1">Acesse sua conta e gerencie</span>
      </Link>

      <Link
        href={'/'}
        className="group flex flex-col items-center justify-center bg-primary text-xl font-semibold h-40 w-80 rounded-2xl shadow-xl hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all duration-200 border border-white/10 p-6 text-center"
      >
        <span>Cliente</span>
        <span className="text-xs font-normal mt-1">Encontre profissionais e serviços</span>
      </Link>
    </main>
  );
}