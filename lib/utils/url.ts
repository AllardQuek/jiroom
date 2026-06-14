const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "ref",
  "source",
  "si",
  "s",
];

function looksLikeDomain(s: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}/.test(s);
}

export function normalizeUrl(raw: string): string {
  let url = raw.trim();

  if (!url) return url;

  const hasProtocol = /^https?:\/\//i.test(url);

  if (!hasProtocol && looksLikeDomain(url)) {
    url = "https://" + url;
  }

  if (!/^https?:\/\//i.test(url)) {
    return url;
  }

  try {
    const parsed = new URL(url);

    parsed.hostname = parsed.hostname.toLowerCase();

    const searchParams = parsed.searchParams;
    TRACKING_PARAMS.forEach((p) => searchParams.delete(p));
    parsed.search = searchParams.toString();

    parsed.hash = "";

    if (parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

export function normalizeForComparison(url: string): string {
  const normalized = normalizeUrl(url);
  try {
    const parsed = new URL(normalized);
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return normalized;
  }
}
