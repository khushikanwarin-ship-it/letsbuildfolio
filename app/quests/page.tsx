"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const QUESTS = [
  { name: "Intro to Web Dev", xp: 200, icon: "code", color: "bg-[#AEE3FF]", desc: "Build your first webpage with HTML, CSS and JavaScript." },
  { name: "Portfolio Design", xp: 300, icon: "brush", color: "bg-[#D5C6FF]", desc: "Design a standout personal portfolio that gets you noticed." },
  { name: "Public Speaking", xp: 250, icon: "mic", color: "bg-[#FFC6E5]", desc: "Craft and deliver a 3-minute talk that moves an audience." },
  { name: "Research Paper 101", xp: 400, icon: "menu_book", color: "bg-[#AEE3FF]", desc: "Write your first structured research paper on any topic you love." },
  { name: "Startup Pitch", xp: 500, icon: "rocket_launch", color: "bg-[#FFC6E5]", desc: "Ideate, validate, and pitch a startup idea to a panel of mentors." },
  { name: "Data Storytelling", xp: 350, icon: "bar_chart", color: "bg-[#D5C6FF]", desc: "Turn raw data into compelling visual stories using free tools." },
];

export default function QuestsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        const { data: prof } = await supabase.from("profiles").select("xp").eq("id", data.user.id).single();
        if (prof) setXp(prof.xp || 0);
        const { data: qp } = await supabase.from("quest_progress").select("quest_name,status").eq("user_id", data.user.id);
        if (qp) setCompleted(new Set(qp.filter(r => r.status === "completed").map(r => r.quest_name as string)));
      }
      setReady(true);
    })();
  }, []);

  async function complete(name: string, questXp: number) {
    if (!userId) { router.push("/auth"); return; }
    if (completed.has(name)) return;
    setBusy(name);

    await supabase.from("quest_progress").upsert(
      { user_id: userId, quest_name: name, status: "completed", xp_earned: questXp, completed_at: new Date().toISOString() },
      { onConflict: "user_id,quest_name" }
    );
    const newXp = xp + questXp;
    await supabase.from("profiles").update({ xp: newXp }).eq("id", userId);

    setXp(newXp);
    setCompleted(prev => new Set(prev).add(name));
    setBusy(null);
    setToast(`+${questXp} XP earned!`);
    setTimeout(() => setToast(""), 2500);
  }

  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;

  function statusOf(i: number): "completed" | "available" | "locked" {
    if (completed.has(QUESTS[i].name)) return "completed";
    if (i === 0 || completed.has(QUESTS[i - 1].name)) return "available";
    return "locked";
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[1200px] mx-auto pb-24">
        <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Level up</span>
        <h1 className="font-black text-[40px] text-[#3A2E5C] mb-2 mt-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>Quests</h1>
        <p className="text-[#4A4A4A] mb-10">Complete bite-sized challenges, earn XP, and level up your builder profile.</p>

        {/* XP bar */}
        <div className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-2xl p-5 mb-10 flex items-center gap-6 jelly-shadow">
          <div className="w-16 h-16 bg-[#D5C6FF] rounded-full border-2 border-[#3A2E5C] flex items-center justify-center font-black text-2xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{level}</div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Level {level} {userId ? "" : "(log in to track)"}</span>
              <span className="font-bold text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{xpInLevel} / 200 XP</span>
            </div>
            <div className="w-full bg-[#ECE7EB] rounded-full h-3 border border-[#3A2E5C]/20 overflow-hidden">
              <div className="bg-[#3A2E5C] h-full rounded-full transition-all" style={{ width: `${(xpInLevel / 200) * 100}%` }} />
            </div>
            <p className="text-xs text-[#4A4A4A] mt-1">{completed.size} of {QUESTS.length} quests completed · {xp} total XP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUESTS.map((q, i) => {
            const status = ready ? statusOf(i) : "locked";
            return (
              <div key={q.name} className={`${q.color} border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow flex flex-col justify-between ${status === "completed" ? "" : i % 2 === 0 ? "sticker-rotate-neg hover:rotate-0" : "sticker-rotate-pos hover:rotate-0"} transition-all`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C]">
                      <span className="material-symbols-outlined text-[#3A2E5C] text-2xl">{status === "completed" ? "verified" : q.icon}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border border-[#3A2E5C] ${status === "available" ? "bg-white text-[#3A2E5C]" : status === "completed" ? "bg-[#3A2E5C] text-white" : "bg-white/40 text-[#3A2E5C]/50"}`} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                      {status === "completed" ? "Done" : status === "available" ? "Available" : "Locked"}
                    </span>
                  </div>
                  <h3 className="font-black text-xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{q.name}</h3>
                  <p className="text-[#3A2E5C]/70 text-sm mb-4">{q.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm font-bold text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    <span className="material-symbols-outlined text-base">star</span>{q.xp} XP
                  </span>
                  <button
                    onClick={() => complete(q.name, q.xp)}
                    disabled={status === "locked" || status === "completed" || busy === q.name}
                    className={`glossy-button text-xs font-bold px-4 py-2 rounded-xl border-2 border-[#3A2E5C] jelly-shadow-sm ${status === "available" ? "bg-[#3A2E5C] text-white jelly-active" : "bg-white/30 text-[#3A2E5C]/40 cursor-not-allowed"}`}
                    style={{ fontFamily: '"Space Grotesk",sans-serif' }}
                  >
                    {busy === q.name ? "..." : status === "completed" ? "Completed" : status === "available" ? "Complete Quest" : "Locked"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />

      {/* XP toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#3A2E5C] text-white px-6 py-3 rounded-full font-bold text-sm jelly-shadow border-2 border-[#3A2E5C] flex items-center gap-2 animate-float" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
          <span className="material-symbols-outlined">celebration</span>{toast}
        </div>
      )}
    </>
  );
}
