const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "";

export const env = {
  apiUrl,
  vapidPublicKey,
};
