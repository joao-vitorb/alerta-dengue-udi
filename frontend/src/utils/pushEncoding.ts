export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const normalized = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(normalized);
  const buffer = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    buffer[index] = rawData.charCodeAt(index);
  }

  return buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";

  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary);
}
