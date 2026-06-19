"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { SOCIAL, href, isSet } from "@/lib/links";

const STREAMS = ["All", "STEM", "Commerce", "Law", "Humanities", "Impact"];
const TYPES = ["All", "Hackathon", "Internship", "MUN", "Scholarship", "Quest"];

const TYPE_COLORS: Record<string, string> = {
  Hackathon: "bg-[#AEE3FF] text-[#3A2E5C]",
  Internship: "bg-[#D5C6FF] text-[#3A2E5C]",
  MUN: "bg-[#FFC6E5] text-[#3A2E5C]",
  Scholarship: "bg-[#AEE3FF] text-[#3A2E5C]",
  Quest: "bg-[#FFC6E5] text-[#3A2E5C]",
  Camp: "bg-[#D5C6FF] text-[#3A2E5C]",
};

const CARD_COLORS = ["bg-[#AEE3FF]", "bg-[#D5C6FF]", "bg-[#FFC6E5]", "bg-[#ECE7EB]"];

const TYPE_ICONS: Record<string, string> = {
  Hackathon: "code",
  Internship: "work",
  MUN: "gavel",
  Scholarship: "school",
  Quest: "military_tech",
  Camp: "forest",
};

type Opp = {
  id: string;
  title: string;
  type: string;
  stream: string;
  description: string;
  deadline: string;
  organiser: string;
  location: string;
  apply_url: string;
  is_featured: boolean;
};


export default function Dashboard() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState("All");
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const GUEST_LIMIT = 5;

  // Personalize default stream from onboarding prefs (instant, no flicker)
  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("lbf-prefs") || "null");
      if (prefs?.stream && prefs.stream !== "All") setStream(prefs.stream);
    } catch { /* ignore */ }
  }, []);

  // Load logged-in user, their saved opportunities, and their saved stream
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        const { data: rows } = await supabase
          .from("saved_opportunities")
          .select("opportunity_id")
          .eq("user_id", data.user.id);
        if (rows) setSaved(new Set(rows.map(r => r.opportunity_id as string)));
        const { data: prof } = await supabase.from("profiles").select("stream").eq("id", data.user.id).single();
        if (prof?.stream && prof.stream !== "All") setStream(prof.stream);
      }
      setAuthChecked(true);
    })();
  }, []);

  const fetchOpps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stream !== "All") params.set("stream", stream);
      if (type !== "All") params.set("type", type);
      if (q) params.set("q", q);
      const res = await fetch(`/api/opportunities?${params}`);
      const data = await res.json();
      setOpps(data.opportunities || []);
    } catch {
      setOpps([]);
    } finally {
      setLoading(false);
    }
  }, [stream, type, q]);

  useEffect(() => { fetchOpps(); }, [fetchOpps]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  async function toggleSave(id: string) {
    if (!userId) {
      window.location.href = "/auth";
      return;
    }
    const isSaved = saved.has(id);
    // Optimistic UI update
    setSaved(prev => {
      const next = new Set(prev);
      isSaved ? next.delete(id) : next.add(id);
      return next;
    });
    // Persist to DB
    if (isSaved) {
      await supabase.from("saved_opportunities").delete().eq("user_id", userId).eq("opportunity_id", id);
    } else {
      await supabase.from("saved_opportunities").insert({ user_id: userId, opportunity_id: id });
    }
  }

  const featured = opps.filter(o => o.is_featured);
  const rest = opps.filter(o => !o.is_featured);
  const guest = authChecked && !userId;

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FFFDF7] pb-28 md:pb-16">

        {/* Header */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-6 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-black text-[36px] md:text-[44px] text-[#3A2E5C] leading-tight" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>
              Discovery Feed
            </h1>
            <p className="text-[#4A4A4A] mt-1 text-sm">Opportunities curated for students aged 14-22. Updated weekly.</p>
          </div>
          <a
            href={href(SOCIAL.submitForm)}
            target="_blank"
            rel="noopener noreferrer"
            className={`glossy-button bg-[#3A2E5C] text-white text-sm font-bold px-5 py-2.5 rounded-xl jelly-shadow-sm jelly-active flex items-center gap-1.5 shrink-0 self-start ${!isSet(SOCIAL.submitForm) ? "opacity-60 pointer-events-none" : ""}`}
            style={{ fontFamily: '"Space Grotesk",sans-serif' }}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Submit an opportunity{!isSet(SOCIAL.submitForm) && " (soon)"}
          </a>
        </div>

        {/* Search bar */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-5">
          <div className="flex items-center gap-3 bg-white border-2 border-[#3A2E5C] rounded-2xl px-4 py-3 jelly-shadow">
            <span className="material-symbols-outlined text-[#3A2E5C]/50 text-xl">search</span>
            <input
              type="text"
              placeholder="Search hackathons, scholarships, internships..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 text-sm bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#4A4A4A]/50 hover:text-[#3A2E5C]">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Stream tabs */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {STREAMS.map(s => (
              <button
                key={s}
                onClick={() => setStream(s)}
                className={`shrink-0 px-5 py-2 rounded-full font-bold text-sm border-2 transition-all ${stream === s ? "bg-[#3A2E5C] text-white border-[#3A2E5C] jelly-shadow-sm" : "bg-white text-[#3A2E5C] border-[#3A2E5C]/20 hover:border-[#3A2E5C]"}`}
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Type chips */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`shrink-0 px-4 py-1.5 rounded-full font-semibold text-xs border-2 transition-all flex items-center gap-1.5 ${type === t ? "bg-[#3A2E5C] text-white border-[#3A2E5C]" : "bg-[#F1ECF1] text-[#3A2E5C] border-transparent hover:border-[#3A2E5C]/30"}`}
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}
              >
                {t !== "All" && <span className="material-symbols-outlined text-sm" style={{ fontSize: "14px" }}>{TYPE_ICONS[t] || "label"}</span>}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10">

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#F1ECF1] border-2 border-[#3A2E5C]/10 rounded-3xl p-6 h-56 animate-pulse" />
              ))}
            </div>
          ) : opps.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-[#3A2E5C]/20 block mb-4">search_off</span>
              <h3 className="font-black text-xl text-[#3A2E5C]/40" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>No results found</h3>
              <p className="text-[#4A4A4A]/50 text-sm mt-2">Try a different stream, type, or search term</p>
              <button onClick={() => { setStream("All"); setType("All"); setSearch(""); }} className="mt-4 text-[#3A2E5C] font-bold text-sm hover:underline">
                Clear all filters
              </button>
            </div>
          ) : guest ? (
            /* ── Metered guest view: first 10, then a signup wall ── */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {opps.slice(0, GUEST_LIMIT).map((opp, i) => (
                  <OppCard key={opp.id} opp={opp} i={i} loggedIn={false} saved={false} onSave={() => toggleSave(opp.id)} expanded={expanded === opp.id} onExpand={() => setExpanded(expanded === opp.id ? null : opp.id)} />
                ))}
              </div>
              {opps.length > GUEST_LIMIT && (
                <div className="mt-8 bg-[#3A2E5C] text-white rounded-3xl p-8 md:p-12 text-center jelly-shadow border-2 border-[#3A2E5C] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <span className="material-symbols-outlined text-4xl text-[#FFC6E5] mb-3 block">lock</span>
                    <h3 className="font-black text-2xl md:text-3xl mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
                      {opps.length - GUEST_LIMIT}+ more opportunities waiting
                    </h3>
                    <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                      You are seeing {GUEST_LIMIT} of {opps.length}. Create a free account to unlock the full feed, save opportunities, earn XP, and get a personalized feed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <a href="/auth?tab=signup" className="glossy-button bg-[#FFC6E5] text-[#3A2E5C] px-8 py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Sign up free</a>
                      <a href="/auth" className="text-white/80 font-bold text-sm hover:text-white" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>or log in</a>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Featured strip */}
              {featured.length > 0 && !q && stream === "All" && type === "All" && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#3A2E5C] text-lg">auto_awesome</span>
                    <h2 className="font-black text-lg text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Featured</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {featured.map((opp, i) => (
                      <OppCard key={opp.id} opp={opp} i={i} loggedIn saved={saved.has(opp.id)} onSave={() => toggleSave(opp.id)} expanded={expanded === opp.id} onExpand={() => setExpanded(expanded === opp.id ? null : opp.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* All results */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
                    {q || stream !== "All" || type !== "All" ? `${opps.length} result${opps.length !== 1 ? "s" : ""}` : "All Opportunities"}
                  </h2>
                  <span className="text-xs text-[#4A4A4A]/50" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{opps.length} total</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(q || stream !== "All" || type !== "All" ? opps : rest).map((opp, i) => (
                    <OppCard key={opp.id} opp={opp} i={i} loggedIn saved={saved.has(opp.id)} onSave={() => toggleSave(opp.id)} expanded={expanded === opp.id} onExpand={() => setExpanded(expanded === opp.id ? null : opp.id)} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FFFDF7] border-t-2 border-[#3A2E5C]/20">
        {[{icon:"home",label:"Home",href:"/"},{icon:"rss_feed",label:"Feed",href:"/dashboard"},{icon:"military_tech",label:"Quests",href:"/quests"},{icon:"public",label:"Abroad",href:"/abroad"},{icon:"person",label:"Me",href:"/profile"}].map(({icon,label,href}) => (
          <a key={label} href={href} className={`flex flex-col items-center transition-colors ${href === "/dashboard" ? "text-[#3A2E5C]" : "text-[#3A2E5C]/40"}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-[10px] font-semibold" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{label}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function OppCard({ opp, i, saved, onSave, expanded, onExpand, loggedIn = true }: {
  opp: Opp; i: number; saved: boolean; onSave: () => void; expanded: boolean; onExpand: () => void; loggedIn?: boolean;
}) {
  const bg = CARD_COLORS[i % CARD_COLORS.length];

  return (
    <div className={`${bg} border-2 border-[#3A2E5C] rounded-3xl p-5 jelly-shadow flex flex-col justify-between transition-all hover:-translate-y-0.5 ${expanded ? "ring-2 ring-[#3A2E5C]" : ""}`}>
      <div>
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C] shrink-0">
            <span className="material-symbols-outlined text-[#3A2E5C] text-xl">{TYPE_ICONS[opp.type] || "label"}</span>
          </div>
          <button onClick={onSave} className={`p-1.5 rounded-lg border-2 transition-all ${saved ? "bg-[#3A2E5C] border-[#3A2E5C] text-white" : "bg-white/60 border-[#3A2E5C]/20 text-[#3A2E5C]/50 hover:border-[#3A2E5C] hover:text-[#3A2E5C]"}`}>
            <span className="material-symbols-outlined text-lg">{saved ? "bookmark" : "bookmark_border"}</span>
          </button>
        </div>

        {/* Type + Stream badges */}
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3A2E5C] bg-white text-[#3A2E5C]`} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{opp.type}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3A2E5C]/30 bg-white/50 text-[#3A2E5C]/70" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{opp.stream}</span>
        </div>

        <h3 className="font-black text-lg text-[#3A2E5C] mb-1 leading-snug" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{opp.title}</h3>
        <p className="text-[#3A2E5C]/60 text-xs mb-2">{opp.organiser} · {opp.location}</p>

        {expanded && (
          <p className="text-[#3A2E5C]/80 text-sm mb-3 leading-relaxed">{opp.description}</p>
        )}
      </div>

      {/* Bottom row */}
      <div className="mt-4">
        <div className="flex gap-2">
          <button onClick={onExpand} className="flex-1 bg-white/60 hover:bg-white border-2 border-[#3A2E5C]/20 hover:border-[#3A2E5C] text-[#3A2E5C] text-xs font-bold py-2 rounded-xl transition-all" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
            {expanded ? "Less" : "Details"}
          </button>
          {loggedIn ? (
            <a href={opp.apply_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 glossy-button bg-[#3A2E5C] text-white text-xs font-bold py-2 rounded-xl jelly-active text-center" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
              Apply
            </a>
          ) : (
            <a href="/auth?tab=signup" className="flex-1 glossy-button bg-[#3A2E5C] text-white text-xs font-bold py-2 rounded-xl jelly-active text-center flex items-center justify-center gap-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>lock</span> Sign up to apply
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
