export function publicAsset(path: string): string {
  // Leave absolute URLs and data URIs untouched.
  if (/^(https?:\/\/|data:)/i.test(path)) return path;

  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;

  return `${normalizedBase}${trimmedPath}`;
}
