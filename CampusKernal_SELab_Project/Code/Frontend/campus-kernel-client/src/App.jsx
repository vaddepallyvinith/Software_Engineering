import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import MeSpace from './pages/MeSpace';
import WeSpace from './pages/WeSpace';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-500 min-h-screen font-sans text-[15px] sm:text-base font-medium">
          <Sidebar />
          
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<MeSpace />} />
              <Route path="/we-space" element={<WeSpace />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;