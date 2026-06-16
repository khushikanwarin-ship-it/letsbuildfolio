"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const TYPES = ["Hackathon", "Internship", "MUN", "Scholarship", "Quest", "Camp"];
const STREAMS = ["All", "STEM", "Commerce", "Law", "Humanities", "Impact"];

type Opp = {
  id?: string;
  title: string; type: string; stream: string; description: string;
  deadline: string; organiser: string; location: string; apply_url: string; is_featured: boolean;
};

const EMPTY: Opp = {
  title: "", type: "Hackathon", stream: "All", description: "",
  deadline: "", organiser: "", location: "", apply_url: "", is_featured: false,
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [list, setList] = useState<Opp[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Opp>({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: keyof Opp, v: string | boolean) { setForm({ ...form, [k]: v }); }

  async function loadList(pw: string) {
    const res = await fetch("/api/admin/opportunities", { headers: { "x-admin-secret": pw } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load");
    setList(data.opportunities || []);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await loadList(secret);
      setAuthed(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function startAdd() {
    setForm({ ...EMPTY }); setEditingId(null); setShowForm(true); setMsg(""); setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(o: Opp) {
    setForm({
      title: o.title, type: o.type, stream: o.stream || "All", description: o.description || "",
      deadline: o.deadline ? o.deadline.slice(0, 10) : "", organiser: o.organiser || "",
      location: o.location || "", apply_url: o.apply_url || "", is_featured: !!o.is_featured,
    });
    setEditingId(o.id || null); setShowForm(true); setMsg(""); setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(""); setErr("");
    try {
      const method = editingId ? "PATCH" : "POST";
      const payload = editingId ? { ...form, id: editingId } : form;
      const res = await fetch("/api/admin/opportunities", {
        method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(editingId ? `Updated "${form.title}"` : `Added "${form.title}"`);
      setForm({ ...EMPTY }); setEditingId(null); setShowForm(false);
      await loadList(secret);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(o: Opp) {
    if (!o.id) return;
    if (!confirm(`Delete "${o.title}"? This cannot be undone.`)) return;
    setErr(""); setMsg("");
    try {
      const res = await fetch(`/api/admin/opportunities?id=${o.id}`, {
        method: "DELETE", headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(`Deleted "${o.title}"`);
      setList(list.filter(x => x.id !== o.id));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  const input = "w-full bg-white border-2 border-[#3A2E5C]/30 focus:border-[#3A2E5C] rounded-xl px-4 py-3 text-[#3A2E5C] placeholder:text-[#4A4A4A]/40 outline-none text-sm";
  const label = "block text-xs font-bold text-[#3A2E5C] mb-1";
  const labelStyle = { fontFamily: '"Space Grotesk",sans-serif' };

  // ---- Login gate ----
  if (!authed) {
    return (
      <>
        <Navbar />
        <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 flex flex-col items-center">
          <div className="w-full max-w-sm mt-10">
            <h1 className="font-black text-3xl text-[#3A2E5C] mb-2 text-center" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Admin Login</h1>
            <p className="text-[#4A4A4A] text-sm mb-6 text-center">Enter your admin password to manage opportunities.</p>
            {err && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{err}</div>}
            <form onSubmit={unlock} className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow flex flex-col gap-4">
              <input type="password" required value={secret} onChange={e => setSecret(e.target.value)} placeholder="Admin password" className={input} autoFocus />
              <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active disabled:opacity-60" style={labelStyle}>
                {loading ? "Checking..." : "Unlock"}
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  // ---- Management UI ----
  const filtered = list.filter(o => o.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FFFDF7] px-6 md:px-10 max-w-[900px] mx-auto pb-20">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="font-black text-3xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>Manage Opportunities</h1>
            <p className="text-[#4A4A4A] text-sm">{list.length} total in your feed</p>
          </div>
          <button onClick={startAdd} className="glossy-button bg-[#3A2E5C] text-white text-sm font-bold px-5 py-2.5 rounded-xl jelly-shadow-sm jelly-active flex items-center gap-1 shrink-0" style={labelStyle}>
            <span className="material-symbols-outlined text-lg">add</span> Add new
          </button>
        </div>

        {msg && <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4 text-green-700 text-sm">{msg}</div>}
        {err && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">{err}</div>}

        {/* Add / Edit form */}
        {showForm && (
          <form onSubmit={submit} className="bg-[#F1ECF1] border-2 border-[#3A2E5C] rounded-3xl p-6 jelly-shadow flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xl text-[#3A2E5C]" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{editingId ? "Edit opportunity" : "Add opportunity"}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-[#3A2E5C]/60 hover:text-[#3A2E5C]"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div>
              <label className={label} style={labelStyle}>Title *</label>
              <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="Opportunity name" className={input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label} style={labelStyle}>Type *</label>
                <select value={form.type} onChange={e => set("type", e.target.value)} className={input}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={label} style={labelStyle}>Stream</label>
                <select value={form.stream} onChange={e => set("stream", e.target.value)} className={input}>
                  {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={label} style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="What is this about?" className={input + " resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label} style={labelStyle}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className={input} />
              </div>
              <div>
                <label className={label} style={labelStyle}>Organiser</label>
                <input value={form.organiser} onChange={e => set("organiser", e.target.value)} placeholder="Who runs it" className={input} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label} style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="India / Remote..." className={input} />
              </div>
              <div>
                <label className={label} style={labelStyle}>Apply URL</label>
                <input value={form.apply_url} onChange={e => set("apply_url", e.target.value)} placeholder="https://..." className={input} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#3A2E5C] font-semibold cursor-pointer" style={labelStyle}>
              <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} className="w-4 h-4 accent-[#3A2E5C]" />
              Feature on the feed
            </label>
            <button type="submit" disabled={loading} className="glossy-button bg-[#3A2E5C] text-white py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active disabled:opacity-60" style={labelStyle}>
              {loading ? "Saving..." : editingId ? "Save changes" : "Add opportunity"}
            </button>
          </form>
        )}

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border-2 border-[#3A2E5C] rounded-2xl px-4 py-3 jelly-shadow-sm mb-5">
          <span className="material-symbols-outlined text-[#3A2E5C]/50">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities to edit or delete..." className="flex-1 outline-none text-[#3A2E5C] text-sm bg-transparent" />
          {search && <button onClick={() => setSearch("")}><span className="material-symbols-outlined text-[#4A4A4A]/50">close</span></button>}
        </div>

        {/* List */}
        <p className="text-xs text-[#4A4A4A]/60 mb-3" style={labelStyle}>{filtered.length} shown</p>
        <div className="flex flex-col gap-2">
          {filtered.map(o => (
            <div key={o.id} className="bg-white border-2 border-[#3A2E5C]/15 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-[#3A2E5C]/40 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3A2E5C] bg-[#F1ECF1] text-[#3A2E5C]" style={labelStyle}>{o.type}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3A2E5C]/30 text-[#3A2E5C]/70" style={labelStyle}>{o.stream}</span>
                  {o.is_featured && <span className="material-symbols-outlined text-[#3A2E5C]" style={{ fontSize: "16px" }}>star</span>}
                </div>
                <h3 className="font-bold text-sm text-[#3A2E5C] truncate" style={{ fontFamily: '"Bricolage Grotesque",sans-serif' }}>{o.title}</h3>
                <p className="text-[#4A4A4A]/60 text-xs truncate">{o.organiser}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(o)} className="p-2 rounded-lg border-2 border-[#3A2E5C]/20 text-[#3A2E5C] hover:bg-[#AEE3FF] hover:border-[#3A2E5C] transition-all" title="Edit">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => remove(o)} className="p-2 rounded-lg border-2 border-[#3A2E5C]/20 text-[#3A2E5C] hover:bg-red-100 hover:border-red-400 hover:text-red-600 transition-all" title="Delete">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-[#4A4A4A]/50 text-sm py-10">No opportunities match your search.</p>
          )}
        </div>
      </main>
    </>
  );
}
