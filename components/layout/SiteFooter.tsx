import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong style={{ color: "var(--text)" }}>© 2026 RepoPilot</strong>
          <span> · Built by INEZA Fidele (Tech Wizard) · MIT License</span>
        </div>
        <nav className="site-footer__links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <a href="https://github.com/INEZA-24/RepoPilot" target="_blank" rel="noreferrer">GitHub repository</a>
        </nav>
      </div>
    </footer>
  );
}
