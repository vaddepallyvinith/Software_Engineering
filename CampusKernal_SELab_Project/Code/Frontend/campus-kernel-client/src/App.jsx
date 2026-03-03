import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import MeSpace from './pages/MeSpace';
import WeSpace from './pages/WeSpace';
import Messages from './pages/Messages'; // <--- 1. MAKE SURE THIS IS HERE

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<MeSpace />} />
            <Route path="/we-space" element={<WeSpace />} />
            <Route path="/messages" element={<Messages />} /> {/* <--- 2. AND THIS */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;