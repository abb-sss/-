import { ArrowLeft, Search, Bookmark, Download, Settings2, ChevronDown, Wand2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TipTapEditor from "@/components/TipTapEditor";
import { useEditorStore } from "@/store/useEditorStore";
import { useState } from "react";

export default function Editor() {
  const { id } = useParams();
  const { title, content, formatStyle, setTitle, setContent } = useEditorStore();
  const [activeTab, setActiveTab] = useState<"search" | "ai">("search");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setContent(content + `<p>Recent advancements in deep learning, particularly the Transformer architecture, have significantly improved the performance of various sequence modeling tasks <span class="citation-mark">[1]</span>. These models allow for highly parallelizable processing and have been widely adopted across domains <span class="citation-mark">[2]</span>.</p>`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full bg-[#fcfcfc]">
      {/* 编辑器主体 */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-md hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-500 max-w-[200px] truncate">
              {id === "new" ? "未命名文档" : title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition">
              <span className="text-xs font-medium text-gray-700 mr-2">排版格式: {formatStyle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition shadow-sm">
              <Download className="w-3.5 h-3.5" />
              导出 PDF
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-12 py-16 scroll-smooth">
          <TipTapEditor
            content={content}
            onChange={setContent}
            title={title}
            onTitleChange={setTitle}
          />
        </main>
      </div>

      {/* 右侧文献与AI助手 */}
      <aside className="w-80 bg-gray-50 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-3.5 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Search className="w-4 h-4" /> 文献检索
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-3.5 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Settings2 className="w-4 h-4" /> AI 润色
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'search' && (
            <>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="搜索 Semantic Scholar..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>

              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">推荐文献</div>
                
                {/* 文献卡片 */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition group relative">
                  <h4 className="font-medium text-sm text-gray-900 leading-snug mb-1">Attention Is All You Need</h4>
                  <p className="text-xs text-gray-500 mb-3">Ashish Vaswani, Noam Shazeer, et al. • 2017</p>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3 mb-3 leading-relaxed">
                    The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                      <Bookmark className="w-3.5 h-3.5" /> 收藏
                    </button>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition disabled:opacity-50"
                    >
                      {isGenerating ? <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <Wand2 className="w-3.5 h-3.5" />}
                      {isGenerating ? "生成中..." : "基于此扩写"}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition group relative">
                  <h4 className="font-medium text-sm text-gray-900 leading-snug mb-1">Deep learning</h4>
                  <p className="text-xs text-gray-500 mb-3">Yann LeCun, Yoshua Bengio, Geoffrey Hinton • 2015</p>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3 mb-3 leading-relaxed">
                    Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction...
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                      <Bookmark className="w-3.5 h-3.5" /> 收藏
                    </button>
                    <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition">
                      插入引用
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <Wand2 className="w-8 h-8 text-blue-400" />
              <p className="text-sm text-center">选中左侧文本，<br/>使用AI进行智能润色、改写或翻译</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
