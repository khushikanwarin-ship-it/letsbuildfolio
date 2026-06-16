import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = createServerSupabase();

    // Pull name/grade from the user's auth metadata
    const { data: u, error: uErr } = await supabase.auth.admin.getUserById(id);
    if (uErr || !u.user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const meta = u.user.user_metadata || {};
    // Insert only if missing (don't clobber existing xp/bio)
    await supabase.from("profiles").upsert(
      {
        id,
        name: meta.name || u.user.email?.split("@")[0] || "Builder",
        email: u.user.email,
        grade: meta.grade || null,
        created_at: new Date().toISOString(),
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ensure-profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
