import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="card-title text-8xl">404</h1>
      <p className="card-description">Page introuvable</p>
      <Link href="/fr" className="btn-cta">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}