import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import Publish from './pages/Publish';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
