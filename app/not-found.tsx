import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="shell launch-page">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>This page may have moved, or the game hasn’t been released.</p>
      <Link className="button dark" href="/#games">
        View games
      </Link>
    </main>
  );
}
