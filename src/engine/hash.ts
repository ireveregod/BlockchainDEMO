/**
 * Deterministic, fast, non-cryptographic hash used purely for the visual
 * demonstration (FNV-1a), rendered as a hex string. Not real cryptography —
 * this is a teaching prop, not a security primitive.
 */
export function fakeHash(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = (Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)) >>> 0;
  h2 = (Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)) >>> 0;
  return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}
