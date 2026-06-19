"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type College = { name: string; fee: string; aid: string };
type Dest = {
  key: string;
  flag: string;
  color: string;
  blurb: string;
  scholarships: string;
  colleges: College[];
};

const DESTINATIONS: Dest[] = [
  {
    key: "United Kingdom", flag: "UK", color: "bg-[#AEE3FF]",
    blurb: "World-class universities with 1-year master's and strong research culture. English-taught.",
    scholarships: "Chevening (PG, fully funded), Commonwealth Scholarships, Reach Oxford (UG, low-income).",
    colleges: [
      { name: "University of Oxford", fee: "~GBP 35,000 / yr", aid: "Need-based + Reach Oxford for developing nations" },
      { name: "University of Cambridge", fee: "~GBP 37,000 / yr", aid: "Gates Cambridge (fully funded, PG)" },
      { name: "Imperial College London", fee: "~GBP 38,000 / yr", aid: "President's Scholarships (merit)" },
      { name: "UCL", fee: "~GBP 32,000 / yr", aid: "Some department scholarships" },
      { name: "University of Edinburgh", fee: "~GBP 26,000 / yr", aid: "Global Scholarships available" },
    ],
  },
  {
    key: "United States", flag: "US", color: "bg-[#D5C6FF]",
    blurb: "Huge range of universities, flexible majors, strong funding at top private schools. (See the Ivy League box too!)",
    scholarships: "Fulbright-Nehru (PG), Knight-Hennessy (Stanford), generous need-based aid at top privates.",
    colleges: [
      { name: "MIT", fee: "~$60,000 / yr", aid: "Need-based aid, strong for internationals" },
      { name: "Stanford University", fee: "~$62,000 / yr", aid: "Need-based + Knight-Hennessy (PG, full)" },
      { name: "UC Berkeley", fee: "~$48,000 / yr", aid: "Limited aid for internationals" },
      { name: "Carnegie Mellon", fee: "~$62,000 / yr", aid: "Some merit scholarships" },
      { name: "University of Michigan", fee: "~$56,000 / yr", aid: "Limited merit aid" },
    ],
  },
  {
    key: "Germany", flag: "DE", color: "bg-[#FFC6E5]",
    blurb: "Mostly tuition-FREE public universities, even for internationals. Strong in engineering and sciences.",
    scholarships: "DAAD Scholarships (very generous), Deutschlandstipendium.",
    colleges: [
      { name: "TU Munich", fee: "~EUR 0 (approx 150/sem fee)", aid: "DAAD, tuition-free" },
      { name: "Heidelberg University", fee: "~EUR 1,500 / sem (non-EU)", aid: "DAAD, dept. scholarships" },
      { name: "RWTH Aachen", fee: "~EUR 0 (approx 300/sem fee)", aid: "DAAD, tuition-free" },
      { name: "LMU Munich", fee: "~EUR 0 (approx 150/sem fee)", aid: "DAAD" },
      { name: "TU Berlin", fee: "~EUR 0 (approx 300/sem fee)", aid: "DAAD, tuition-free" },
    ],
  },
  {
    key: "Japan", flag: "JP", color: "bg-[#AEE3FF]",
    blurb: "Low tuition at national universities, fully-funded govt scholarships, growing English programs.",
    scholarships: "MEXT (fully funded - tuition + stipend + flights), JASSO.",
    colleges: [
      { name: "University of Tokyo", fee: "~JPY 535,000 / yr (approx $3.6k)", aid: "MEXT (full), waivers" },
      { name: "Kyoto University", fee: "~JPY 535,000 / yr", aid: "MEXT, university scholarships" },
      { name: "Tokyo Institute of Tech", fee: "~JPY 535,000 / yr", aid: "MEXT" },
      { name: "Osaka University", fee: "~JPY 535,000 / yr", aid: "MEXT, JASSO" },
      { name: "Waseda University (private)", fee: "~JPY 1,200,000 / yr", aid: "Merit scholarships" },
    ],
  },
  {
    key: "France", flag: "FR", color: "bg-[#FFC6E5]",
    blurb: "Low public-university tuition, rising number of English programs, strong in business and engineering.",
    scholarships: "Eiffel Excellence Scholarship, Charpak Program (for Indians).",
    colleges: [
      { name: "Sorbonne University", fee: "~EUR 2,800 / yr (non-EU)", aid: "Eiffel Scholarship" },
      { name: "PSL University", fee: "~EUR 3,700 / yr", aid: "Some merit aid" },
      { name: "Ecole Polytechnique", fee: "~EUR 12,000 / yr", aid: "Merit scholarships" },
      { name: "Sciences Po", fee: "income-based, up to ~EUR 13k", aid: "Need-based (income scaled)" },
      { name: "INSA Lyon", fee: "~EUR 600 / yr", aid: "Charpak Program" },
    ],
  },
  {
    key: "Singapore", flag: "SG", color: "bg-[#D5C6FF]",
    blurb: "Top Asian universities, English-taught, close to India, strong industry links.",
    scholarships: "MOE Tuition Grant (cuts fees with work bond), ASEAN Scholarships.",
    colleges: [
      { name: "NUS", fee: "~S$38,000 / yr", aid: "MOE Tuition Grant (with bond)" },
      { name: "Nanyang Tech (NTU)", fee: "~S$37,000 / yr", aid: "MOE Tuition Grant, NTU scholarships" },
      { name: "SMU", fee: "~S$45,000 / yr", aid: "Some merit scholarships" },
      { name: "SUTD", fee: "~S$48,000 / yr", aid: "MOE Tuition Grant" },
    ],
  },
];

const IVY: Dest = {
  key: "Ivy League (USA)", flag: "IVY", color: "bg-[#3A2E5C]",
  blurb: "The 8 most prestigious private universities in the USA. Most are NEED-BLIND for internationals and meet 100% of demonstrated financial need - meaning if you get in, they help you afford it. Merit scholarships are rare; aid is need-based.",
  scholarships: "Need-based aid only (no merit). Many give full rides to families below ~$85,000 income. Need-blind for internationals: Harvard, Yale, Princeton, Brown, Dartmouth.",
  colleges: [
    { name: "Harvard University", fee: "~$59,000 / yr", aid: "Need-blind, full aid if family income < ~$85k" },
    { name: "Princeton University", fee: "~$62,000 / yr", aid: "Need-blind, no-loan aid (grants only)" },
    { name: "Yale University", fee: "~$67,000 / yr", aid: "Need-blind for internationals" },
    { name: "Columbia University", fee: "~$68,000 / yr", aid: "Meets 100% of need" },
    { name: "University of Pennsylvania", fee: "~$66,000 / yr", aid: "Meets 100% of need" },
    { name: "Brown University", fee: "~$68,000 / yr", aid: "Need-blind for internationals" },
    { name: "Dartmouth College", fee: "~$66,000 / yr", aid: "Need-blind for internationals" },
    { name: "Cornell University", fee: "~$66,000 / yr", aid: "Need-based aid for internationals" },
  ],
};

const TIPS = [
  { icon: "edit_note", tip: "Start your SOP drafts 6 months before the deadline" },
  { icon: "translate", tip: "Most fully-funded programs need no IELTS if your medium of instruction was English" },
  { icon: "volunteer_activism", tip: "Extracurriculars matter more than GPA in many international programs" },
  { icon: "currency_exchange", tip: "Look for programs that cover visa + travel + stipend, not just tuition" },
];

export default function AbroadPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Dest | null>(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const isIvy = selected?.key.includes("Ivy");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  function open(d: Dest) {
    if (loggedIn) setSelected(d);
    else router.push("/auth?tab=signup");
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] pb-24">
        <section className="px-6 md:px-10 max-w-[1200px] mx-auto mb-12">
          <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Global opportunities</span>
          <h1 className="font-black text-[40px] text-[#3A2E5C] mb-2 mt-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>Study Abroad</h1>
          <p className="text-[#4A4A4A] max-w-2xl mb-10">Click a destination to see top colleges, approximate fees, and your scholarship chances.</p>

          {/* Ivy League feature box */}
          <button
            onClick={() => open(IVY)}
            className="w-full text-left bg-[#3A2E5C] text-white border-2 border-[#3A2E5C] rounded-3xl p-6 md:p-8 jelly-shadow mb-8 relative overflow-hidden hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#FFC6E5]">school</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFC6E5]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Most prestigious</span>
                </div>
                <h2 className="font-black text-2xl md:text-3xl mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>The Ivy League</h2>
                <p className="text-white/70 text-sm max-w-xl">All 8 Ivies - fees, and why getting in often means they help you pay. Tap to explore.</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-white/40 shrink-0">arrow_forward</span>
            </div>
          </button>

          <h2 className="font-black text-2xl text-[#3A2E5C] mb-6" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Browse by country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((c, i) => (
              <button
                key={c.key}
                onClick={() => open(c)}
                className={`${c.color} text-left border-2 border-[#3A2E5C] rounded-2xl p-5 jelly-shadow hover:-translate-y-1 transition-transform ${i % 2 === 0 ? "sticker-rotate-neg hover:rotate-0" : "sticker-rotate-pos hover:rotate-0"}`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C] mb-3 font-black text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{c.flag}</div>
                <h3 className="font-black text-xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{c.key}</h3>
                <p className="text-[#3A2E5C]/70 text-xs mb-3">{c.colleges.length} top colleges</p>
                <span className="text-xs font-bold bg-white border border-[#3A2E5C] rounded-full px-3 py-1 text-[#3A2E5C] inline-flex items-center gap-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                  View details <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-[#3A2E5C] py-16 px-6 md:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-black text-[32px] text-white mb-8" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Insider tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TIPS.map(({ icon, tip }) => (
                <div key={tip} className="bg-white/10 border border-white/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFC6E5] rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#3A2E5C] text-xl">{icon}</span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-[#3A2E5C]/40 backdrop-blur-sm" />
          <div
            className="relative bg-[#FFFDF7] border-2 border-[#3A2E5C] rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[88vh] overflow-y-auto jelly-shadow"
            onClick={e => e.stopPropagation()}
          >
            <div className={`${selected.color} ${isIvy ? "text-white" : "text-[#3A2E5C]"} p-6 border-b-2 border-[#3A2E5C] sticky top-0 z-10`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 font-black text-xs ${isIvy ? "bg-white/10 border-white/30 text-white" : "bg-white border-[#3A2E5C] text-[#3A2E5C]"}`} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{selected.flag}</span>
                    <h2 className="font-black text-2xl" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{selected.key}</h2>
                  </div>
                  <p className={`text-sm ${isIvy ? "text-white/80" : "text-[#3A2E5C]/80"} mt-2 leading-relaxed`}>{selected.blurb}</p>
                </div>
                <button onClick={() => setSelected(null)} className={`shrink-0 ${isIvy ? "text-white/70 hover:text-white" : "text-[#3A2E5C]/60 hover:text-[#3A2E5C]"}`}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 pb-2">
              <div className="bg-[#FFC6E5]/40 border-2 border-[#3A2E5C]/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3A2E5C] shrink-0">paid</span>
                <div>
                  <p className="font-bold text-xs text-[#3A2E5C] uppercase tracking-wide mb-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Scholarship chances</p>
                  <p className="text-[#3A2E5C]/80 text-sm leading-relaxed">{selected.scholarships}</p>
                </div>
              </div>

              <p className="font-bold text-xs text-[#3A2E5C] uppercase tracking-wide mb-3" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Top colleges and fees</p>
              <div className="flex flex-col gap-3 mb-4">
                {selected.colleges.map(col => (
                  <div key={col.name} className="bg-white border-2 border-[#3A2E5C]/20 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h4 className="font-black text-[#3A2E5C] text-sm" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{col.name}</h4>
                      <span className="text-xs font-bold bg-[#AEE3FF] border border-[#3A2E5C] rounded-full px-2.5 py-0.5 text-[#3A2E5C] whitespace-nowrap" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{col.fee}</span>
                    </div>
                    <p className="text-[#4A4A4A] text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#3A2E5C]/50" style={{ fontSize: "14px" }}>school</span>
                      {col.aid}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[#4A4A4A]/60 text-[11px] pb-6 leading-relaxed">
                Fees are approximate annual tuition for international students and change yearly. Always verify exact figures and deadlines on each university official website.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
