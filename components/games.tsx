import Image from "next/image";
import type { Game } from "@/lib/games";
export function StatusBadge({ status }: { status: Game["status"] }) {
  return (
    <span className={`status ${status}`}>
      <span aria-hidden="true" />
      {status === "available" ? "Available" : "Coming soon"}
    </span>
  );
}
export function GameCard({ game }: { game: Game }) {
  return (
    <article className="game-card">
      <div className="game-art">
        <Image
          src={game.cover}
          alt={game.coverAlt}
          fill
          sizes="(max-width: 760px) 100vw, 58vw"
          priority
        />
      </div>
      <div className="game-details">
        <div className="game-topline">
          <span className="eyebrow">{game.genre}</span>
          <StatusBadge status={game.status} />
        </div>
        <div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
        </div>
        <div className="game-meta">
          <span>Browser based</span>
          <span>No download</span>
        </div>
        {game.status === "available" ? (
          <a className="button dark" href={`/play/${game.slug}/`}>
            Play {game.name}
          </a>
        ) : (
          <StatusBadge status={game.status} />
        )}
      </div>
    </article>
  );
}
export function FeaturedGames({ games }: { games: readonly Game[] }) {
  return (
    <section
      id="games"
      className="shell games-section"
      aria-labelledby="games-title"
    >
      <div className="section-heading">
        <div>
          <h2 id="games-title">Featured games</h2>
        </div>
      </div>
      <div className="space-y-6">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
