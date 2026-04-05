import { Outlet } from "react-router-dom";

export default function EditorLayout() {
  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 font-sans overflow-hidden">
      <Outlet />
    </div>
  );
}
