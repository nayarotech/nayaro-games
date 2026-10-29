import Image from "next/image";
import { FeaturedGames } from "@/components/games";
import { featuredGames } from "@/lib/games";
export default function Home() {
  return (
    <main id="main">
      <section className="shell hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Games from Nayaro.</h1>
          <p>
            Browser games by Nayaro Technology. Start with MergeFinity, a
            number-merging puzzle.
          </p>
          <a className="text-link" href="#games">
            View games
          </a>
        </div>
        <figure className="hero-preview">
          <Image src="/nayaro-games-controller.svg" alt="A game controller with a Nayaro N mark in front of a browser window" width={480} height={340} sizes="(max-width: 760px) 300px, 400px" preload />
        </figure>
      </section>
      <FeaturedGames games={featuredGames} />
      <section className="shell upcoming" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title">More games</h2>
        <p>
          MergeFinity is our first release. Future games will be listed here.
        </p>
      </section>
      <section id="about" className="about" aria-labelledby="about-title">
        <div className="shell about-inner">
          <h2 id="about-title">About Nayaro Games</h2>
          <div>
            <p>
              Nayaro Games is part of Nayaro Technology. This is where we
              publish our browser games.
            </p>
            <a className="text-link" href="https://nayaro.tech">
              Visit Nayaro Technology
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
