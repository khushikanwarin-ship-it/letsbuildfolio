import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingGate from "@/components/LandingGate";
import Community from "@/components/Community";
import Link from "next/link";

const STREAMS = [
  {label:"STEM",icon:"biotech",bg:"bg-[#AEE3FF]"},
  {label:"Commerce",icon:"payments",bg:"bg-[#D5C6FF]"},
  {label:"Law",icon:"gavel",bg:"bg-[#FFC6E5]"},
  {label:"Humanities",icon:"theater_comedy",bg:"bg-[#AEE3FF]"},
  {label:"Impact",icon:"volunteer_activism",bg:"bg-[#FFC6E5]"},
];

const HOW = [
  {num:"1",title:"Build Profile",desc:"Tell us your stream, interests, and goals. Takes 2 minutes.",bg:"bg-[#AEE3FF]"},
  {num:"2",title:"Complete Quests",desc:"Earn XP and badges through bite-sized skill challenges.",bg:"bg-[#D5C6FF]"},
  {num:"3",title:"Get Discovered",desc:"Unlock global opportunities matched to your portfolio.",bg:"bg-[#FFC6E5]"},
];

export default function HomePage() {
  return (
    <LandingGate>
      <Navbar />
      <main className="pt-20 overflow-x-hidden">

        <section className="relative px-6 md:px-10 py-24 max-w-[1200px] mx-auto text-center">
          <div className="absolute -top-10 -left-20 w-72 h-72 bg-[#FFC6E5] rounded-full opacity-20 blur-3xl -z-10" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-[#AEE3FF] rounded-full opacity-20 blur-3xl -z-10" />
          <div className="absolute top-12 left-4 md:left-16 animate-float hidden sm:block">
            <div className="bg-[#FFFDF7] px-4 py-2 rounded-xl border-2 border-[#3A2E5C] jelly-shadow-sm sticker-rotate-neg flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3A2E5C] text-lg">star</span>
              <span className="text-[#3A2E5C] font-bold text-xs" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Lvl 12 Explorer</span>
            </div>
          </div>
          <div className="absolute bottom-16 right-4 md:right-16 animate-float-delayed hidden md:block">
            <div className="bg-[#FFC6E5] text-[#3A2E5C] px-4 py-2 rounded-xl border-2 border-[#3A2E5C] jelly-shadow-sm sticker-rotate-pos flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              <span className="font-bold text-xs" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Launch Quest</span>
            </div>
          </div>
          <h1 className="text-[48px] md:text-[64px] font-black text-[#3A2E5C] max-w-4xl mx-auto mb-6 leading-tight" style={{fontFamily:'"Bricolage Grotesque",sans-serif',letterSpacing:"-0.02em"}}>
            discover what nobody<br />told you about
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto mb-10 leading-relaxed">
            A playground for curious minds to build real portfolios, find mentors, and explore opportunities beyond the classroom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth?tab=signup" className="glossy-button bg-[#D5C6FF] text-[#3A2E5C] px-10 py-4 rounded-xl border-2 border-[#3A2E5C] font-black text-xl jelly-shadow jelly-active" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>
              Start Your Journey
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {["bg-[#AEE3FF]","bg-[#D5C6FF]","bg-[#FFC6E5]"].map((bg,i) => (
                  <div key={i} className={"w-10 h-10 rounded-full border-2 border-[#FFFDF7] "+bg+" flex items-center justify-center text-[#3A2E5C] font-bold text-xs"}>
                    {["A","B","C"][i]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#FFFDF7] bg-[#E6E1E6] flex items-center justify-center text-[#3A2E5C] font-bold text-xs">+5k</div>
              </div>
              <span className="text-[#4A4A4A] text-sm">students building</span>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 py-16 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Link href="/dashboard" className="md:col-span-8 bg-[#AEE3FF] p-6 rounded-3xl border-2 border-[#3A2E5C] jelly-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-[#3A2E5C] sticker-rotate-neg">
                  <span className="material-symbols-outlined text-[#3A2E5C] text-3xl">search</span>
                </div>
                <h3 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Discover Opportunities</h3>
                <p className="text-[#3A2E5C]/80 text-sm max-w-md">Find hackathons, internships, research roles, MUNs, and creative projects curated for students like you.</p>
              </div>
              <div className="mt-8 bg-white/60 rounded-xl border-2 border-[#3A2E5C]/30 p-4 flex gap-2 flex-wrap">
                {["Hackathon","Internship","MUN","Scholarship","Camp"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-[#3A2E5C] rounded-full text-xs font-semibold text-[#3A2E5C]" style={{fontFamily:'"Space Grotesk",sans-serif'}}>{tag}</span>
                ))}
              </div>
            </Link>
            <Link href="/quests" className="md:col-span-4 bg-[#FFC6E5] p-6 rounded-3xl border-2 border-[#3A2E5C] jelly-shadow sticker-rotate-neg hover:rotate-0 transition-all">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-[#3A2E5C]">
                <span className="material-symbols-outlined text-[#3A2E5C] text-3xl">emoji_events</span>
              </div>
              <h3 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Quests</h3>
              <p className="text-[#3A2E5C]/80 text-sm mb-6">Gamified learning paths that earn you badges and showcase skills to real mentors.</p>
              <div className="flex flex-col gap-3">
                {[{done:true,label:"Intro to Web Dev"},{done:false,label:"Portfolio Design"},{done:false,label:"Public Speaking"}].map(({done,label}) => (
                  <div key={label} className="bg-white/50 p-3 rounded-lg border border-[#3A2E5C]/20 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#3A2E5C] text-lg">{done ? "check_circle" : "lock"}</span>
                    <span className="text-xs font-semibold text-[#3A2E5C]" style={{fontFamily:'"Space Grotesk",sans-serif'}}>{label}</span>
                  </div>
                ))}
              </div>
            </Link>
            <Link href="/abroad" className="md:col-span-5 bg-[#D5C6FF] p-6 rounded-3xl border-2 border-[#3A2E5C] jelly-shadow hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-[#3A2E5C] sticker-rotate-pos">
                <span className="material-symbols-outlined text-[#3A2E5C] text-3xl">public</span>
              </div>
              <h3 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Study Abroad</h3>
              <p className="text-[#3A2E5C]/80 text-sm mb-5">Fully-funded scholarships, exchange programs, and country guides for 40+ destinations.</p>
              <div className="flex gap-2 flex-wrap">
                {["Paris","Tokyo","London","NYC"].map(c => (
                  <div key={c} className="px-3 py-1 bg-white border border-[#3A2E5C] rounded-full text-xs font-semibold text-[#3A2E5C]" style={{fontFamily:'"Space Grotesk",sans-serif'}}>{c}</div>
                ))}
              </div>
            </Link>
            <Link href="/ask" className="md:col-span-7 bg-[#ECE7EB] p-6 rounded-3xl border-2 border-[#3A2E5C] jelly-shadow flex items-center gap-6">
              <div className="flex-1">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-[#3A2E5C]">
                  <span className="material-symbols-outlined text-[#3A2E5C] text-3xl">psychology</span>
                </div>
                <h3 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Ask Anything</h3>
                <p className="text-[#4A4A4A] text-sm">Our AI Consultant (powered by Claude) helps you map your path and prep applications.</p>
              </div>
              <div className="hidden md:flex w-36 h-36 bg-white border-2 border-[#3A2E5C] rounded-full jelly-shadow-sm items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-5xl text-[#3A2E5C]">bubbles</span>
              </div>
            </Link>
          </div>
        </section>

        {/* JOIN THE COMMUNITY — placed high so visitors see it early */}
        <Community />

        <section className="bg-[#F3F3F5] py-20 px-6 md:px-10 border-y-2 border-dashed border-[#3A2E5C]/20">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="font-black text-[36px] text-[#3A2E5C] mb-4" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Pick your stream</h2>
            <p className="text-[#4A4A4A] mb-12">Everything on LetsBuildFolio is curated for your academic path.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {STREAMS.map(({label,icon,bg},i) => (
                <button key={label} className={"glossy-button "+bg+" text-[#3A2E5C] px-7 py-4 rounded-2xl border-2 border-[#3A2E5C] jelly-shadow jelly-active flex items-center gap-2 font-black text-xl "+(i%2===0?"sticker-rotate-neg":"sticker-rotate-pos")} style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>
                  <span className="material-symbols-outlined">{icon}</span>{label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 md:px-10 max-w-[1200px] mx-auto">
          <h2 className="font-black text-[36px] text-center text-[#3A2E5C] mb-16" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-0 w-full border-t-4 border-dashed border-[#3A2E5C]/20 -z-10" />
            {HOW.map(({num,title,desc,bg}) => (
              <div key={num} className="flex flex-col items-center text-center">
                <div className={"w-20 h-20 "+bg+" text-[#3A2E5C] rounded-full flex items-center justify-center font-black text-3xl border-2 border-[#3A2E5C] jelly-shadow-sm mb-6"} style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>{num}</div>
                <h4 className="font-black text-xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>{title}</h4>
                <p className="text-[#4A4A4A] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-10 pb-20">
          <div className="max-w-[1200px] mx-auto bg-[#3A2E5C] text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden jelly-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md text-center md:text-left">
                <h2 className="font-black text-[36px] text-white mb-4" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>Stay in the loop</h2>
                <p className="text-white/80 text-lg">Weekly opportunities and quest alerts in your inbox.</p>
              </div>
              <form className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                <input type="email" placeholder="you@awesome.com" required className="bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-all w-full sm:w-80" />
                <button type="submit" className="glossy-button bg-[#FFC6E5] text-[#3A2E5C] px-8 py-4 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active whitespace-nowrap" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FFFDF7] border-t-2 border-[#3A2E5C]/20">
        {[{icon:"home",label:"Home",href:"/"},{icon:"rss_feed",label:"Feed",href:"/dashboard"},{icon:"military_tech",label:"Quests",href:"/quests"},{icon:"public",label:"Abroad",href:"/abroad"},{icon:"person",label:"Me",href:"/profile"}].map(({icon,label,href}) => (
          <a key={label} href={href} className="flex flex-col items-center text-[#3A2E5C]/60 hover:text-[#3A2E5C]">
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-[10px] font-semibold" style={{fontFamily:'"Space Grotesk",sans-serif'}}>{label}</span>
          </a>
        ))}
      </div>
    </LandingGate>
  );
}
