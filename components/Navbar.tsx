"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAV = [["Opportunities","/dashboard"],["Quests","/quests"],["Abroad","/abroad"],["Guides","/resources"],["Ask AI","/ask"],["Realtalk","/realtalk"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName(data.user?.user_metadata?.name || data.user?.email?.split("@")[0] || null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setName(session?.user?.user_metadata?.name || session?.user?.email?.split("@")[0] || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setName(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-[#FFFDF7] border-b-2 border-[#3A2E5C] jelly-shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-[#3A2E5C] tracking-tight" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
          LetsBuildFolio
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {NAV.map(([label,href]) => (
            <Link key={label} href={href} className="text-[#4A4A4A] hover:text-[#3A2E5C] transition-colors font-semibold text-sm" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {ready && name ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#D5C6FF] border-2 border-[#3A2E5C] flex items-center justify-center font-black text-xs text-[#3A2E5C]">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#3A2E5C] font-semibold text-sm group-hover:underline" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{name}</span>
              </Link>
              <button onClick={logout} className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm font-semibold" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Log out</button>
            </div>
          ) : (
            <>
              <Link href="/auth" className="hidden md:inline-block text-[#3A2E5C] font-semibold text-sm hover:underline" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Log in</Link>
              <Link href="/auth?tab=signup" className="glossy-button bg-[#3A2E5C] text-white px-5 py-2 rounded-full font-bold text-sm jelly-shadow-sm jelly-active" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Join free</Link>
            </>
          )}
          <button className="md:hidden p-2 text-[#3A2E5C]" onClick={() => setOpen(!open)}>
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#FFFDF7] border-t-2 border-[#3A2E5C]/20 px-6 py-4 flex flex-col gap-4">
          {NAV.map(([label,href]) => (
            <Link key={label} href={href} className="text-[#3A2E5C] font-semibold text-base" style={{ fontFamily: '"Space Grotesk",sans-serif' }} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          {ready && name ? (
            <>
              <Link href="/profile" className="text-[#3A2E5C] font-semibold text-base" onClick={() => setOpen(false)}>My Profile</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="text-left text-[#4A4A4A] font-semibold text-base">Log out</button>
            </>
          ) : (
            <Link href="/auth" className="text-[#3A2E5C] font-semibold text-base" onClick={() => setOpen(false)}>Log in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
