import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COUNTRIES = [
  { name: "United Kingdom", flag: "UK", programs: 12, color: "bg-[#AEE3FF]", highlight: "Chevening Scholarship" },
  { name: "United States", flag: "US", programs: 18, color: "bg-[#D5C6FF]", highlight: "Fulbright Program" },
  { name: "Germany", flag: "DE", programs: 9, color: "bg-[#FFC6E5]", highlight: "DAAD Scholarship" },
  { name: "Japan", flag: "JP", programs: 11, color: "bg-[#AEE3FF]", highlight: "MEXT Scholarship" },
  { name: "France", flag: "FR", programs: 7, color: "bg-[#FFC6E5]", highlight: "Eiffel Excellence" },
  { name: "Singapore", flag: "SG", programs: 8, color: "bg-[#D5C6FF]", highlight: "NUS/NTU Scholarships" },
];

const TIPS = [
  { icon: "edit_note", tip: "Start your SOP drafts 6 months before the deadline" },
  { icon: "translate", tip: "Most fully-funded programs need no IELTS if your medium of instruction was English" },
  { icon: "volunteer_activism", tip: "Extracurriculars matter more than GPA in many international programs" },
  { icon: "currency_exchange", tip: "Look for programs that cover visa + travel + stipend, not just tuition" },
];

export default function AbroadPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] pb-24">
        <section className="px-6 md:px-10 max-w-[1200px] mx-auto mb-16">
          <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Global opportunities</span>
          <h1 className="font-black text-[40px] text-[#3A2E5C] mb-2 mt-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>Study Abroad</h1>
          <p className="text-[#4A4A4A] max-w-2xl mb-10">Fully-funded scholarships, exchange programs, and country guides curated for Indian students aged 14-22.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[{ n: "40+", l: "Countries" }, { n: "200+", l: "Programs" }, { n: "100%", l: "Free listings" }, { n: "14-22", l: "Age range" }].map(({ n, l }) => (
              <div key={l} className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-2xl p-5 text-center jelly-shadow-sm">
                <div className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{n}</div>
                <div className="text-xs font-semibold text-[#4A4A4A] mt-1" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{l}</div>
              </div>
            ))}
          </div>

          <h2 className="font-black text-2xl text-[#3A2E5C] mb-6" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Browse by country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTRIES.map((c, i) => (
              <div key={c.name} className={`${c.color} border-2 border-[#3A2E5C] rounded-2xl p-5 jelly-shadow hover:-translate-y-1 transition-transform cursor-pointer ${i % 2 === 0 ? "sticker-rotate-neg hover:rotate-0" : "sticker-rotate-pos hover:rotate-0"}`}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C] mb-3 font-black text-sm text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{c.flag}</div>
                <h3 className="font-black text-xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{c.name}</h3>
                <p className="text-[#3A2E5C]/70 text-xs mb-3">{c.programs} programs available</p>
                <span className="text-xs font-bold bg-white border border-[#3A2E5C] rounded-full px-3 py-1 text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Top: {c.highlight}</span>
              </div>
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
    </>
  );
}
