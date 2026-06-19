import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideGate from "@/components/GuideGate";
import { GUIDES } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find(g => g.slug === slug);
  if (!guide) return { title: "Guide — LetsBuildFolio" };
  return { title: `${guide.title} — LetsBuildFolio`, description: guide.excerpt };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find(g => g.slug === slug);
  if (!guide) notFound();

  const related = GUIDES.filter(g => g.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[760px] mx-auto pb-24">
        <Link href="/resources" className="inline-flex items-center gap-1 text-[#3A2E5C] font-bold text-sm hover:underline mb-6" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span> All guides
        </Link>

        {/* Header */}
        <div className={`${guide.color} border-2 border-[#3A2E5C] rounded-3xl p-6 md:p-8 jelly-shadow mb-8`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C]">
              <span className="material-symbols-outlined text-[#3A2E5C]">{guide.icon}</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-[#3A2E5C] bg-white text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{guide.category}</span>
            <span className="text-xs text-[#3A2E5C]/60 ml-auto" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{guide.readTime}</span>
          </div>
          <h1 className="font-black text-3xl md:text-4xl text-[#3A2E5C] leading-tight" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.02em" }}>{guide.title}</h1>
        </div>

        {/* Body (members only) */}
        <GuideGate>
        <article className="flex flex-col gap-5">
          {guide.blocks.map((b, i) => (
            <div key={i}>
              {b.h && <h2 className="font-black text-xl text-[#3A2E5C] mb-2 mt-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{b.h}</h2>}
              {b.p && <p className="text-[#3A2E5C]/85 leading-relaxed">{b.p}</p>}
              {b.list && (
                <ul className="flex flex-col gap-2 mt-2">
                  {b.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-[#3A2E5C]/85">
                      <span className="material-symbols-outlined text-[#3A2E5C] shrink-0" style={{ fontSize: "18px" }}>check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>
        </GuideGate>

        {/* CTA */}
        <div className="bg-[#3A2E5C] text-white rounded-3xl p-6 md:p-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 jelly-shadow">
          <div>
            <h3 className="font-black text-xl mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Ready to put this into action?</h3>
            <p className="text-white/70 text-sm">Browse 300+ opportunities matched to you.</p>
          </div>
          <Link href="/dashboard" className="glossy-button bg-[#FFC6E5] text-[#3A2E5C] px-6 py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active whitespace-nowrap" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
            Explore opportunities
          </Link>
        </div>

        {/* Related */}
        <h3 className="font-black text-xl text-[#3A2E5C] mt-14 mb-4" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Keep reading</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map(g => (
            <Link key={g.slug} href={`/resources/${g.slug}`} className={`${g.color} border-2 border-[#3A2E5C] rounded-2xl p-5 jelly-shadow-sm hover:-translate-y-0.5 transition-transform`}>
              <span className="material-symbols-outlined text-[#3A2E5C] mb-2 block">{g.icon}</span>
              <h4 className="font-black text-[#3A2E5C] text-sm leading-snug" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{g.title}</h4>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
