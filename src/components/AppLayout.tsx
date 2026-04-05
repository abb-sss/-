import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* 顶部栏 */}
        <Header />

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto bg-gray-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
