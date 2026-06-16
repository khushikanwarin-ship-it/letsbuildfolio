"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Wraps the landing page. If the visitor is already logged in,
// send them straight to the dashboard instead of showing the marketing page.
export default function LandingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      } else {
        setChecked(true);
      }
    });
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-[#3A2E5C]/30 animate-spin">progress_activity</span>
      </div>
    );
  }

  return <>{children}</>;
}
