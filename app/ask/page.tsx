"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const STARTERS = [
  "What stream should I choose after 10th?",
  "How do I get a research internship in 11th grade?",
  "What makes a great MUN delegate?",
  "How do I build a portfolio with no experience?",
  "Which fully-funded scholarships are open for Indian students?",
];

type Msg = { role: "user" | "ai"; text: string };

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hey! I am your AI consultant. Ask me anything about opportunities, career paths, scholarships, or building your portfolio. I am here to help you figure out your next move." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setAuthChecked(true);
    });
  }, []);

  async function send(text: string) {
    if (!text.trim()) return;
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "ai", text: data.reply || "Sorry, could not process that. Try again." }]);
    } catch {
      setMessages([...next, { role: "ai", text: "Something went wrong. Make sure ANTHROPIC_API_KEY is set in .env.local." }]);
    } finally {
      setLoading(false);
    }
  }

  // ── Login gate: AI consultant is for members only ──
  if (authChecked && !loggedIn) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-[#FFC6E5] rounded-3xl translate-x-3 translate-y-3 -z-10 border-2 border-[#3A2E5C]" />
            <div className="bg-[#FFFDF7] rounded-3xl border-2 border-[#3A2E5C] p-8 text-center">
              <div className="w-16 h-16 bg-[#AEE3FF] rounded-full border-2 border-[#3A2E5C] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-[#3A2E5C]">psychology</span>
              </div>
              <h1 className="font-black text-2xl text-[#3A2E5C] mb-2" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Your AI consultant awaits</h1>
              <p className="text-[#4A4A4A] text-sm mb-6">Create a free account to chat with your personal AI guide about scholarships, applications, and your next move.</p>
              <Link href="/auth?tab=signup" className="glossy-button bg-[#3A2E5C] text-white px-8 py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active inline-block mb-3" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                Sign up free
              </Link>
              <p className="text-xs text-[#4A4A4A]">Already have an account? <Link href="/auth" className="text-[#3A2E5C] font-bold hover:underline">Log in</Link></p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FFFDF7] flex flex-col">
        <div className="max-w-[800px] mx-auto w-full flex-1 flex flex-col px-4 pb-6">
          <div className="py-6 text-center">
            <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Your AI consultant</span>
            <h1 className="font-black text-[36px] text-[#3A2E5C] mt-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif', letterSpacing: "-0.01em" }}>Ask Anything</h1>
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {STARTERS.map(s => (
                <button key={s} onClick={() => send(s)} className="bg-[#F1ECF1] text-[#3A2E5C] border-2 border-[#3A2E5C]/20 hover:border-[#3A2E5C] px-4 py-2 rounded-full text-xs font-semibold transition-all" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 min-h-[300px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl border-2 text-sm leading-relaxed ${m.role === "user" ? "bg-[#3A2E5C] text-white border-[#3A2E5C] rounded-br-sm" : "bg-white border-[#3A2E5C]/20 text-[#3A2E5C] rounded-bl-sm jelly-shadow-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-[#3A2E5C]/20 rounded-2xl rounded-bl-sm px-4 py-3 jelly-shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3A2E5C] animate-pulse text-lg">more_horiz</span>
                  <span className="text-xs text-[#4A4A4A]">thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-end bg-white border-2 border-[#3A2E5C] rounded-2xl p-3 jelly-shadow">
            <textarea
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about opportunities, career paths, or studying abroad..."
              className="flex-1 resize-none outline-none text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 text-sm bg-transparent"
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} className="glossy-button bg-[#3A2E5C] text-white w-10 h-10 rounded-xl flex items-center justify-center jelly-shadow-sm jelly-active disabled:opacity-40 shrink-0">
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
          <p className="text-center text-xs text-[#4A4A4A]/50 mt-3" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>AI can make mistakes. Always verify important info.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
