import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RiskIndicator from './pages/RiskIndicator';
import AIAnalyzer from './pages/AIAnalyzer';
import PanicInfo from './pages/PanicInfo';
import Lessons from './pages/Lessons';
import PartnershipsPage from './pages/Partnerships';
import { Toaster } from 'sonner';
import Header from './components/Header';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className='flex bg-gray-100 min-h-screen'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='flex-1 flex flex-col'>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className='flex-1 p-4 md:p-6'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/risk-indicator' element={<RiskIndicator />} />
              <Route path='/ai-analyzer' element={<AIAnalyzer />} />
              <Route path='/panic-info' element={<PanicInfo />} />
              <Route path='/lessons' element={<Lessons />} />
              <Route path='/partnerships' element={<PartnershipsPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
