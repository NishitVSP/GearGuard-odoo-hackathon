import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiHome, 
  FiPackage, 
  FiClipboard, 
  FiCalendar, 
  FiUsers, 
  FiLogOut,
  FiMapPin,
  FiMenu
} from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Equipment', href: '/equipment', icon: FiPackage },
    { name: 'Work Centers', href: '/workcenters', icon: FiMapPin },
    { name: 'Requests', href: '/requests', icon: FiClipboard },
    { name: 'Calendar', href: '/calendar', icon: FiCalendar },
    { name: 'Teams', href: '/teams', icon: FiUsers },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl transition-all duration-300 z-50`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 bg-black/20 backdrop-blur-sm">
          <h1 className={`font-bold flex items-center gap-2 ${sidebarCollapsed ? 'text-xl' : 'text-xl'}`}>
            <span className="text-2xl">🛠️</span>
            {!sidebarCollapsed && <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GearGuard</span>}
          </h1>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} transition-transform group-hover:scale-110`} />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                {isActive(item.href) && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? '' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white/20 shadow-lg">
                <span className="text-sm font-bold">
                  {user ? getInitials(user.name) : 'U'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-blue-300 capitalize">{user?.role || 'User'}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <main className="p-8 min-h-screen">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
