import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-end px-6 shrink-0">
      <div className="flex items-center gap-4 text-gray-500">
        <button className="hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-5 w-px bg-gray-300"></div>
        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
          <UserCircle className="w-6 h-6" />
          <span className="text-sm font-medium">李研究员</span>
        </button>
      </div>
    </header>
  );
}
