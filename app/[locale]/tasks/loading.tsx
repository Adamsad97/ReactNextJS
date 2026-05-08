export default function Loading() {
	return (
		<section className="card card-loading">
			<div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
				<span className="h-3 w-3 animate-pulse rounded-full bg-zinc-950 dark:bg-white" />
				Chargement des tâches...
			</div>
		</section>
	);
}
