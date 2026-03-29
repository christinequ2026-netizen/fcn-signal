"use client";

export default function Footer() {
  const socialLinks = [
    { name: "微信公众号", icon: "💬", href: "#", color: "hover:text-green-400" },
    { name: "知乎",       icon: "🔵", href: "#", color: "hover:text-blue-400" },
    { name: "雪球",       icon: "⛷️", href: "#", color: "hover:text-sky-400" },
    { name: "Twitter/X",  icon: "𝕏",  href: "#", color: "hover:text-gray-200" },
    { name: "YouTube",    icon: "▶️", href: "#", color: "hover:text-red-500" },
  ];

  return (
    <footer className="border-t border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Section */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-amber-400">关注我们</h3>
          <div className="flex flex-wrap gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                title={social.name}
                className={`flex items-center gap-2 text-gray-400 transition-colors duration-200 ${social.color}`}
              >
                <span className="text-xl">{social.icon}</span>
                <span className="text-sm hidden sm:inline">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        {/* Bottom */}
        <div className="space-y-3 text-center text-sm">
          <p className="text-amber-400/80 font-medium">
            © 2026 FCN信号场 · 全球FCN资讯实时捕获
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            免责声明：本站内容仅供参考，不构成投资建议。投资有风险，入市需谨慎。
          </p>
        </div>
      </div>
    </footer>
  );
}
