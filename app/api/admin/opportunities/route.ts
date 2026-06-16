import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, stream, description, deadline, organiser, location, apply_url, is_featured } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required." }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { error } = await supabase.from("opportunities").insert({
      title, type,
      stream: stream || "All",
      description: description || "",
      deadline: deadline || null,
      organiser: organiser || "",
      location: location || "",
      apply_url: apply_url || "#",
      is_featured: !!is_featured,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
