import Link from "next/link";
import { SOCIAL, href, isSet } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="bg-[#F1ECF1] border-t-4 border-double border-[#3A2E5C]/20 py-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start gap-10">
        <div>
          <div className="font-black text-3xl text-[#3A2E5C] mb-2" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>LetsBuildFolio</div>
          <p className="text-[#4A4A4A] text-sm max-w-xs mb-4">Building the digital workspace for the next generation of builders.</p>
          {/* Social icons */}
          <div className="flex gap-3">
            <a href={href(SOCIAL.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className={`w-10 h-10 rounded-xl bg-[#3A2E5C] text-white flex items-center justify-center border-2 border-[#3A2E5C] jelly-shadow-sm jelly-active ${!isSet(SOCIAL.instagram) ? "opacity-50 pointer-events-none" : ""}`}>
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </a>
            <a href={href(SOCIAL.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className={`w-10 h-10 rounded-xl bg-[#25D366] text-[#0a3d1f] flex items-center justify-center border-2 border-[#3A2E5C] jelly-shadow-sm jelly-active ${!isSet(SOCIAL.whatsapp) ? "opacity-50 pointer-events-none" : ""}`}>
              <span className="material-symbols-outlined text-xl">chat</span>
            </a>
          </div>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-[#3A2E5C] font-bold text-xs uppercase tracking-widest" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Platform</span>
            <Link href="/dashboard" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">Opportunities</Link>
            <Link href="/quests" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">Quests</Link>
            <Link href="/abroad" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">Abroad</Link>
            <Link href="/ask" className="text-[#4A4A4A] hover:text-[#3A2E5C] text-sm">Ask AI</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[#3A2E5C] font-bold text-xs uppercase tracking-widest" style={{fontFamily:'"Space Grotesk",sans-serif'}}>Community</span>
            <a href={href(SOCIAL.instagram)} target="_blank" rel="noopener noreferrer" className={`text-[#4A4A4A] hover:text-[#3A2E5C] text-sm ${!isSet(SOCIAL.instagram) ? "opacity-50 pointer-events-none" : ""}`}>Instagram</a>
            <a href={href(SOCIAL.whatsapp)} target="_blank" rel="noopener noreferrer" className={`text-[#4A4A4A] hover:text-[#3A2E5C] text-sm ${!isSet(SOCIAL.whatsapp) ? "opacity-50 pointer-events-none" : ""}`}>WhatsApp Group</a>
            <a href={href(SOCIAL.submitForm)} target="_blank" rel="noopener noreferrer" className={`text-[#4A4A4A] hover:text-[#3A2E5C] text-sm ${!isSet(SOCIAL.submitForm) ? "opacity-50 pointer-events-none" : ""}`}>Submit an opportunity</a>
          </div>
        </div>
        <div className="text-[#4A4A4A] text-xs">© 2026 LetsBuildFolio</div>
      </div>
    </footer>
  );
}
