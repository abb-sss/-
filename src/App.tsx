import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Library from "@/pages/Library";
import AppLayout from "@/components/AppLayout";
import EditorLayout from "@/components/EditorLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
        </Route>

        <Route element={<EditorLayout />}>
          <Route path="/editor/:id" element={<Editor />} />
        </Route>
      </Routes>
    </Router>
  );
}
