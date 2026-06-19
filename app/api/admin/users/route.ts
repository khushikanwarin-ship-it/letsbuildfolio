import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  try {
    const supabase = createServerSupabase();

    // Profile data (name, grade, stream, xp, signup date)
    const { data: profs, error } = await supabase
      .from("profiles")
      .select("id, name, email, grade, stream, xp, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Auth data for last_sign_in_at
    const lastById: Record<string, string | null> = {};
    try {
      const { data: authList } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      authList.users.forEach(u => { lastById[u.id] = u.last_sign_in_at ?? null; });
    } catch (e) {
      console.error("listUsers failed:", e);
    }

    const users = (profs || []).map(p => ({ ...p, last_sign_in_at: lastById[p.id] ?? null }));
    return NextResponse.json({ users });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
