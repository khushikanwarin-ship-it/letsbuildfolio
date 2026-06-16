import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4">
      <div className="bg-[#FFFDF7] border-2 border-[#3A2E5C] rounded-3xl p-10 max-w-md w-full text-center jelly-shadow">
        <span className="material-symbols-outlined text-5xl text-[#3A2E5C] mb-4 block">auto_awesome</span>
        <h1 className="font-black text-3xl text-[#3A2E5C] mb-4" style={{fontFamily:'"Bricolage Grotesque",sans-serif'}}>You are in!</h1>
        <p className="text-[#4A4A4A] mb-8">Your account is set up. Full onboarding comes in Phase 2.</p>
        <Link href="/dashboard" className="glossy-button bg-[#3A2E5C] text-white px-8 py-3 rounded-xl font-bold text-sm jelly-shadow-sm jelly-active inline-block" style={{fontFamily:'"Space Grotesk",sans-serif'}}>
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
