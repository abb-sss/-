import { BookOpen, Search, Upload, Filter, FileText, CheckCircle2, Loader2, Plus } from "lucide-react";
import { useState, useRef } from "react";

interface Literature {
  id: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  abstract: string;
  status: 'ready' | 'processing';
}

export default function Library() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [literatures, setLiteratures] = useState<Literature[]>([
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer...',
      year: '2017',
      source: 'Semantic Scholar',
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
      status: 'ready'
    },
    {
      id: '2',
      title: 'Deep learning',
      authors: 'Yann LeCun, Yoshua Bengio...',
      year: '2015',
      source: 'Crossref',
      abstract: 'Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction...',
      status: 'ready'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      
      // 添加一条 processing 状态的占位数据
      const newLitId = Date.now().toString();
      setLiteratures(prev => [{
        id: newLitId,
        title: file.name,
        authors: '解析中...',
        year: '-',
        source: '本地上传',
        abstract: '正在通过 AI 提取文献摘要和元数据...',
        status: 'processing'
      }, ...prev]);

      // 模拟 AI 解析 PDF 的过程 (3秒后完成)
      setTimeout(() => {
        setLiteratures(prev => prev.map(lit => {
          if (lit.id === newLitId) {
            return {
              ...lit,
              title: file.name.replace('.pdf', ''), // 模拟提取真实标题
              authors: 'John Doe, Jane Smith',
              year: new Date().getFullYear().toString(),
              abstract: 'This paper presents a novel approach to resolving complex AI parsing issues in local academic workflows...',
              status: 'ready'
            };
          }
          return lit;
        }));
        setIsUploading(false);
      }, 3000);
    }
  };
  return (
    <div className="p-8 max-w-6xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">文献管理中心</h1>
          <p className="text-gray-500 text-sm mt-1">管理已收藏的真实学术文献，自动提取元数据</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? '解析中...' : '上传 PDF'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
            <Plus className="w-4 h-4" />
            新建文献夹
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4 items-center bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索文献标题、作者、年份..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4 font-medium">标题</th>
                <th className="px-6 py-4 font-medium w-48">作者</th>
                <th className="px-6 py-4 font-medium w-24">年份</th>
                <th className="px-6 py-4 font-medium w-32">来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {literatures.map((lit) => (
                <tr key={lit.id} className={`hover:bg-gray-50/50 transition group cursor-pointer ${lit.status === 'processing' ? 'opacity-60 bg-gray-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        lit.status === 'processing' 
                          ? 'bg-gray-100 text-gray-400' 
                          : lit.source.includes('本地') 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                        {lit.status === 'processing' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : lit.source.includes('本地') ? (
                          <BookOpen className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition mb-1 flex items-center gap-2">
                          {lit.title}
                          {lit.status === 'processing' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-normal">AI 提取中...</span>}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-lg">{lit.abstract}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate">{lit.authors}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lit.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${
                      lit.source.includes('Semantic Scholar') ? 'bg-green-50 text-green-700 border-green-100' :
                      lit.source.includes('Crossref') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {lit.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
