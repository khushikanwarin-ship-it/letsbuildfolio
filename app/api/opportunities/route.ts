import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stream = searchParams.get("stream");
    const type = searchParams.get("type");
    const q = searchParams.get("q");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === "your-supabase-project-url-here") {
      // Return mock data if Supabase not configured
      return NextResponse.json({ opportunities: MOCK });
    }

    const supabase = createServerSupabase();
    let query = supabase.from("opportunities").select("*").order("is_featured", { ascending: false }).order("deadline", { ascending: true });

    if (stream && stream !== "All") query = query.or(`stream.eq.${stream},stream.eq.All`);
    if (type && type !== "All") query = query.eq("type", type);
    if (q) query = query.ilike("title", `%${q}%`);

    const { data, error } = await query.limit(50);
    if (error) return NextResponse.json({ opportunities: MOCK });
    return NextResponse.json({ opportunities: data?.length ? data : MOCK });
  } catch {
    return NextResponse.json({ opportunities: MOCK });
  }
}

const MOCK = [
  { id: "1", title: "Smart India Hackathon 2025", type: "Hackathon", stream: "STEM", description: "India biggest hackathon for college students. Build solutions for real government challenges.", deadline: "2025-08-15", organiser: "Govt of India", location: "Pan-India", apply_url: "#", is_featured: true },
  { id: "2", title: "Harvard WorldMUN 2025", type: "MUN", stream: "Law", description: "One of the most prestigious Model UN conferences in the world. Open to all streams.", deadline: "2025-09-01", organiser: "Harvard University", location: "Boston, USA", apply_url: "#", is_featured: true },
  { id: "3", title: "NMIMS Summer Internship", type: "Internship", stream: "Commerce", description: "Paid summer internship programme at NMIMS for Finance and Marketing students.", deadline: "2025-07-30", organiser: "NMIMS", location: "Mumbai", apply_url: "#", is_featured: false },
  { id: "4", title: "Chevening Scholarship 2025", type: "Scholarship", stream: "All", description: "Fully-funded UK government scholarship for outstanding students from India.", deadline: "2025-11-05", organiser: "UK Government", location: "United Kingdom", apply_url: "#", is_featured: true },
  { id: "5", title: "Google Summer of Code", type: "Internship", stream: "STEM", description: "Contribute to open-source projects and get paid. Open to students worldwide.", deadline: "2025-04-02", organiser: "Google", location: "Remote", apply_url: "#", is_featured: false },
  { id: "6", title: "TEDx Youth Speaker Quest", type: "Quest", stream: "Humanities", description: "Complete the public speaking quest and get shortlisted to speak at TEDx Youth events.", deadline: "2025-10-01", organiser: "TED", location: "Various", apply_url: "#", is_featured: false },
  { id: "7", title: "DAAD Scholarship Germany", type: "Scholarship", stream: "STEM", description: "Fully-funded scholarship to study or research in Germany. Multiple programs available.", deadline: "2025-10-15", organiser: "DAAD", location: "Germany", apply_url: "#", is_featured: false },
  { id: "8", title: "iGEM Synthetic Biology", type: "Hackathon", stream: "STEM", description: "International Genetically Engineered Machine competition. Build biotech solutions.", deadline: "2025-06-30", organiser: "iGEM Foundation", location: "Paris, France", apply_url: "#", is_featured: false },
  { id: "9", title: "Young India Fellowship", type: "Scholarship", stream: "Humanities", description: "One-year postgraduate diploma at Ashoka University. Fully subsidised for merit students.", deadline: "2025-12-01", organiser: "Ashoka University", location: "Sonipat", apply_url: "#", is_featured: false },
  { id: "10", title: "Internshala Social Internship", type: "Internship", stream: "Impact", description: "Work with NGOs across India on education, environment and health projects.", deadline: "2025-07-01", organiser: "Internshala", location: "Remote", apply_url: "#", is_featured: false },
  { id: "11", title: "MEXT Scholarship Japan", type: "Scholarship", stream: "All", description: "Japanese government scholarship covering tuition, accommodation and monthly stipend.", deadline: "2025-05-31", organiser: "Japanese Government", location: "Japan", apply_url: "#", is_featured: false },
  { id: "12", title: "National Law Olympiad", type: "MUN", stream: "Law", description: "Competitive legal olympiad for school students. Win scholarships and internships.", deadline: "2025-08-20", organiser: "NLO India", location: "Pan-India", apply_url: "#", is_featured: false },
];
