"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function GuideGate({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  if (loggedIn === null) {
    return (
      <div className="py-12 flex justify-center">
        <span className="material-symbols-outlined text-3xl text-[#3A2E5C]/30 animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="bg-[#FFC6E5] border-2 border-[#3A2E5C] rounded-3xl p-8 md:p-10 text-center jelly-shadow my-6">
        <span className="material-symbols-outlined text-4xl text-[#3A2E5C] mb-3 block">lock</span>
        <h2 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Sign up free to read the full guide</h2>
        <p className="text-[#3A2E5C]/80 text-sm mb-6 max-w-md mx-auto">Create a free account to unlock all our guides, plus 300+ opportunities and your AI consultant.</p>
        <Link href="/auth?tab=signup" className="glossy-button bg-[#3A2E5C] text-white px-8 py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active inline-block" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
          Sign up free
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
