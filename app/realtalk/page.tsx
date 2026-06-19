import { redirect } from "next/navigation";
import { SOCIAL } from "@/lib/links";

// The Realtalk check lives in a Google Form — send visitors straight to it.
export default function RealtalkRedirect() {
  redirect(SOCIAL.realtalkFormPublic);
}
