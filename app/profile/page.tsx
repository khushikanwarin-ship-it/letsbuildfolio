"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string; name: string; email: string; grade: string;
  stream: string | null; bio: string | null; xp: number; streak: number;
};

type SavedOpp = {
  id: string;
  opportunities: { id: string; title: string; type: string; stream: string; deadline: string; organiser: string } | null;
};

const STREAMS = ["STEM", "Commerce", "Law", "Humanities", "Impact"];
const TYPE_COLORS: Record<string, string> = {
  Hackathon: "bg-[#AEE3FF]", Internship: "bg-[#D5C6FF]", MUN: "bg-[#FFC6E5]",
  Scholarship: "bg-[#AEE3FF]", Quest: "bg-[#FFC6E5]", Camp: "bg-[#D5C6FF]",
};

function levelFromXp(xp: number) {
  return Math.floor(xp / 200) + 1;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState<SavedOpp[]>([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [stream, setStream] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/auth"); return; }
      const uid = userData.user.id;

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", uid).single();
      if (prof) {
        setProfile(prof as Profile);
        setBio(prof.bio || "");
        setStream(prof.stream || "");
      } else {
        // fallback from auth metadata if profile row missing
        setProfile({
          id: uid,
          name: userData.user.user_metadata?.name || "Builder",
          email: userData.user.email || "",
          grade: userData.user.user_metadata?.grade || "",
          stream: null, bio: null, xp: 0, streak: 0,
        });
      }

      const { data: savedData } = await supabase
        .from("saved_opportunities")
        .select("id, opportunities(id, title, type, stream, deadline, organiser)")
        .eq("user_id", uid);
      if (savedData) setSaved(savedData as unknown as SavedOpp[]);

      setLoading(false);
    })();
  }, [router]);

  async function saveEdit() {
    if (!profile) return;
    setSavingEdit(true);
    await supabase.from("profiles").update({ bio, stream }).eq("id", profile.id);
    setProfile({ ...profile, bio, stream });
    setEditing(false);
    setSavingEdit(false);
  }

  async function removeSaved(id: string) {
    await supabase.from("saved_opportunities").delete().eq("id", id);
    setSaved(saved.filter(s => s.id !== id));
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 min-h-screen bg-[#FFFDF7] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-[#3A2E5C]/30 animate-spin">progress_activity</span>
        </main>
      </>
    );
  }

  if (!profile) return null;

  const level = levelFromXp(profile.xp);
  const xpInLevel = profile.xp % 200;
  const initials = profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FFFDF7] pb-28 md:pb-16">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 pt-6">

          {/* Profile header card */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#D5C6FF] rounded-3xl translate-x-2 translate-y-2 -z-10 border-2 border-[#3A2E5C]" />
            <div className="bg-[#FFFDF7] border-2 border-[#3A2E5C] rounded-3xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-[#AEE3FF] border-2 border-[#3A2E5C] flex items-center justify-center font-black text-3xl text-[#3A2E5C] jelly-shadow-sm shrink-0" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>
                  {initials}
                </div>
                <div className="flex-1 text-center sm:text-left w-full">
                  <h1 className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{profile.name}</h1>
                  <p className="text-[#4A4A4A] text-sm mb-3">{profile.email}</p>
                  <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                    {profile.grade && <span className="text-xs font-bold bg-[#F1ECF1] border border-[#3A2E5C] rounded-full px-3 py-1 text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{profile.grade}</span>}
                    {profile.stream && <span className="text-xs font-bold bg-[#FFC6E5] border border-[#3A2E5C] rounded-full px-3 py-1 text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{profile.stream}</span>}
                  </div>
                </div>
                <button onClick={() => setEditing(!editing)} className="glossy-button bg-[#3A2E5C] text-white text-xs font-bold px-4 py-2 rounded-xl jelly-shadow-sm jelly-active shrink-0" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Edit panel */}
              {editing && (
                <div className="mt-6 pt-6 border-t-2 border-[#3A2E5C]/10 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Your stream</label>
                    <select value={stream} onChange={e => setStream(e.target.value)} className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] outline-none text-sm">
                      <option value="">Not set</option>
                      {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3A2E5C] mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell the world what you are building..." className="w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm resize-none" />
                  </div>
                  <button onClick={saveEdit} disabled={savingEdit} className="glossy-button bg-[#3A2E5C] text-white text-sm font-bold py-3 rounded-xl jelly-shadow-sm jelly-active disabled:opacity-60 self-start px-6" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    {savingEdit ? "Saving..." : "Save changes"}
                  </button>
                </div>
              )}

              {/* Bio display */}
              {!editing && profile.bio && (
                <p className="mt-6 pt-6 border-t-2 border-[#3A2E5C]/10 text-[#4A4A4A] text-sm leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#AEE3FF] border-2 border-[#3A2E5C] rounded-2xl p-5 text-center jelly-shadow-sm">
              <div className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{level}</div>
              <div className="text-xs font-semibold text-[#3A2E5C]/70 mt-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Level</div>
            </div>
            <div className="bg-[#D5C6FF] border-2 border-[#3A2E5C] rounded-2xl p-5 text-center jelly-shadow-sm">
              <div className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{profile.xp}</div>
              <div className="text-xs font-semibold text-[#3A2E5C]/70 mt-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Total XP</div>
            </div>
            <div className="bg-[#FFC6E5] border-2 border-[#3A2E5C] rounded-2xl p-5 text-center jelly-shadow-sm">
              <div className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{profile.streak}</div>
              <div className="text-xs font-semibold text-[#3A2E5C]/70 mt-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Day streak</div>
            </div>
          </div>

          {/* XP progress */}
          <div className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-2xl p-5 mb-10 jelly-shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Level {level} progress</span>
              <span className="font-bold text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{xpInLevel} / 200 XP</span>
            </div>
            <div className="w-full bg-[#ECE7EB] rounded-full h-3 border border-[#3A2E5C]/20 overflow-hidden">
              <div className="bg-[#3A2E5C] h-full rounded-full transition-all" style={{ width: `${(xpInLevel / 200) * 100}%` }} />
            </div>
          </div>

          {/* Saved opportunities */}
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#3A2E5C]">bookmark</span>
            <h2 className="font-black text-xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Saved Opportunities</h2>
            <span className="text-xs text-[#4A4A4A]/50">({saved.length})</span>
          </div>

          {saved.length === 0 ? (
            <div className="bg-[#F1ECF1] border-2 border-dashed border-[#3A2E5C]/30 rounded-2xl p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-[#3A2E5C]/20 block mb-2">bookmark_border</span>
              <p className="text-[#4A4A4A] text-sm mb-3">You have not saved any opportunities yet.</p>
              <Link href="/dashboard" className="text-[#3A2E5C] font-bold text-sm hover:underline">Browse the feed →</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {saved.map(s => s.opportunities && (
                <div key={s.id} className={`${TYPE_COLORS[s.opportunities.type] || "bg-[#ECE7EB]"} border-2 border-[#3A2E5C] rounded-2xl p-4 flex items-center justify-between gap-4 jelly-shadow-sm`}>
                  <div className="min-w-0">
                    <div className="flex gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3A2E5C] bg-white text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{s.opportunities.type}</span>
                    </div>
                    <h3 className="font-black text-sm text-[#3A2E5C] truncate" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{s.opportunities.title}</h3>
                    <p className="text-[#3A2E5C]/60 text-xs truncate">{s.opportunities.organiser}</p>
                  </div>
                  <button onClick={() => removeSaved(s.id)} className="text-[#3A2E5C]/50 hover:text-red-600 shrink-0">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />

      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FFFDF7] border-t-2 border-[#3A2E5C]/20">
        {[{icon:"home",label:"Home",href:"/"},{icon:"rss_feed",label:"Feed",href:"/dashboard"},{icon:"military_tech",label:"Quests",href:"/quests"},{icon:"public",label:"Abroad",href:"/abroad"},{icon:"person",label:"Me",href:"/profile"}].map(({icon,label,href}) => (
          <a key={label} href={href} className={`flex flex-col items-center ${href === "/profile" ? "text-[#3A2E5C]" : "text-[#3A2E5C]/40"}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-[10px] font-semibold" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
