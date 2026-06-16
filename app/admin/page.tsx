"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const TYPES = ["Hackathon", "Internship", "MUN", "Scholarship", "Quest", "Camp"];
const STREAMS = ["All", "STEM", "Commerce", "Law", "Humanities", "Impact"];

const EMPTY = {
  title: "", type: "Hackathon", stream: "All", description: "",
  deadline: "", organiser: "", location: "", apply_url: "", is_featured: false,
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [form, setForm] = useState({ ...EMPTY });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string | boolean) { setForm({ ...form, [k]: v }); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(""); setErr("");
    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(`Added "${form.title}"! Add another or check the feed.`);
      setForm({ ...EMPTY });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm";
  const label = "block text-xs font-bold text-[#3A2E5C] mb-1";

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[700px] mx-auto pb-20">
        <h1 className="font-black text-[36px] text-[#3A2E5C] mb-1" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Admin · Add Opportunity</h1>
        <p className="text-[#4A4A4A] text-sm mb-8">Add new opportunities to the Discovery Feed. Enter your admin password once.</p>

        {msg && <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4 text-green-700 text-sm">{msg}</div>}
        {err && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{err}</div>}

        <form onSubmit={submit} className="flex flex-col gap-4 bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow">
          <div>
            <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Admin password</label>
            <input type="password" required value={secret} onChange={e => setSecret(e.target.value)} placeholder="Your ADMIN_SECRET" className={input} />
          </div>
          <hr className="border-[#3A2E5C]/10" />
          <div>
            <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Title *</label>
            <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="Smart India Hackathon 2026" className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Type *</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} className={input}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Stream</label>
              <select value={form.stream} onChange={e => set("stream", e.target.value)} className={input}>
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="What is this opportunity about?" className={input + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className={input} />
            </div>
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Organiser</label>
              <input value={form.organiser} onChange={e => set("organiser", e.target.value)} placeholder="Govt of India" className={input} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Location</label>
              <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Pan-India / Remote" className={input} />
            </div>
            <div>
              <label className={label} style={{ fontFamily: '"Space Grotesk",sans-serif' }}>Apply URL</label>
              <input value={form.apply_url} onChange={e => set("apply_url", e.target.value)} placeholder="https://..." className={input} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#3A2E5C] font-semibold cursor-pointer" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} className="w-4 h-4 accent-[#3A2E5C]" />
            Feature this on the feed
          </label>
          <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-4 rounded-xl font-bold text-sm jelly-shadow jelly-active mt-2 disabled:opacity-60" style={{ fontFamily: '"Space Grotesk",sans-serif' }}>
            {loading ? "Adding..." : "Add Opportunity"}
          </button>
        </form>
      </main>
    </>
  );
}
