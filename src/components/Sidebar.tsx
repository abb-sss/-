import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Library, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "工作台", href: "/dashboard", icon: LayoutDashboard },
    { name: "文献库", href: "/library", icon: Library },
  ];

  return (
    <aside className="w-64 border-r bg-gray-50/50 flex flex-col h-full">
      <div className="h-14 flex items-center px-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">AIPaper</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors">
          <Settings className="w-5 h-5" />
          设置
        </button>
      </div>
    </aside>
  );
}
