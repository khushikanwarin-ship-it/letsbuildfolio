"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    { role: "ai", text: "Hey! I am your AI consultant powered by Claude. Ask me anything about opportunities, career paths, scholarships, or building your portfolio. I am here to help you figure out your next move." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FFFDF7] flex flex-col">
        <div className="max-w-[800px] mx-auto w-full flex-1 flex flex-col px-4 pb-6">
          <div className="py-6 text-center">
            <span className="text-xs font-bold text-[#3A2E5C]/50 uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Powered by Claude</span>
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
