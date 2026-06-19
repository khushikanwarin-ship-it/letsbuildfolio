"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { supabase } from "@/lib/supabase";

export default function GuidesGrid() {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {GUIDES.map((g, i) => (
        <Link
          key={g.slug}
          href={loggedIn ? `/resources/${g.slug}` : "/auth?tab=signup"}
          className={`${g.color} border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform ${i % 2 === 0 ? "sticker-rotate-neg hover:rotate-0" : "sticker-rotate-pos hover:rotate-0"}`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-[#3A2E5C]">
                <span className="material-symbols-outlined text-[#3A2E5C] text-2xl">{g.icon}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-[#3A2E5C] bg-white text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{g.category}</span>
            </div>
            <h3 className="font-black text-xl text-[#3A2E5C] mb-2 leading-snug" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{g.title}</h3>
            <p className="text-[#3A2E5C]/75 text-sm">{g.excerpt}</p>
          </div>
          <div className="flex items-center justify-between mt-5">
            <span className="text-xs text-[#3A2E5C]/60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>{g.readTime}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#3A2E5C]" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
              {loggedIn ? "Read" : "Sign up to read"} <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{loggedIn ? "arrow_forward" : "lock"}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
