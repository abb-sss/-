import { Plus, FileText, MoreVertical, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const projects = [
    { id: "1", title: "深度学习在医学图像处理中的应用研究", lastModified: "2小时前", format: "IEEE" },
    { id: "2", title: "大语言模型对现代教育的影响分析", lastModified: "昨天 14:30", format: "APA" },
    { id: "3", title: "A Survey on Graph Neural Networks", lastModified: "2023-10-15", format: "MLA" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">我的项目</h1>
          <p className="text-gray-500 text-sm mt-1">管理你的论文文档，或开始新的创作</p>
        </div>
        <Link
          to="/editor/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          新建论文
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 新建卡片 */}
        <Link
          to="/editor/new"
          className="group h-48 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">创建空白文档</span>
        </Link>

        {/* 项目卡片 */}
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/editor/${project.id}`)}
            className="h-48 border border-gray-200 bg-white rounded-xl p-5 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition cursor-pointer relative group"
          >
            <div className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-900 transition p-1">
              <MoreVertical className="w-4 h-4" />
            </div>
            
            <div>
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <div className="block">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-4 border-t pt-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {project.lastModified}
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
                {project.format}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
