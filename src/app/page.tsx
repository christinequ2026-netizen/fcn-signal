import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import HomeClient from "@/components/HomeClient";
import { mockStats, mockInsights, mockHotKeywords, mockSignals } from "@/data/mock";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <HomeClient
        signals={mockSignals}
        stats={mockStats}
        insights={mockInsights}
        hotKeywords={mockHotKeywords}
      />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
