import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SOCIAL, isSet } from "@/lib/links";

export const metadata = {
  title: "Where are you really at? — LetsBuildFolio",
  description: "A no-judgment realtalk check. Tell me what's actually going on in your head.",
};

export default function RealtalkPage() {
  const formUrl = SOCIAL.realtalkForm;

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-4 sm:px-6 md:px-10 max-w-[760px] mx-auto pb-24">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Realtalk check</span>
          <h1 className="font-black text-[34px] md:text-[44px] text-[#3A2E5C] mt-1 mb-4 leading-tight" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>
            Where are you really at?
          </h1>
          <div className="bg-[#D5C6FF] border-2 border-[#3A2E5C] rounded-2xl p-5 jelly-shadow-sm">
            <p className="text-[#3A2E5C] leading-relaxed text-sm md:text-base">
              No judgment here. No right answers. I&apos;m building lets.buildfolio to help students find the stuff nobody tells us about — but first I actually wanna know what&apos;s going on in your head. Be real, it stays between us. 🤝
            </p>
          </div>
        </div>

        {isSet(formUrl) ? (
          /* Embedded Google Form */
          <div className="bg-white border-2 border-[#3A2E5C] rounded-3xl overflow-hidden jelly-shadow">
            <iframe
              src={formUrl}
              title="Realtalk check"
              className="w-full"
              style={{ height: "2200px", border: "none" }}
              loading="lazy"
            >
              Loading the form…
            </iframe>
          </div>
        ) : (
          /* Placeholder until the form link is added */
          <div className="bg-[#AEE3FF] border-2 border-[#3A2E5C] rounded-3xl p-8 md:p-10 text-center jelly-shadow">
            <span className="material-symbols-outlined text-4xl text-[#3A2E5C] mb-3 block">edit_note</span>
            <h2 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>The form is on its way</h2>
            <p className="text-[#3A2E5C]/80 text-sm max-w-md mx-auto">
              I&apos;m setting up the realtalk check right now. Check back in a moment — it&apos;ll live right here.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
