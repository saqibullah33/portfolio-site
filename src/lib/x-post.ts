/** Only accept links to individual posts on X/Twitter, never arbitrary URLs. */
export function xPostId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      !["x.com", "www.x.com", "twitter.com", "www.twitter.com", "mobile.twitter.com"].includes(url.hostname)
    ) return null;
    const match = url.pathname.match(/^\/(?:[a-zA-Z0-9_]{1,15})\/status\/(\d+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function validXPostInput(value: unknown): boolean {
  return value == null || String(value).trim() === "" || xPostId(value) !== null;
}
