import { SOCIAL, href, isSet } from "@/lib/links";

export default function Community() {
  return (
    <section className="px-6 md:px-10 pb-8">
      <div className="max-w-[1200px] mx-auto bg-[#AEE3FF] border-2 border-[#3A2E5C] rounded-[3rem] p-10 md:p-16 jelly-shadow text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FFC6E5] rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-[#D5C6FF] rounded-full opacity-30 blur-3xl" />
        <div className="relative z-10">
          <span className="text-xs font-bold text-[#3A2E5C]/60 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>You are not alone</span>
          <h2 className="font-black text-[34px] md:text-[40px] text-[#3A2E5C] mt-2 mb-3" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.01em" }}>
            Join the community
          </h2>
          <p className="text-[#3A2E5C]/80 max-w-xl mx-auto mb-8">
            Connect with other student builders, swap scholarship tips and deadlines, share your ideas, and get help on your applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Instagram */}
            <a
              href={href(SOCIAL.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className={`glossy-button bg-[#3A2E5C] text-white px-7 py-4 rounded-2xl border-2 border-[#3A2E5C] font-bold text-base jelly-shadow jelly-active flex items-center gap-2 ${!isSet(SOCIAL.instagram) ? "opacity-60 pointer-events-none" : ""}`}
              style={{ fontFamily: '"Space Grotesk",sans-serif' }}
            >
              <span className="material-symbols-outlined">photo_camera</span>
              Follow on Instagram
              {!isSet(SOCIAL.instagram) && <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">soon</span>}
            </a>

            {/* WhatsApp */}
            <a
              href={href(SOCIAL.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={`glossy-button bg-[#25D366] text-[#0a3d1f] px-7 py-4 rounded-2xl border-2 border-[#3A2E5C] font-bold text-base jelly-shadow jelly-active flex items-center gap-2 ${!isSet(SOCIAL.whatsapp) ? "opacity-60 pointer-events-none" : ""}`}
              style={{ fontFamily: '"Space Grotesk",sans-serif' }}
            >
              <span className="material-symbols-outlined">chat</span>
              Join our WhatsApp
              {!isSet(SOCIAL.whatsapp) && <span className="text-[10px] bg-black/10 rounded-full px-2 py-0.5">soon</span>}
            </a>
          </div>

          {/* Submit idea / opportunity */}
          <p className="text-[#3A2E5C]/70 text-sm mt-8">
            Know an opportunity we are missing?{" "}
            <a
              href={href(SOCIAL.submitForm)}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold underline ${!isSet(SOCIAL.submitForm) ? "opacity-60 pointer-events-none" : ""}`}
            >
              Submit it here{!isSet(SOCIAL.submitForm) && " (soon)"}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
