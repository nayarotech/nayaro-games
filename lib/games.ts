export type Game = Readonly<{
  slug: string;
  name: string;
  description: string;
  cover: string;
  coverAlt: string;
  genre: "Puzzle" | "Casual" | "Strategy" | "Multiplayer" | "Educational";
  status: "available" | "upcoming";
  gameUrl: `/${string}/` | `https://${string}`;
  featured: boolean;
  releaseDate?: string;
  legacyUrl?: `https://${string}`;
}>;
export const games: readonly Game[] = [
  {
    slug: "mergefinity",
    name: "MergeFinity",
    description:
      "Combine matching numbers to build larger tiles. Play Classic, Daily Puzzle, Time Rush, or Limited Moves.",
    cover: "/mergefinity-board.png",
    coverAlt: "MergeFinity Classic game board",
    legacyUrl: "https://mergefinity.vercel.app",
    genre: "Puzzle",
    status: "available",
    gameUrl: "/mergefinity/",
    featured: true,
  },
];
export const featuredGames = games.filter(
  (game) => game.featured && game.status === "available",
);
export const siteUrl = "https://games.nayaro.tech";
