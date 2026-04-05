import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, PenTool, LayoutTemplate } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">A</div>
          <span className="font-semibold text-xl tracking-tight">AIPaper</span>
        </div>
        <div className="flex gap-4">
          <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">登录</Link>
          <Link to="/dashboard" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm">免费开始</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-20">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
          基于<span className="text-blue-600 relative inline-block">真实文献<span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200/50 -z-10"></span></span>的<br/>AI学术写作平台
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          告别AI胡编乱造的参考文献。AIPaper直连全球学术文献库，为您提供有据可查的智能写作与一键期刊排版体验。
        </p>
        
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          进入工作台 <ArrowRight className="w-5 h-5" />
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">真实文献检索</h3>
            <p className="text-gray-600 text-sm leading-relaxed">实时对接 Semantic Scholar 等主流学术网络，确保每一次引用都真实存在、准确无误。</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">语境感知辅助</h3>
            <p className="text-gray-600 text-sm leading-relaxed">基于选定文献摘要，AI智能扩写、润色段落，同时自动插入规范引用标记。</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">一键期刊排版</h3>
            <p className="text-gray-600 text-sm leading-relaxed">内置 APA、IEEE、MLA 等主流学术格式，一键切换并导出符合出版标准的 PDF 文档。</p>
          </div>
        </div>
      </main>
    </div>
  );
}
