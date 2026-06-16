import { NextRequest, NextResponse } from "next/server";

const SYSTEM = "You are an expert career and opportunity consultant for Indian students aged 14-22. You help students discover hackathons, internships, scholarships, MUNs, research opportunities, and study abroad programs. Give practical, encouraging, specific advice. Keep responses concise and friendly. Use bullet points where helpful. Always end with a concrete next step the student can take today.";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      return NextResponse.json({
        reply: "The AI consultant is not configured yet. Add your GEMINI_API_KEY to the .env.local file. Get a free key at aistudio.google.com",
      });
    }

    // Build Gemini contents array (skip the first AI greeting)
    const contents = (history || [])
      .filter((_: unknown, idx: number) => idx > 0)
      .map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    if (message) contents.push({ role: "user", parts: [{ text: message }] });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const data = await res.json();
    if (data.error) {
      console.error("Gemini error:", data.error);
      return NextResponse.json({ reply: `AI error: ${data.error.message}` });
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, could not generate a response.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json({ reply: "Something went wrong. Please try again." });
  }
}
