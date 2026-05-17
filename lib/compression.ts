import pako from 'pako';

/**
 * Compress string using pako (gzip)
 */
export function compress(data: string): Uint8Array {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(data);
  return pako.deflate(uint8Array);
}

/**
 * Decompress gzip data back to string
 */
export function decompress(compressed: Uint8Array): string {
  const decompressed = pako.inflate(compressed);
  const decoder = new TextDecoder();
  return decoder.decode(decompressed);
}

/**
 * Convert Uint8Array to base64 string
 */
export function toBase64(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}