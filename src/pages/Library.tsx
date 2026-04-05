import { BookOpen, Search, Upload, Filter, FileText } from "lucide-react";

export default function Library() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">文献管理中心</h1>
          <p className="text-gray-500 text-sm mt-1">管理已收藏的真实学术文献，自动提取元数据</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition shadow-sm">
            <Upload className="w-4 h-4" />
            上传 PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
            <Search className="w-4 h-4" />
            在线检索
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
              <tr className="hover:bg-gray-50/50 transition group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition mb-1">Attention Is All You Need</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-lg">The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 truncate">Ashish Vaswani, Noam Shazeer...</td>
                <td className="px-6 py-4 text-sm text-gray-600">2017</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">Semantic Scholar</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition mb-1">Deep learning</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-lg">Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 truncate">Yann LeCun, Yoshua Bengio...</td>
                <td className="px-6 py-4 text-sm text-gray-600">2015</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">Crossref</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition mb-1">本地导入的参考资料.pdf</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-lg">未提取到摘要信息...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 truncate">未知作者</td>
                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">本地上传</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
