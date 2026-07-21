export function repositoryTreeLimitations(tree: { truncated: boolean; failed?: boolean }) {
  return [
    ...(tree.truncated
      ? ["GitHub marked the repository tree as truncated, so file-path evidence may be incomplete."]
      : []),
    ...(tree.failed
      ? ["Repository file paths could not be retrieved, so file-based recommendations may be limited."]
      : []),
  ];
}

export function mergeLimitations(...groups: string[][]) {
  return [...new Set(groups.flat())];
}
