export type Block = { h?: string; p?: string; list?: string[] };

export type Guide = {
  slug: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  excerpt: string;
  readTime: string;
  blocks: Block[];
};

export const GUIDES: Guide[] = [
  {
    slug: "write-a-standout-sop",
    title: "How to Write a Standout SOP",
    category: "Applications",
    icon: "edit_note",
    color: "bg-[#AEE3FF]",
    excerpt: "A Statement of Purpose is your story, not your resume. Here's how to make admissions officers remember you.",
    readTime: "6 min read",
    blocks: [
      { p: "Your SOP (Statement of Purpose) answers one question: why you, why this program, why now? It is the one place you control the narrative, so don't waste it listing achievements they can already see on your resume." },
      { h: "Start with a hook, not a cliche", p: "Skip 'Since childhood I have been fascinated by...'. Open with a specific moment, project, or question that genuinely pulled you toward this field. Concrete beats grand every time." },
      { h: "Show a throughline", p: "Great SOPs feel inevitable. Connect your past (what sparked the interest), present (what you've done about it), and future (what you want to build) into one clear arc." },
      { h: "Be specific about the program", list: [
        "Name 1-2 professors whose work excites you and why.",
        "Mention specific courses, labs, or resources you'd use.",
        "Avoid lines that could be pasted into any other application.",
      ] },
      { h: "Edit ruthlessly", p: "Write a messy first draft, then cut 20%. Every sentence should earn its place. Read it aloud — if you stumble, rewrite it. Get two people to read it: one who knows you, one who doesn't." },
      { p: "Start drafting at least 6 weeks before the deadline. The best SOPs go through 4-5 rounds of edits." },
    ],
  },
  {
    slug: "cold-email-professors",
    title: "Cold-Emailing Professors for Research",
    category: "Research",
    icon: "mail",
    color: "bg-[#D5C6FF]",
    excerpt: "You don't need connections to get a research role — you need a sharp, specific email. Template included.",
    readTime: "5 min read",
    blocks: [
      { p: "Most research opportunities for students aren't advertised. You create them by emailing professors directly. Done right, even a 16-year-old can land a mentor." },
      { h: "Do your homework first", p: "Read at least one recent paper from the professor. Your email must prove you understand their actual work — not just their field. This single step puts you ahead of 90% of cold emails." },
      { h: "Keep it short", p: "Professors are busy. Aim for 5-6 sentences: who you are, what you read of theirs, why it interests you, what you can offer, and a clear small ask (a call, or to help on a project)." },
      { h: "A template that works", p: "Subject: Class 11 student interested in your work on [topic]" },
      { p: "Hi Professor [Name], I'm [name], a Class 11 student in [city]. I recently read your paper on [specific topic] and was struck by [specific detail]. I've been teaching myself [relevant skill] and built [tiny project]. I'd love to help on your research in any small way this summer — even data cleaning or literature review. Would you be open to a short call? Thank you for your time." },
      { h: "Send many, expect few", list: [
        "Email 15-20 professors, not 2. A 10% reply rate is normal.",
        "Follow up once after a week if there's no reply.",
        "Local universities first — they're more likely to say yes to a school student.",
      ] },
    ],
  },
  {
    slug: "find-and-win-scholarships",
    title: "Finding & Winning Scholarships",
    category: "Scholarships",
    icon: "school",
    color: "bg-[#FFC6E5]",
    excerpt: "There's more scholarship money than people who apply well. Here's how to find them and stand out.",
    readTime: "7 min read",
    blocks: [
      { p: "Scholarships aren't only for toppers. Many reward leadership, social impact, or financial need. The students who win are usually the ones who simply apply well — and apply often." },
      { h: "Where to look", list: [
        "Government portals (National Scholarship Portal, state schemes).",
        "University-specific aid (often the most generous — see our Abroad page).",
        "Corporate and foundation scholarships (Reliance, Aditya Birla, Inlaks, Vidyadhan).",
        "Need-blind universities abroad that meet 100% of demonstrated need.",
      ] },
      { h: "Start a tracker", p: "Make a simple sheet: scholarship name, amount, deadline, requirements, status. Apply to 10-15, not 1-2. Volume plus quality wins." },
      { h: "Tailor every essay", p: "Reuse a strong base essay, but customize the opening and the 'why this scholarship' part each time. Generic essays are obvious and lose." },
      { h: "Get your documents ready early", list: [
        "Strong recommendation letters (ask 1 month ahead).",
        "A reusable personal essay you can adapt.",
        "Proof of income/marksheets organized in one folder.",
      ] },
      { p: "Tip: meeting the deadline already beats most applicants. Many scholarships are under-subscribed simply because people apply late or not at all." },
    ],
  },
  {
    slug: "portfolio-with-no-experience",
    title: "Building a Portfolio With No Experience",
    category: "Portfolio",
    icon: "construction",
    color: "bg-[#AEE3FF]",
    excerpt: "Everyone starts at zero. The trick is turning curiosity into visible proof of work.",
    readTime: "5 min read",
    blocks: [
      { p: "A portfolio isn't a list of titles — it's evidence that you make things. You don't need an internship to start. You need one small, finished project." },
      { h: "Start absurdly small", p: "A one-page website, a short research note, a community drive you organized, a tiny app, an analysis of public data. Finished and small beats ambitious and abandoned." },
      { h: "Document everything", list: [
        "Write a short post on what you built and what you learned.",
        "Take screenshots or photos as you go.",
        "Keep a running 'brag doc' of every project, no matter how small.",
      ] },
      { h: "Show the process, not just results", p: "Mentors and admissions officers love seeing how you think. A messy project with a clear story of what you tried beats a polished one with no context." },
      { h: "Stack small wins", p: "Three small finished projects in a year tell a powerful story of initiative. Use your LetsBuildFolio quests and saved opportunities as a starting roadmap." },
    ],
  },
  {
    slug: "ace-your-first-hackathon",
    title: "Acing Your First Hackathon",
    category: "Competitions",
    icon: "code",
    color: "bg-[#D5C6FF]",
    excerpt: "You don't need to be the best coder to win a hackathon. You need focus, a story, and a working demo.",
    readTime: "5 min read",
    blocks: [
      { p: "Hackathons reward clarity and execution over raw skill. Beginners win all the time by solving one real problem well and presenting it clearly." },
      { h: "Pick a problem you care about", p: "Judges remember projects with a clear 'why'. Solve something you or your community actually face — it makes your demo and pitch authentic." },
      { h: "Scope ruthlessly", list: [
        "Build the smallest version that demonstrates the idea.",
        "A working demo of one feature beats five half-built ones.",
        "Decide what you will NOT build in the first hour.",
      ] },
      { h: "Save time for the pitch", p: "Reserve the last 2-3 hours for your demo and presentation. Many great projects lose because the team couldn't explain them. Tell a story: problem, solution, demo, impact." },
      { h: "Team up smartly", p: "A good team has a builder, a designer, and a storyteller. You don't all need to code. Find people whose strengths cover your gaps." },
    ],
  },
  {
    slug: "mun-for-beginners",
    title: "MUN for Beginners",
    category: "Public Speaking",
    icon: "gavel",
    color: "bg-[#FFC6E5]",
    excerpt: "Model UN looks intimidating from outside. Here's how to walk into your first conference prepared.",
    readTime: "6 min read",
    blocks: [
      { p: "Model United Nations (MUN) is a simulation where you represent a country and debate global issues. It builds research, public speaking, and diplomacy — and it's a lot more approachable than it looks." },
      { h: "Understand your three jobs", list: [
        "Research: know your country's position and the topic.",
        "Speak: deliver short, clear speeches in committee.",
        "Negotiate: build alliances and co-write resolutions.",
      ] },
      { h: "Write a great position paper", p: "Before the conference, prepare a 1-page position paper: your country's stance, what it has done, and what solutions it proposes. This becomes your script during debate." },
      { h: "Master the opening speech", p: "Prepare a 60-90 second opening: state your country's position, the stakes, and one clear proposal. Practice it out loud until it's smooth." },
      { h: "Don't fear the procedure", p: "Points and motions feel confusing at first but follow a fixed pattern. Watch one session, copy what experienced delegates do, and you'll pick it up fast." },
      { p: "Start with smaller or beginner-friendly committees. Confidence compounds — your third MUN will feel completely different from your first." },
    ],
  },
];
