import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import MeSpace from './pages/MeSpace';
import WeSpace from './pages/WeSpace';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-500 min-h-screen font-sans text-[15px] sm:text-base font-medium">
      {!isAuthPage && <Sidebar />}
      
      <main className={`flex-1 min-w-0 overflow-x-hidden ${!isAuthPage ? 'ml-64 p-4 md:p-8' : ''}`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><MeSpace /></ProtectedRoute>} />
          <Route path="/we-space" element={<ProtectedRoute><WeSpace /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;