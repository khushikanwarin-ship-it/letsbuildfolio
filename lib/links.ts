// ── Social & community links ───────────────────────────────
// When your pages/links are ready, just paste the URLs here.
// Leave a value as "" to show a "Coming soon" state on that button.

export const SOCIAL = {
  // e.g. "https://instagram.com/letsbuildfolio"
  instagram: "",
  // WhatsApp Community / Channel / Group invite link
  // e.g. "https://chat.whatsapp.com/XXXXXXXXXXX"
  whatsapp: "",
  // Google Form for "Submit an opportunity / Share an idea"
  // e.g. "https://forms.gle/XXXXXXXX"
  submitForm: "",
};

// Helper: returns a usable href, or "#" if not set yet
export const href = (url: string) => url || "#";
export const isSet = (url: string) => !!url;
