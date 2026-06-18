/**
 * Extracts platform and title information from a listing URL.
 * This function parses the URL to detect the platform (e.g., PropertyGuru, 99.co)
 * and attempts to extract a meaningful title from the URL slug.
 *
 * @param url - The listing URL to parse
 * @returns An object containing the detected platform and extracted title
 *
 * @example
 * ```ts
 * const result = extractFromUrl("https://www.propertyguru.com.sg/condo-for-rent/hdb-123-street-name");
 * // Returns: { platform: "PropertyGuru", title: "HDB 123 Street Name" }
 * ```
 */
export const extractFromUrl = (url: string) => {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : "https://" + url;
    const urlObj = new URL(normalized);
    let platform = "";
    let title = "";

    const hostname = urlObj.hostname.toLowerCase();

    // Platform detection
    if (hostname.includes("propertyguru")) platform = "PropertyGuru";
    else if (hostname.includes("99.co")) platform = "99.co";
    else if (hostname.includes("carousell")) platform = "Carousell";
    else if (hostname.includes("ohmyhome")) platform = "Ohmyhome";
    else if (hostname.includes("facebook")) platform = "FB Marketplace";
    else platform = hostname.replace("www.", "").split(".")[0];

    // Title and Price extraction from slug
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "";
    const parts = lastPart.split(/[-_]/);

    // 1. Identify "Type" keywords (HDB for Rent, etc)
    const typeMatch = lastPart.match(
      /^(hdb|condo|apartment|landed|room|studio)(?:-for)?(?:-rent|-sale)?/i
    );
    const typePrefix = typeMatch ? typeMatch[0].replace(/-/g, " ") : "";

    // 2. Try to find an address-like pattern (Number + Name)
    const addressMatch = lastPart.match(
      /(\d+-[a-zA-Z0-9-]*-(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr|way|crescent|cres|walk|place|pl|grove|grv|link|view|heights|sq|square|way)[-a-zA-Z0-9-]*)/i
    );

    let addressPart = "";
    if (addressMatch) {
      addressPart = addressMatch[0]
        .split(/[-_]/)
        .filter((part) => !part.match(/^\d{8,}$/)) // remove long numeric IDs at the end
        .join(" ");
    }

    if (typePrefix || addressPart) {
      const combined = `${typePrefix} ${addressPart}`.trim();
      title = combined
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    } else {
      // 3. Fallback to general slug cleanup
      title = parts
        .filter((part) => !part.match(/^\d+$/)) // remove numeric IDs
        .filter(
          (part) =>
            !["hdb", "condo", "apartment", "rent", "for"].includes(
              part.toLowerCase()
            )
        ) // remove generic rent words
        .filter((part) => part.length > 2)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    return { platform, title };
  } catch {
    return { platform: "", title: "" };
  }
};
