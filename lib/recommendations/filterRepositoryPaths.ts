const EXCLUDED_SEGMENTS = new Set(["node_modules", ".next", "dist", "build", "coverage", "vendor", ".git"]);
const EXCLUDED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".mp4",
  ".mov",
  ".avi",
  ".mp3",
  ".wav",
  ".ogg",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar",
  ".lock",
  ".map",
]);
const PRIORITY_PATTERNS = [
  /^(src|app|components|lib|pages|server|api)\//,
  /(__tests__|test|tests|spec)/i,
  /(^|\/)README|CONTRIBUTING|CODE_OF_CONDUCT|docs\//i,
  /package.json|pyproject.toml|requirements.txt|Cargo.toml|go.mod|pom.xml|build.gradle|composer.json/i,
  /^\.github\//,
];

export function isUsefulRepositoryPath(path: string) {
  const lower = path.toLowerCase();

  if (path.split("/").some((segment) => EXCLUDED_SEGMENTS.has(segment))) {
    return false;
  }

  if ([...EXCLUDED_EXTENSIONS].some((extension) => lower.endsWith(extension))) {
    return false;
  }

  if (/\.min\.js$/.test(lower)) {
    return false;
  }

  return true;
}

export function filterRepositoryPaths(paths: string[], limit = 250) {
  return [...new Set(paths.filter(isUsefulRepositoryPath))]
    .sort((a, b) => scorePath(b) - scorePath(a) || a.localeCompare(b))
    .slice(0, limit);
}

function scorePath(path: string) {
  return PRIORITY_PATTERNS.reduce(
    (score, pattern, index) => score + (pattern.test(path) ? 100 - index * 10 : 0),
    0,
  );
}
