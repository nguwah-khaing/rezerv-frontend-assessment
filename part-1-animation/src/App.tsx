import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import Preloader from "./components/Preloader";
import Reveal from "./components/Reveal";

const collectibles = [
  {
    name: "Peachy",
    tag: "THE DAYDREAMER",
    emoji: "🍑",
    color: "peach",
    number: "01",
  },
  {
    name: "Mochi",
    tag: "THE SOFTIE",
    emoji: "🐻",
    color: "lilac",
    number: "02",
  },
  {
    name: "Sunny",
    tag: "THE SUN CHASER",
    emoji: "🍋",
    color: "yellow",
    number: "03",
  },
  {
    name: "Bloop",
    tag: "THE LITTLE WEIRDO",
    emoji: "🐸",
    color: "mint",
    number: "04",
  },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ee] text-[#191a17] selection:bg-[#0dc0df] selection:text-[#191a17]">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Lumina home">
          <span className="brand-mark">✳</span> Lumina
          <span className="brand-dot">.</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#collection" className="nav-link">
            The collection
          </a>
          <a href="#story" className="nav-link">
            Our little world
          </a>
          <a href="#footer" className="nav-link">
            Say hello
          </a>
        </nav>
        <a href="#collection" className="header-cta hidden md:inline-flex">
          Explore the gang <ArrowUpRight size={16} />
        </a>
        <button
          className="mobile-menu md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <a onClick={() => setMenuOpen(false)} href="#collection">
              The collection
            </a>
            <a onClick={() => setMenuOpen(false)} href="#story">
              Our little world
            </a>
            <a onClick={() => setMenuOpen(false)} href="#footer">
              Say hello
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <section id="home" className="hero-section">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Sparkles size={15} /> SMALL CHARACTERS. BIG FEELINGS.
          </motion.div>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            A little more
            <br />
            <span className="highlight-word">wonder</span> in your
            <br />
            everyday<span className="period">.</span>
          </motion.h1>
          <motion.p
            className="hero-description"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            Meet a tiny universe of lovable oddballs made to bring a smile,
            spark a story, and remind you that different is delightful.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <a className="primary-button" href="#collection">
              Meet the characters <ArrowUpRight size={17} />
            </a>
            <a className="text-link" href="#story">
              What is this place?
            </a>
          </motion.div>
          <motion.div
            className="social-proof"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <div className="avatar-stack">
              <span>🐻</span>
              <span>🍋</span>
              <span>🐸</span>
              <span>🍑</span>
            </div>
            <div>
              <strong>A tiny world of its own</strong>
              <small>Made for curious hearts</small>
            </div>
          </motion.div>
        </div>
        <div className="hero-art" aria-label="Playful collectible characters">
          <motion.div
            className="art-sun"
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          >
            ✳
          </motion.div>
          <motion.div
            className="sticker sticker-top"
            animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [8, 12, 8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            GOOD
            <br />
            VIBES<span>↘</span>
          </motion.div>
          <motion.div
            className="character character-main"
            initial={
              reduceMotion ? false : { scale: 0.75, rotate: -10, opacity: 0 }
            }
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: 0.35,
              type: "spring",
              stiffness: 110,
              damping: 12,
            }}
            whileHover={{ rotate: 5, y: -8 }}
          >
            <span className="character-face">ʘᴗʘ</span>
            <span className="character-blush blush-left" />
            <span className="character-blush blush-right" />
          </motion.div>
          <motion.div
            className="character character-small character-bear"
            animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [7, 3, 7] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>ᴥ</span>
          </motion.div>
          <motion.div
            className="character character-small character-lemon"
            animate={reduceMotion ? {} : { y: [0, 8, 0], rotate: [-8, -2, -8] }}
            transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>•ᴗ•</span>
          </motion.div>
          <motion.div
            className="floating-heart"
            animate={reduceMotion ? {} : { y: [0, -7, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            ♥
          </motion.div>
        </div>
        <a href="#collection" className="scroll-cue">
          <span> KNOW US</span>
          <ArrowDown size={15} />
        </a>
      </section>

      <section className="ticker" aria-label="Little wonders motto">
        <div className="ticker-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              STAY A LITTLE CURIOUS <b>✳</b> COLLECT GOOD FEELINGS <b>✳</b> BE
              YOUR OWN KIND OF CUTE <b>✳</b>
            </span>
          ))}
        </div>
      </section>

      <section id="collection" className="collection-section">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">THE VERY FIRST FOUR</p>
            <h2>
              Meet the <span>little</span> legends.
            </h2>
          </div>
          <p className="section-intro">
            Each one has a little quirk, a big heart, and absolutely no idea how
            adorable they are.
          </p>
        </Reveal>
        <div className="collectible-grid">
          {collectibles.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <motion.article
                className={`collectible-card ${item.color}`}
                whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <div className="card-topline">
                  <span>LW / {item.number}</span>
                </div>
                <div className="collectible-emoji" aria-hidden="true">
                  {item.emoji}
                </div>
                <div className="card-bottom">
                  <div>
                    <p>{item.tag}</p>
                    <h3>{item.name}</h3>
                  </div>
                  <span className="round-arrow">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
        <Reveal className="collection-bottom">
          <span>01 — 04 / A VERY SMALL BEGINNING</span>
          <a href="#story" className="text-link">
            MORE STORY <ArrowDown size={15} />
          </a>
        </Reveal>
      </section>

      <section id="story" className="story-section">
        <Reveal className="story-stamp">
          <div className="story-stamp-shell" aria-label="Lumina circular mark">
            <div className="stamp-glow" />
            <motion.svg
              className="stamp-ring"
              viewBox="0 0 200 200"
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <path
                id="luminaCirclePath"
                d="M 100, 100 m -76, 0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                fill="none"
              />
              <text className="stamp-ring-text">
                <textPath href="#luminaCirclePath" startOffset="0%">
                  • LUMINA • OUR LITTLE WORLD • LUMINA • OUR LITTLE WORLD
                </textPath>
              </text>
            </motion.svg>
            <div className="stamp-core">
              {/* <span className="stamp-spark">✳</span> */}
              <strong>LUMINA</strong>
            </div>
          </div>
        </Reveal>
        <Reveal className="story-content">
          <p className="eyebrow">A SMALL REMINDER</p>
          <h2>
            You don't have to fit in to <em>belong.</em>
          </h2>
          <p>
            We believe the world could use a little more play, a little less
            perfect, and a whole lot more kindness. Our characters are tiny
            reminders to show up as you are — weird bits and all.
          </p>
          <a className="dark-button" href="#footer">
            Stay in our orbit <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <div className="story-doodle" aria-hidden="true">
          ✳
        </div>
      </section>

      <footer id="footer" className="site-footer">
        <p>Made with a little extra heart © 2026 Lumina</p>
        <a className="footer-top" href="#home">
          TOP ↑
        </a>
      </footer>
    </main>
  );
}
