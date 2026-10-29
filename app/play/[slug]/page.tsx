import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games } from "@/lib/games";
export const dynamicParams = false;
export function generateStaticParams() {
  return games
    .filter((g) => g.status === "available")
    .map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  return {
    title: game ? `Play ${game.name}` : "Game unavailable",
    alternates: { canonical: `/play/${slug}/` },
  };
}
export default async function Play({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug && g.status === "available");
  if (!game) notFound();
  return (
    <main id="main" className="shell launch-page">
      <Link className="text-link" href="/#games">
        ← All games
      </Link>
      <span className="eyebrow">{game.genre}</span>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <div className="launch-note">
        <h2>Saved progress</h2>
        <p>
          Your progress is saved in this browser on this domain.{" "}
          {game.legacyUrl && (
            <>
              Saves from {new URL(game.legacyUrl).hostname} stay there and do
              not transfer automatically. Keep playing there if you want to
              continue an existing game.
            </>
          )}
        </p>
        <p>
          You can play offline after the game has been cached by your browser.
          Use your browser’s Back button to return here.
        </p>
      </div>
      <div className="launch-actions">
        <a className="button dark" href={game.gameUrl}>
          Play {game.name} <span aria-hidden="true">↗</span>
        </a>
        {game.legacyUrl && (
          <a className="text-link" href={game.legacyUrl}>
            Continue on the original site ↗
          </a>
        )}
      </div>
    </main>
  );
}
