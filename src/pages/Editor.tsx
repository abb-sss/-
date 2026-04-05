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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([
    {
      id: '1',
      refId: 'ref-1',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, et al.',
      year: '2017',
      source: 'Advances in neural information processing systems',
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...'
    },
    {
      id: '2',
      refId: 'ref-2',
      title: 'Deep learning',
      authors: 'Yann LeCun, Yoshua Bengio, Geoffrey Hinton',
      year: '2015',
      source: 'Nature',
      abstract: 'Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction...'
    }
  ]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearching(true);
      // 模拟 API 请求
      setTimeout(() => {
        setSearchResults([
          {
            id: Date.now().toString(),
            refId: `ref-${Date.now()}`,
            title: `Research on ${searchQuery}`,
            authors: 'AI Researcher, John Doe',
            year: '2024',
            source: 'Journal of Artificial Intelligence',
            abstract: `This paper explores the recent developments in ${searchQuery}, providing a comprehensive review of the methodologies...`
          },
          ...searchResults
        ]);
        setIsSearching(false);
      }, 1000);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`已成功生成并下载 [${formatStyle}] 格式的 PDF 文档`);
    }, 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // 模拟添加文献引用到状态
      const newCitation = {
        id: Date.now().toString(),
        refId: 'ref-1',
        title: 'Attention Is All You Need',
        authors: 'Ashish Vaswani, Noam Shazeer, et al.',
        year: '2017',
        source: 'Advances in neural information processing systems'
      };
      
      // Update citation outside of React render phase
      setTimeout(() => {
        useEditorStore.getState().addCitation(newCitation);
        
        // 根据当前已有引用数量计算新引用的编号
        const currentCitations = useEditorStore.getState().citations;
        const citeIndex = currentCitations.findIndex(c => c.refId === newCitation.refId) + 1;

        setContent(content + `<p>Recent advancements in deep learning, particularly the Transformer architecture, have significantly improved the performance of various sequence modeling tasks <span class="citation-mark" data-ref-id="ref-1" title="Attention Is All You Need">[${citeIndex}]</span>. These models allow for highly parallelizable processing and have been widely adopted across domains.</p>`);
        setIsGenerating(false);
      }, 0);
    }, 1500);
  };

  const [isPolishing, setIsPolishing] = useState(false);
  const [polishResult, setPolishResult] = useState("");

  const handlePolish = (type: 'grammar' | 'academic') => {
    setIsPolishing(true);
    setPolishResult("");
    setTimeout(() => {
      setIsPolishing(false);
      if (type === 'grammar') {
        setPolishResult("已检查选中文本。未发现明显语法错误。建议将 'This method are good' 修改为 'This method is good' 以保持主谓一致。");
      } else {
        setPolishResult("【学术化润色结果】\n\n传统的特征提取方法在处理高度异质性的医学影像数据时，往往存在泛化能力不足的局限性。相比之下，以卷积神经网络（CNN）为代表的深度表征学习模型，能够自适应地从原始像素中提取具有高阶语义信息的层级特征，从而在图像分割与分类任务中展现出显著的性能优势。");
      }
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
            <div className="relative">
              <select
                value={formatStyle}
                onChange={(e) => useEditorStore.getState().setFormatStyle(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-md pl-3 pr-8 py-1.5 cursor-pointer hover:bg-gray-100 transition text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="默认">默认格式</option>
                <option value="APA">APA 格式</option>
                <option value="IEEE">IEEE 格式</option>
                <option value="MLA">MLA 格式</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition shadow-sm disabled:opacity-70"
            >
              {isExporting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? '导出中...' : '导出 PDF'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-12 py-16 scroll-smooth relative">
          <div className="flex justify-center max-w-[1200px] mx-auto gap-8">
            {/* 左侧大纲导航 */}
            {useEditorStore.getState().headings.length > 0 && (
              <div className="hidden lg:block w-56 shrink-0 sticky top-16 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">文档大纲</div>
                <div className="space-y-1 border-l-2 border-gray-100">
                  {useEditorStore.getState().headings.map((heading, index) => (
                    <a
                      key={index}
                      href={`#${heading.id}`}
                      className={`block py-1 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-r transition-colors truncate
                        ${heading.level === 1 ? 'font-medium' : heading.level === 2 ? 'pl-6' : 'pl-9 text-xs'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const elements = Array.from(document.querySelectorAll(`h${heading.level}`));
                        const target = elements.find(el => el.textContent?.includes(heading.text));
                        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 编辑器内容区 */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <TipTapEditor
                content={content}
                onChange={setContent}
                title={title}
                onTitleChange={setTitle}
                formatStyle={formatStyle}
              />
              
              {/* 动态参考文献列表 */}
              {useEditorStore.getState().citations.length > 0 && (
                <div className="mt-8 bg-white shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-16">
                  <h2 className="text-2xl font-bold font-serif mb-6 border-b border-gray-200 pb-2">参考文献 (References)</h2>
                  <ol className={`list-decimal pl-5 space-y-3 ${formatStyle === 'APA' ? 'format-apa' : formatStyle === 'IEEE' ? 'format-ieee' : formatStyle === 'MLA' ? 'format-mla' : 'format-default text-sm text-gray-700'}`}>
                    {useEditorStore.getState().citations.map((cite, index) => (
                      <li key={cite.id} id={`ref-${cite.refId}`} className="pl-2">
                        {formatStyle === 'APA' ? (
                          <span>{cite.authors} ({cite.year}). {cite.title}. <i>{cite.source}</i>.</span>
                        ) : formatStyle === 'IEEE' ? (
                          <span>{cite.authors}, "{cite.title}," in <i>{cite.source}</i>, {cite.year}.</span>
                        ) : formatStyle === 'MLA' ? (
                          <span>{cite.authors}. "{cite.title}." <i>{cite.source}</i>, {cite.year}.</span>
                        ) : (
                          <span><b>{cite.authors}</b>. {cite.title}. <i>{cite.source}</i>, {cite.year}.</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="搜索 Semantic Scholar... (按回车)"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>

              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>{searchQuery ? "搜索结果" : "推荐文献"}</span>
                  {isSearching && <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                
                {/* 文献卡片列表 */}
                {searchResults.map((result) => (
                  <div key={result.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition group relative">
                    <h4 className="font-medium text-sm text-gray-900 leading-snug mb-1">{result.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{result.authors} • {result.year}</p>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3 mb-3 leading-relaxed">
                      {result.abstract}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                        <Bookmark className="w-3.5 h-3.5" /> 收藏
                      </button>
                      <div className="flex gap-2">
                        {result.id === '1' ? (
                          <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            {isGenerating ? <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <Wand2 className="w-3.5 h-3.5" />}
                            {isGenerating ? "生成中..." : "基于此扩写"}
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setTimeout(() => {
                          useEditorStore.getState().addCitation(result);
                          const currentCitations = useEditorStore.getState().citations;
                          const citeIndex = currentCitations.findIndex(c => c.refId === result.refId) + 1;
                          setContent(content + ` <span class="citation-mark" data-ref-id="${result.refId}" title="${result.title}">[${citeIndex}]</span>`);
                        }, 0);
                            }}
                            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition"
                          >
                            插入引用
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={() => handlePolish('academic')}
                  disabled={isPolishing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                >
                  {isPolishing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Wand2 className="w-4 h-4" />}
                  {isPolishing ? '正在分析...' : '学术化语气润色'}
                </button>
                <button 
                  onClick={() => handlePolish('grammar')}
                  disabled={isPolishing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
                >
                  {isPolishing ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div> : <Settings2 className="w-4 h-4" />}
                  {isPolishing ? '正在检查...' : '语法与拼写检查'}
                </button>
              </div>

              {polishResult ? (
                <div className="flex-1 bg-white border border-blue-100 rounded-lg p-4 shadow-sm relative group overflow-y-auto">
                  <div className="text-xs font-semibold text-blue-600 mb-3 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" /> AI 分析结果
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                    {polishResult}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition">
                      替换选中文本
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Wand2 className="w-8 h-8 mb-4 text-gray-300" />
                  <p className="text-sm">在左侧编辑器中选中需要优化的段落，点击上方按钮进行智能分析。</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
