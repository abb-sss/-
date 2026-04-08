import { ArrowLeft, Search, Bookmark, Download, Settings2, ChevronDown, Wand2, PanelRightClose, PanelRightOpen, ShieldCheck, TableProperties, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TipTapEditor from "@/components/TipTapEditor";
import { useEditorStore } from "@/store/useEditorStore";
import { useState, useEffect } from "react";

export default function Editor() {
  const { id } = useParams();
  const { title, content, formatStyle, wordCount, setTitle, setContent } = useEditorStore();
  const [activeTab, setActiveTab] = useState<"search" | "ai" | "matrix">("search");
  const [isGeneratingMatrix, setIsGeneratingMatrix] = useState(false);
  const [matrixGenerated, setMatrixGenerated] = useState(false);

  const handleGenerateMatrix = () => {
    setIsGeneratingMatrix(true);
    setTimeout(() => {
      setIsGeneratingMatrix(false);
      setMatrixGenerated(true);
    }, 2000);
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [plagiarismReport, setPlagiarismReport] = useState<{ similarity: number, aiGenerated: number } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePlagiarismCheck = () => {
    setIsCheckingPlagiarism(true);
    setPlagiarismReport(null);
    setTimeout(() => {
      setIsCheckingPlagiarism(false);
      setPlagiarismReport({ similarity: 12, aiGenerated: 8 });
    }, 2500);
  };

  // 监听滚动实现大纲高亮
  useEffect(() => {
    const handleScroll = () => {
      const headings = useEditorStore.getState().headings;
      if (headings.length === 0) return;

      const viewportHeight = window.innerHeight;
      let currentActiveId = null;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        // 查找对应的 DOM 节点
        const elements = Array.from(document.querySelectorAll(`h${heading.level}`));
        const target = elements.find(el => el.textContent?.includes(heading.text));

        if (target) {
          const rect = target.getBoundingClientRect();
          // 如果标题在视口上半部分或者已经滚过，则认为是当前活动的大纲
          if (rect.top <= viewportHeight / 3) {
            currentActiveId = heading.id;
            break;
          }
        }
      }

      if (currentActiveId) {
        setActiveHeadingId(currentActiveId);
      }
    };

    // 获取编辑器容器的滚动事件
    const mainContainer = document.getElementById('editor-main-container');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const handleExport = (type: 'pdf' | 'docx' | 'tex') => {
    setShowExportMenu(false);
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`已成功生成并下载 [${formatStyle}] 格式的 ${type.toUpperCase()} 文档`);
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
        const tooltipHTML = `<div class="citation-tooltip"><div class="font-semibold mb-1">${newCitation.title}</div><div class="text-gray-400 text-xs mb-2">${newCitation.authors} (${newCitation.year})</div><div class="text-gray-300 text-xs line-clamp-3">查看原文内容与详情...</div></div>`;

        setContent(content + `<p>Recent advancements in deep learning, particularly the Transformer architecture, have significantly improved the performance of various sequence modeling tasks <span class="citation-mark" data-ref-id="ref-1">[${citeIndex}]${tooltipHTML}</span>. These models allow for highly parallelizable processing and have been widely adopted across domains.</p>`);
        setIsGenerating(false);
      }, 0);
    }, 1500);
  };

  const [aiChatInput, setAiChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: '您好！我是您的学术写作助手。您可以在左侧选中段落让我润色，或者直接在这里向我提问关于文献的内容。' }
  ]);

  const handleAiChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && aiChatInput.trim() && !isPolishing) {
      const userMessage = aiChatInput.trim();
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setAiChatInput("");
      setIsPolishing(true);

      setTimeout(() => {
        setIsPolishing(false);
        setChatMessages(prev => [...prev, { 
          role: 'ai', 
          content: `关于您提到的 "${userMessage}"，基于当前文献库的分析：\n\n最新的研究表明该领域正在向多模态方向发展。例如，[Attention Is All You Need] 提出了一种完全基于注意力机制的架构，摒弃了传统的循环和卷积网络。\n\n您希望我基于这个观点为您扩写当前段落吗？`
        }]);
      }, 1500);
    }
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

  const handleApplyDiff = () => {
    // Simulate applying AI Diff directly into the editor
    const diffHTML = `
      <p>
        <span data-diff-type="deletion">传统的特征提取方法在处理复杂的医学图像时往往显得力不从心。</span>
        <span data-diff-type="insertion">传统的特征提取方法在处理高度异质性的医学影像数据时，往往存在泛化能力不足的局限性。相比之下，以卷积神经网络（CNN）为代表的深度表征学习模型，展现出了显著的性能优势。</span>
      </p>
    `;
    setContent(content + diffHTML);
    setPolishResult("");
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={handlePlagiarismCheck}
                disabled={isCheckingPlagiarism}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition disabled:opacity-50"
              >
                {isCheckingPlagiarism ? (
                  <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
                {isCheckingPlagiarism ? '检测中...' : '查重与检测'}
              </button>
              
              {plagiarismReport && (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> 重复率 {plagiarismReport.similarity}%</span>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> AI率 {plagiarismReport.aiGenerated}%</span>
                  {/* 底部字数统计状态栏 */}
              <div className="absolute bottom-4 right-12 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-3 text-[11px] text-gray-500 font-medium z-10 pointer-events-none">
                <span>{wordCount} words</span>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span>{Math.ceil(wordCount / 200)} min read</span>
                {/* 底部字数统计状态栏 */}
              <div className="fixed bottom-6 right-8 md:right-96 bg-white border border-gray-200 shadow-md rounded-full px-4 py-2 flex items-center gap-3 text-[11px] text-gray-500 font-medium z-10 pointer-events-none transition-all duration-300" style={{ right: isSidebarOpen ? 'calc(20rem + 2rem)' : '2rem' }}>
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {wordCount} words</span>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> {Math.ceil(wordCount / 200)} min read</span>
              </div>
            </div>
            </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-200"></div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition mr-1"
              title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
            >
              {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
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
            
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition shadow-sm disabled:opacity-70"
              >
                {isExporting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download className="w-3.5 h-3.5" />}
                {isExporting ? '导出中...' : '导出'}
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="py-1">
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <span>导出为 PDF</span>
                      <span className="text-xs text-gray-400">推荐</span>
                    </button>
                    <button onClick={() => handleExport('docx')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      导出为 Word (.docx)
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={() => handleExport('tex')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <span>导出 LaTeX 源码</span>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">.tex</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main id="editor-main-container" className="flex-1 overflow-y-auto px-12 py-16 scroll-smooth relative">
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
                      className={`block py-1 px-3 text-sm rounded-r transition-colors truncate
                        ${heading.level === 1 ? 'font-medium' : heading.level === 2 ? 'pl-6' : 'pl-9 text-xs'}
                        ${activeHeadingId === heading.id ? 'text-blue-600 bg-blue-50/50 border-l-2 -ml-[2px] border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`}
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
            <div className={`flex-1 min-w-0 ${formatStyle === 'IEEE' ? 'max-w-[900px]' : 'max-w-4xl'}`}>
              <TipTapEditor
                content={content}
                onChange={setContent}
                title={title}
                onTitleChange={setTitle}
                formatStyle={formatStyle}
              />
              
              {/* 动态参考文献列表 */}
              {useEditorStore.getState().citations.length > 0 && (
                <div className={`mt-8 bg-white shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-16 ${formatStyle === 'IEEE' ? 'max-w-[900px] mx-auto' : 'max-w-4xl mx-auto'}`}>
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
      <aside className={`bg-gray-50 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)] z-20 absolute md:relative right-0 top-0 bottom-0 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full md:translate-x-0'}`}>
        <div className="flex border-b border-gray-200 min-w-[320px]">
          <button 
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-3.5 text-[13px] font-medium flex justify-center items-center gap-1.5 transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Search className="w-3.5 h-3.5" /> 检索
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-3.5 text-[13px] font-medium flex justify-center items-center gap-1.5 transition-colors ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Settings2 className="w-3.5 h-3.5" /> 润色
          </button>
          <button 
            onClick={() => setActiveTab("matrix")}
            className={`flex-1 py-3.5 text-[13px] font-medium flex justify-center items-center gap-1.5 transition-colors ${activeTab === 'matrix' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <TableProperties className="w-3.5 h-3.5" /> 矩阵
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
                          const tooltipHTML = `<div class="citation-tooltip"><div class="font-semibold mb-1">${result.title}</div><div class="text-gray-400 text-xs mb-2">${result.authors} (${result.year})</div><div class="text-gray-300 text-xs line-clamp-3">${result.abstract}</div></div>`;
                          setContent(content + ` <span class="citation-mark" data-ref-id="${result.refId}">[${citeIndex}]${tooltipHTML}</span>`);
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
            <div className="flex flex-col h-full bg-white relative">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.role === 'ai' && <Wand2 className="w-3.5 h-3.5 inline-block mr-1.5 mb-0.5 text-blue-600" />}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isPolishing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                {polishResult && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed">
                      <Wand2 className="w-3.5 h-3.5 inline-block mr-1.5 mb-0.5 text-blue-600" />
                      <span className="whitespace-pre-wrap">{polishResult}</span>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                        <button onClick={handleApplyDiff} className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition shadow-sm">
                          行内替换查看对比 (Diff)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyDown={handleAiChat}
                  placeholder="向 AI 助手提问..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'matrix' && (
            <div className="flex flex-col h-full bg-white p-4">
              <div className="text-sm font-medium text-gray-800 mb-2">文献对比矩阵生成</div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                选择文献库中的多篇文献，AI 将自动提取其研究目的、方法、结果与局限性，生成结构化的对比表格，帮助您快速撰写文献综述。
              </p>
              
              {!matrixGenerated ? (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="text-xs font-medium text-gray-700 mb-2">已选择文献 (3)</div>
                    <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4">
                      <li>Attention Is All You Need (2017)</li>
                      <li>Deep learning (2015)</li>
                      <li>BERT: Pre-training of Deep... (2018)</li>
                    </ul>
                  </div>
                  <button 
                    onClick={handleGenerateMatrix}
                    disabled={isGeneratingMatrix}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm disabled:opacity-70"
                  >
                    {isGeneratingMatrix ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <TableProperties className="w-4 h-4" />}
                    {isGeneratingMatrix ? '正在深度阅读与抽取...' : '一键生成矩阵对比'}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 border border-blue-200 rounded-lg bg-blue-50/30 p-3 overflow-x-auto text-[11px] leading-relaxed">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="border-b border-blue-200 text-blue-800">
                          <th className="pb-2 font-medium w-1/4">文献</th>
                          <th className="pb-2 font-medium w-1/4">核心方法</th>
                          <th className="pb-2 font-medium w-1/4">关键结论</th>
                          <th className="pb-2 font-medium w-1/4">局限性</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100 text-gray-700">
                        <tr>
                          <td className="py-2 pr-2 font-medium text-gray-900">Vaswani et al. (2017)</td>
                          <td className="py-2 pr-2">纯注意力机制 (Transformer)</td>
                          <td className="py-2 pr-2">在翻译任务上达到SOTA，高度可并行化</td>
                          <td className="py-2 pr-2">对长序列内存消耗大</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-medium text-gray-900">LeCun et al. (2015)</td>
                          <td className="py-2 pr-2">深度卷积与反向传播</td>
                          <td className="py-2 pr-2">奠定了现代深度学习的理论与实践基础</td>
                          <td className="py-2 pr-2">缺乏对序列数据的建模能力</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 font-medium text-gray-900">Devlin et al. (2018)</td>
                          <td className="py-2 pr-2">双向 Transformer 预训练</td>
                          <td className="py-2 pr-2">刷新了11项NLP任务记录</td>
                          <td className="py-2 pr-2">预训练成本高昂</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                      <Wand2 className="w-4 h-4" /> 基于矩阵生成文献综述
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
