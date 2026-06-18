"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const STREAMS = [
  { label: "STEM", icon: "biotech", value: "STEM" },
  { label: "Commerce", icon: "payments", value: "Commerce" },
  { label: "Law", icon: "gavel", value: "Law" },
  { label: "Humanities", icon: "theater_comedy", value: "Humanities" },
  { label: "Impact", icon: "volunteer_activism", value: "Impact" },
  { label: "Not sure yet", icon: "explore", value: "All" },
];

const INTERESTS = [
  "Hackathons", "Internships", "Research", "Scholarships", "MUNs",
  "Study Abroad", "Entrepreneurship", "Social Impact", "Olympiads", "Summer Programs",
];

const GOALS = [
  { label: "Get into a top college", icon: "school" },
  { label: "Win competitions", icon: "emoji_events" },
  { label: "Build real skills", icon: "construction" },
  { label: "Study abroad", icon: "flight_takeoff" },
  { label: "Make social impact", icon: "favorite" },
  { label: "Explore everything", icon: "travel_explore" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [stream, setStream] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const TOTAL = 3;

  function toggleInterest(i: string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  async function finish() {
    setSaving(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("profiles").update({ stream: stream || "All" }).eq("id", data.user.id);
      }
      localStorage.setItem("lbf-prefs", JSON.stringify({ stream: stream || "All", interests, goal }));
    } catch { /* non-fatal */ }
    router.push("/dashboard");
  }

  const canNext = (step === 0 && !!stream) || (step === 1 && interests.length > 0) || (step === 2 && !!goal);

  return (
    <main className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FFC6E5] rounded-full opacity-20 blur-3xl -z-10" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#AEE3FF] rounded-full opacity-20 blur-3xl -z-10" />

      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>LetsBuildFolio</span>
          <span className="text-xs font-bold text-[#4A4A4A]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Step {step + 1} of {TOTAL}</span>
        </div>
        <div className="w-full bg-[#ECE7EB] rounded-full h-2.5 border border-[#3A2E5C]/20 overflow-hidden">
          <div className="bg-[#3A2E5C] h-full rounded-full transition-all" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 bg-[#D5C6FF] rounded-3xl translate-x-3 translate-y-3 -z-10 border-2 border-[#3A2E5C]" />
        <div className="bg-[#FFFDF7] rounded-3xl border-2 border-[#3A2E5C] p-8">

          {/* Step 0: stream */}
          {step === 0 && (
            <>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>What is your stream?</h1>
              <p className="text-[#4A4A4A] text-sm mb-6">We will tailor your feed to it. You can change this later.</p>
              <div className="grid grid-cols-2 gap-3">
                {STREAMS.map(s => (
                  <button key={s.value} onClick={() => setStream(s.value)}
                    className={`flex items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${stream === s.value ? "bg-[#3A2E5C] text-white border-[#3A2E5C] jelly-shadow-sm" : "bg-white text-[#3A2E5C] border-[#3A2E5C]/30 hover:border-[#3A2E5C]"}`}
                    style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    <span className="material-symbols-outlined">{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1: interests */}
          {step === 1 && (
            <>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>What are you into?</h1>
              <p className="text-[#4A4A4A] text-sm mb-6">Pick as many as you like.</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${interests.includes(i) ? "bg-[#3A2E5C] text-white border-[#3A2E5C]" : "bg-white text-[#3A2E5C] border-[#3A2E5C]/30 hover:border-[#3A2E5C]"}`}
                    style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    {interests.includes(i) ? "✓ " : ""}{i}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: goal */}
          {step === 2 && (
            <>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>What is your main goal?</h1>
              <p className="text-[#4A4A4A] text-sm mb-6">This helps us highlight what matters to you.</p>
              <div className="grid grid-cols-1 gap-3">
                {GOALS.map(g => (
                  <button key={g.label} onClick={() => setGoal(g.label)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all text-left ${goal === g.label ? "bg-[#3A2E5C] text-white border-[#3A2E5C] jelly-shadow-sm" : "bg-white text-[#3A2E5C] border-[#3A2E5C]/30 hover:border-[#3A2E5C]"}`}
                    style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                    <span className="material-symbols-outlined">{g.icon}</span>{g.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="px-5 py-3 rounded-xl border-2 border-[#3A2E5C]/30 text-[#3A2E5C] font-bold text-sm hover:border-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                Back
              </button>
            )}
            {step < TOTAL - 1 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext}
                className="flex-1 glossy-button bg-[#3A2E5C] text-white py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                Continue
              </button>
            ) : (
              <button onClick={finish} disabled={!canNext || saving}
                className="flex-1 glossy-button bg-[#3A2E5C] text-white py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active disabled:opacity-40"
                style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                {saving ? "Setting up..." : "Finish & see my feed"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
