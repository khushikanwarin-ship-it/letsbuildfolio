"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type User = {
  id: string; name: string; email: string; grade: string | null;
  stream: string | null; xp: number; created_at: string;
};

function daysAgo(n: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export default function InsightsPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/admin/users", { headers: { "x-admin-secret": secret } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUsers(data.users || []);
      setAuthed(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm";

  if (!authed) {
    return (
      <>
        <Navbar />
        <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 flex flex-col items-center">
          <div className="w-full max-w-sm mt-10">
            <h1 className="font-black text-3xl text-[#3A2E5C] mb-2 text-center" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Insights</h1>
            <p className="text-[#4A4A4A] text-sm mb-6 text-center">Enter your admin password to view sign-ups and stats.</p>
            {err && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{err}</div>}
            <form onSubmit={unlock} className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow flex flex-col gap-4">
              <input type="password" required value={secret} onChange={e => setSecret(e.target.value)} placeholder="Admin password" className={inputCls} autoFocus />
              <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active disabled:opacity-60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                {loading ? "Checking..." : "Unlock"}
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  // ── Stats ──
  const total = users.length;
  const today = daysAgo(0).getTime();
  const last7 = daysAgo(7).getTime();
  const last30 = daysAgo(30).getTime();
  const signupsToday = users.filter(u => new Date(u.created_at).getTime() >= today).length;
  const signups7 = users.filter(u => new Date(u.created_at).getTime() >= last7).length;
  const signups30 = users.filter(u => new Date(u.created_at).getTime() >= last30).length;

  // Last 14 days bar data
  const bars = Array.from({ length: 14 }, (_, i) => {
    const start = daysAgo(13 - i).getTime();
    const end = daysAgo(12 - i).getTime();
    const count = users.filter(u => { const t = new Date(u.created_at).getTime(); return t >= start && t < end; }).length;
    return { count, label: new Date(start).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) };
  });
  const maxBar = Math.max(1, ...bars.map(b => b.count));

  // Stream split
  const streams = ["STEM", "Commerce", "Law", "Humanities", "Impact", "All"];
  const streamCounts = streams.map(s => ({ s, n: users.filter(u => (u.stream || "All") === s).length })).filter(x => x.n > 0);

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const Stat = ({ n, label, bg }: { n: number; label: string; bg: string }) => (
    <div className={`${bg} border-2 border-[#3A2E5C] rounded-2xl p-5 jelly-shadow-sm`}>
      <div className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{n}</div>
      <div className="text-xs font-semibold text-[#3A2E5C]/70 mt-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{label}</div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[900px] mx-auto pb-20">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Insights</h1>
            <p className="text-[#4A4A4A] text-sm">Who signed up and when.</p>
          </div>
          <Link href="/admin" className="text-[#3A2E5C] font-bold text-sm hover:underline" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Manage opportunities →</Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat n={total} label="Total users" bg="bg-[#AEE3FF]" />
          <Stat n={signupsToday} label="Joined today" bg="bg-[#D5C6FF]" />
          <Stat n={signups7} label="Last 7 days" bg="bg-[#FFC6E5]" />
          <Stat n={signups30} label="Last 30 days" bg="bg-[#AEE3FF]" />
        </div>

        {/* Signups chart */}
        <div className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow mb-8">
          <h2 className="font-black text-lg text-[#3A2E5C] mb-4" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Sign-ups (last 14 days)</h2>
          <div className="flex items-end gap-1.5 h-32">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                <span className="text-[10px] font-bold text-[#3A2E5C] mb-1 opacity-0 group-hover:opacity-100">{b.count}</span>
                <div className="w-full bg-[#3A2E5C] rounded-t-md transition-all" style={{ height: `${(b.count / maxBar) * 100}%`, minHeight: b.count > 0 ? "6px" : "2px", opacity: b.count > 0 ? 1 : 0.15 }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[#4A4A4A]/60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
            <span>{bars[0].label}</span><span>{bars[bars.length - 1].label}</span>
          </div>
        </div>

        {/* Stream split */}
        {streamCounts.length > 0 && (
          <div className="mb-8">
            <h2 className="font-black text-lg text-[#3A2E5C] mb-3" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Users by stream</h2>
            <div className="flex flex-wrap gap-2">
              {streamCounts.map(({ s, n }) => (
                <span key={s} className="px-3 py-1.5 bg-white border-2 border-[#3A2E5C] rounded-full text-xs font-bold text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{s}: {n}</span>
              ))}
            </div>
          </div>
        )}

        {/* User list */}
        <div className="flex items-center gap-3 bg-white border-2 border-[#3A2E5C] rounded-2xl px-4 py-3 jelly-shadow-sm mb-4">
          <span className="material-symbols-outlined text-[#3A2E5C]/50">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." className="flex-1 outline-none text-[#3A2E5C] text-sm bg-transparent" />
        </div>
        <h2 className="font-black text-lg text-[#3A2E5C] mb-3" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>All users ({filtered.length})</h2>
        <div className="flex flex-col gap-2">
          {filtered.map(u => (
            <div key={u.id} className="bg-white border-2 border-[#3A2E5C]/15 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#D5C6FF] border-2 border-[#3A2E5C] flex items-center justify-center font-black text-xs text-[#3A2E5C] shrink-0">
                  {(u.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#3A2E5C] truncate">{u.name || "Unnamed"}</h3>
                  <p className="text-[#4A4A4A]/70 text-xs truncate">{u.email}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-[#3A2E5C] font-semibold" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{u.grade || "—"}{u.stream ? ` · ${u.stream}` : ""}</div>
                <div className="text-[10px] text-[#4A4A4A]/60">{new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-[#4A4A4A]/50 text-sm py-10">No users yet.</p>}
        </div>

        <p className="text-xs text-[#4A4A4A]/50 mt-8 leading-relaxed">
          For visitor traffic (how many people reached the site, page views, devices, countries), open your <strong>Vercel dashboard → Analytics</strong> tab. It tracks all visits automatically.
        </p>
      </main>
    </>
  );
}
