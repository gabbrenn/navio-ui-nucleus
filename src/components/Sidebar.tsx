import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, BrainCircuit, HeartPulse, Handshake, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/risk-indicator', label: 'Risk Indicator', icon: Shield },
  { href: '/ai-analyzer', label: 'AI Analyzer', icon: BrainCircuit },
  { href: '/panic-info', label: 'Panic Info', icon: HeartPulse },
  { href: '/partnerships', label: 'Partnerships', icon: Handshake },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:fixed top-0 left-0 w-64 h-screen`}>
      <div className='p-6 text-center flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Navio</h1>
        <button onClick={() => setSidebarOpen(false)} className='md:hidden text-gray-600 hover:text-gray-800'>
          <X size={24} />
        </button>
      </div>
      <nav className='flex-1 px-4 py-2'>
        <ul>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = location.pathname === href;
            return (
              <li key={href}>
                <Link
                  to={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <Icon className='w-5 h-5 mr-3' />
                  <span className='font-medium'>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
