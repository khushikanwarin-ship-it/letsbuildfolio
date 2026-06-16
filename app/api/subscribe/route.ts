import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email;
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const supabase = createServerSupabase();
    const { error } = await supabase.from("email_subscribers").insert({ email: email.toLowerCase().trim(), subscribed_at: new Date().toISOString() });
    if (error && error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
