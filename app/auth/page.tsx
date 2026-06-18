"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<"login"|"signup">(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", grade: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (tab === "signup") {
        // Server creates an auto-confirmed user + profile row (service role)
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sign up failed");
      }
      // Client sign-in to establish a real persisted session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInError) throw new Error(signInError.message);
      // New signups go through the onboarding quiz; returning users go to their feed
      router.push(tab === "signup" ? "/onboarding" : "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FFC6E5] rounded-full opacity-20 blur-3xl -z-10" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#AEE3FF] rounded-full opacity-20 blur-3xl -z-10" />
      <div className="absolute top-16 left-8 md:left-32 animate-float hidden sm:block">
        <div className="bg-[#FFC6E5] text-[#3A2E5C] p-3 rounded-full border-2 border-[#3A2E5C] jelly-shadow-sm sticker-rotate-neg">
          <span className="material-symbols-outlined">star</span>
        </div>
      </div>
      <Link href="/" className="font-black text-2xl text-[#3A2E5C] mb-8" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
        LetsBuildFolio
      </Link>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-[#AEE3FF] rounded-3xl translate-x-3 translate-y-3 -z-10 border-2 border-[#3A2E5C]" />
        <div className="bg-[#FFFDF7] rounded-3xl border-2 border-[#3A2E5C] p-8">
          <div className="flex bg-[#F1ECF1] rounded-xl p-1 mb-6 border-2 border-[#3A2E5C]/20">
            {(["login","signup"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={"flex-1 py-2 rounded-lg font-bold text-sm transition-all " + (tab===t?"bg-[#3A2E5C] text-white jelly-shadow-sm":"text-[#4A4A4A] hover:text-[#3A2E5C]")}
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>
          <h1 className="font-black text-2xl text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
            {tab === "login" ? "Welcome back!" : "Join the builders"}
          </h1>
          <p className="text-[#4A4A4A] text-sm mb-6">{tab === "login" ? "Log in to continue building." : "Create your free account today."}</p>
          {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Full Name</label>
                  <input name="name" type="text" required placeholder="Aarav Kumar" value={form.name} onChange={handleChange} className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Grade / Year</label>
                  <select name="grade" required value={form.grade} onChange={handleChange} className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] outline-none text-sm">
                    <option value="">Select your grade</option>
                    {["Grade 9","Grade 10","Grade 11","Grade 12","1st Year College","2nd Year College","3rd Year College","Final Year"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Email</label>
              <input name="email" type="email" required placeholder="you@awesome.com" value={form.email} onChange={handleChange} className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Password</label>
              <input name="password" type="password" required minLength={6} placeholder="min. 6 characters" value={form.password} onChange={handleChange} className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm" />
            </div>
            <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-4 rounded-xl font-bold text-sm jelly-shadow jelly-active mt-2 disabled:opacity-60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
              {loading ? "Please wait..." : tab === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-[#4A4A4A] mt-6">
            {tab === "login" ? "No account yet? " : "Already have one? "}
            <button onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }} className="text-[#3A2E5C] font-bold hover:underline">
              {tab === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return <Suspense><AuthForm /></Suspense>;
}
