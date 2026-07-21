import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href="/" aria-label="RepoPilot home">
          <span className="wordmark__mark" aria-hidden="true">R</span>
          <span>RepoPilot</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link className="nav-link" href="/">Home</Link>
          <Link className="nav-link" href="/about">About</Link>
          <a className="nav-link" href="https://github.com/INEZA-24/RepoPilot" target="_blank" rel="noreferrer" aria-label="Open RepoPilot source on GitHub">
            GitHub
          </a>
          <Link className="btn btn-primary" href="/#analyze-repository">Analyze repository</Link>
        </nav>
      </div>
    </header>
  );
}
