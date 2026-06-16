import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, grade } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password required." }, { status: 400 });
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "your-supabase-project-url-here") {
      const { createServerSupabase } = await import("@/lib/supabase-server");
      const supabase = createServerSupabase();
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { name, grade },
      });
      if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });
      await supabase.from("profiles").insert({ id: authData.user.id, name, email, grade, created_at: new Date().toISOString() });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
