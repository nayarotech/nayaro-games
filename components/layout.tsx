import Image from "next/image";
import Link from "next/link";
export function Navigation() {
  return (
    <header className="site-header">
      <nav className="shell navigation" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="Nayaro Games home">
          <Image
            src="/brand/nayaro-ink.png"
            width={108}
            height={32}
            alt="Nayaro"
            priority
          />
          <span className="brand-divider" />
          <span>games</span>
        </Link>
        <div className="nav-links">
          <Link href="/#games">Games</Link>
          <Link href="/#about">About</Link>
        </div>
        <a className="company-link" href="https://nayaro.tech">
          Nayaro Technology <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="shell footer">
      <Link href="/" className="footer-name">
        Nayaro Games
      </Link>
      <a href="https://nayaro.tech">
        © {new Date().getFullYear()} Nayaro Technology{" "}
        <span aria-hidden="true">↗</span>
      </a>
    </footer>
  );
}
