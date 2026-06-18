"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase fires a PASSWORD_RECOVERY event when arriving from the reset link
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) { setValid(true); }
      setReady(true);
    });
    // Also check if a session already exists (link already processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValid(true);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw new Error(err.message);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm";

  return (
    <main className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="font-black text-2xl text-[#3A2E5C] mb-8" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>LetsBuildFolio</Link>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-[#D5C6FF] rounded-3xl translate-x-3 translate-y-3 -z-10 border-2 border-[#3A2E5C]" />
        <div className="bg-[#FFFDF7] rounded-3xl border-2 border-[#3A2E5C] p-8">
          {!ready ? (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-3xl text-[#3A2E5C]/40 animate-spin">progress_activity</span>
            </div>
          ) : done ? (
            <div className="text-center py-4">
              <span className="material-symbols-outlined text-5xl text-green-600 mb-3 block">check_circle</span>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Password updated!</h1>
              <p className="text-[#4A4A4A] text-sm">Taking you to your dashboard...</p>
            </div>
          ) : valid ? (
            <>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Set a new password</h1>
              <p className="text-[#4A4A4A] text-sm mb-6">Choose a new password for your account.</p>
              {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{error}</div>}
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required minLength={6} placeholder="New password (min. 6 chars)" value={password} onChange={e => setPassword(e.target.value)} className={inputCls + " pr-12"} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A2E5C]/50 hover:text-[#3A2E5C]">
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-4 rounded-xl font-bold text-sm jelly-shadow jelly-active disabled:opacity-60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                  {loading ? "Updating..." : "Update password"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <span className="material-symbols-outlined text-5xl text-[#3A2E5C]/30 mb-3 block">link_off</span>
              <h1 className="font-black text-xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Invalid or expired link</h1>
              <p className="text-[#4A4A4A] text-sm mb-4">This reset link is no longer valid. Request a new one from the login page.</p>
              <Link href="/auth" className="text-[#3A2E5C] font-bold text-sm hover:underline">Back to log in</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
