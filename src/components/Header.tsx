import { Menu } from 'lucide-react';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className='md:hidden bg-white shadow-md p-4 flex items-center justify-between'>
      <h1 className='text-xl font-bold text-gray-800'>Navio</h1>
      <button onClick={() => setSidebarOpen(true)} className='text-gray-600 hover:text-gray-800'>
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;
