"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type User = {
  id: string; name: string; email: string; grade: string | null;
  stream: string | null; xp: number; created_at: string; last_sign_in_at: string | null;
};

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

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
  const [sortBy, setSortBy] = useState<"joined" | "active">("joined");
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
  const signups30 = users.filter(u => new Date(u.created_at).getTime() >= last30).length;
  const activeToday = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at).getTime() >= today).length;
  const active7 = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at).getTime() >= last7).length;

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

  const filtered = users
    .filter(u =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "active") {
        const ta = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
        const tb = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
        return tb - ta;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <Stat n={total} label="Total users" bg="bg-[#AEE3FF]" />
          <Stat n={signupsToday} label="Joined today" bg="bg-[#D5C6FF]" />
          <Stat n={signups30} label="Joined (30 days)" bg="bg-[#FFC6E5]" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Stat n={activeToday} label="Active today" bg="bg-[#D5C6FF]" />
          <Stat n={active7} label="Active (last 7 days)" bg="bg-[#AEE3FF]" />
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
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h2 className="font-black text-lg text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>All users ({filtered.length})</h2>
          <div className="flex bg-[#F1ECF1] rounded-full p-1 border-2 border-[#3A2E5C]/20">
            {(["joined", "active"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${sortBy === s ? "bg-[#3A2E5C] text-white" : "text-[#4A4A4A]"}`}
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                {s === "joined" ? "Newest" : "Recently active"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {filtered.map(u => {
            const activeRecent = u.last_sign_in_at && (Date.now() - new Date(u.last_sign_in_at).getTime()) < 7 * 86400000;
            return (
              <div key={u.id} className="bg-white border-2 border-[#3A2E5C]/15 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#D5C6FF] border-2 border-[#3A2E5C] flex items-center justify-center font-black text-xs text-[#3A2E5C]">
                      {(u.name || "?").charAt(0).toUpperCase()}
                    </div>
                    {activeRecent && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" title="Active recently" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#3A2E5C] truncate">{u.name || "Unnamed"}</h3>
                    <p className="text-[#4A4A4A]/70 text-xs truncate">{u.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-[#3A2E5C] font-semibold flex items-center gap-1 justify-end" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    <span className="material-symbols-outlined text-[#3A2E5C]/50" style={{ fontSize: "14px" }}>schedule</span>
                    {timeAgo(u.last_sign_in_at)}
                  </div>
                  <div className="text-[10px] text-[#4A4A4A]/60">joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}{u.grade ? ` · ${u.grade}` : ""}</div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-[#4A4A4A]/50 text-sm py-10">No users yet.</p>}
        </div>

        <p className="text-xs text-[#4A4A4A]/50 mt-8 leading-relaxed">
          For visitor traffic (how many people reached the site, page views, devices, countries), open your <strong>Vercel dashboard → Analytics</strong> tab. It tracks all visits automatically.
        </p>
      </main>
    </>
  );
}
