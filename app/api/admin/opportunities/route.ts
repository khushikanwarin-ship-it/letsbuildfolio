import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

function checkSecret(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret && secret === process.env.ADMIN_SECRET;
}

// LIST all opportunities (admin)
export async function GET(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ opportunities: data });
  } catch (err) {
    console.error("Admin GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// CREATE
export async function POST(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  try {
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
    console.error("Admin POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// UPDATE
export async function PATCH(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, title, type, stream, description, deadline, organiser, location, apply_url, is_featured } = body;
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required." }, { status: 400 });
    }
    const supabase = createServerSupabase();
    const { error } = await supabase.from("opportunities").update({
      title, type,
      stream: stream || "All",
      description: description || "",
      deadline: deadline || null,
      organiser: organiser || "",
      location: location || "",
      apply_url: apply_url || "#",
      is_featured: !!is_featured,
    }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    const supabase = createServerSupabase();
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
