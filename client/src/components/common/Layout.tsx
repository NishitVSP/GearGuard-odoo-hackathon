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
  FiMapPin
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
          <h1 className="text-2xl font-bold">🛠️ GearGuard</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user ? getInitials(user.name) : 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-blue-200 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-blue-200 hover:text-white transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
