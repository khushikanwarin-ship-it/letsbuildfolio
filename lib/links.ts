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
  // Google Form EMBED url for the Realtalk check.
  // Get it from your form: Send → < > (embed) → copy the src="..." URL.
  // It looks like: https://docs.google.com/forms/d/e/XXXX/viewform?embedded=true
  realtalkForm: <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfz01yhTq6Y2SELhzJ6wYxgPGk0R_-E7oYn6cXp-xMLM6V4fw/viewform?embedded=true" width="640" height="2072" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>",
  // Direct (non-embedded) link to open the Realtalk Google Form in a new tab
  realtalkFormPublic: "https://docs.google.com/forms/d/e/1FAIpQLSfz01yhTq6Y2SELhzJ6wYxgPGk0R_-E7oYn6cXp-xMLM6V4fw/viewform?usp=dialog",

// Helper: returns a usable href, or "#" if not set yet
export const href = (url: string) => url || "#";
export const isSet = (url: string) => !!url;
