// Phone numbers, one way everywhere: (546) 046-5461.
//
// formatPhone is for showing a number: on pages, in dashboards, emails,
// PDFs and texts. A US number in any shape ("5460465461", "546-046-5461",
// "+1 546 046 5461") comes out as "(546) 046-5461". Anything else (a
// number from another country, one with an extension) is shown as typed.
//
// formatPhoneInput is for phone fields: it formats as you type, so the
// field reads "(546) 046-5461" by the last digit.
//
// phoneTel is for tel: and sms: links: "+15460465461".

/** The digits, without a leading US country code (1). */
export function phoneDigits(raw: string | null | undefined): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

/** "(546) 046-5461" for a US number; anything else as typed. */
export function formatPhone(raw: string | null | undefined): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  const d = phoneDigits(value);
  if (d.length !== 10) return value;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** formatPhone, or null when there's no number. */
export function formatPhoneOrNull(
  raw: string | null | undefined,
): string | null {
  return formatPhone(raw) || null;
}

/** As you type: "5" → "(5", "546046" → "(546) 046", then "(546) 046-5461". */
export function formatPhoneInput(raw: string): string {
  const d = String(raw ?? "")
    .replace(/\D/g, "")
    .replace(/^1(?=\d{10})/, "")
    .slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** For tel: and sms: links: "+15460465461" for a US number. */
export function phoneTel(raw: string | null | undefined): string {
  const value = String(raw ?? "").trim();
  const d = phoneDigits(value);
  if (d.length === 10) return `+1${d}`;
  return value.replace(/[^\d+]/g, "");
}

/**
 * For searching. Some numbers are saved as digits and some as
 * "(546) 046-5461", so a search for either finds both: what was typed,
 * its digits, and its formatted form.
 */
export function phoneSearchTerms(q: string): string[] {
  const value = String(q ?? "").trim();
  const terms = new Set<string>([value]);
  if (/^[\d\s().+-]+$/.test(value)) {
    const d = phoneDigits(value);
    if (d.length >= 4) terms.add(d);
    if (d.length === 10) terms.add(formatPhone(d));
  }
  return [...terms].filter(Boolean);
}
