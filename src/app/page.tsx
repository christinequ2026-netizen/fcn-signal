import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import HomeClient from "@/components/HomeClient";
import { mockStats, mockSignals } from "@/data/mock";
import { generateInsights, generateHotKeywords } from "@/lib/generateInsights";

export default function Home() {
  // 从实际信号数据动态生成情报摘要和热门关键词
  const insights = generateInsights(mockSignals);
  const hotKeywords = generateHotKeywords(mockSignals);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <HomeClient
        signals={mockSignals}
        stats={mockStats}
        insights={insights}
        hotKeywords={hotKeywords}
      />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
