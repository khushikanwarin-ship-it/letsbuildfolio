import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F1ECF1] border-t-4 border-double border-[#3A2E5C]/20 py-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start gap-10">
        <div>
          <div className="font-black text-3xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>LetsBuildFolio</div>
          <p className="text-[#4A4A4A] text-sm max-w-xs">Building the digital workspace for the next generation of builders.</p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-[#3A2E5C] font-bold text-xs uppercase tracking-widest" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Platform</span>
            {["Opportunities","Quests","Abroad","Ask AI"].map(l => (
              <Link key={l} href="#" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">{l}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[#3A2E5C] font-bold text-xs uppercase tracking-widest" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Legal</span>
            {["Privacy","Terms","Safety"].map(l => (
              <Link key={l} href="#" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">{l}</Link>
            ))}
          </div>
        </div>
        <div className="text-[#4A4A4A] text-xs">2024 LetsBuildFolio</div>
      </div>
    </footer>
  );
}
