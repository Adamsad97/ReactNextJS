"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="card-title text-8xl">500</h1>
      <p className="card-description">Une erreur est survenue</p>
      <button onClick={reset} className="btn-cta">
        Réessayer
      </button>
    </div>
  );
}