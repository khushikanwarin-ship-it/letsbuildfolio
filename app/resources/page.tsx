import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidesGrid from "@/components/GuidesGrid";

export const metadata = {
  title: "Guides & Resources — LetsBuildFolio",
  description: "Practical guides for students: SOPs, cold-emailing professors, scholarships, hackathons, MUNs and more.",
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[1200px] mx-auto pb-24">
        <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Learn the ropes</span>
        <h1 className="font-black text-[40px] text-[#3A2E5C] mb-2 mt-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>Guides & Resources</h1>
        <p className="text-[#4A4A4A] max-w-2xl mb-10">No-fluff guides to help you actually win opportunities — written for students aged 14-22.</p>

        <GuidesGrid />
      </main>
      <Footer />
    </>
  );
}
