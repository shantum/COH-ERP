import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Products', href: '/products', icon: '👕' },
  { name: 'Fabrics', href: '/fabrics', icon: '🧵' },
  { name: 'Inventory', href: '/inventory', icon: '📦' },
  { name: 'Orders', href: '/orders', icon: '🛒' },
  { name: 'Production', href: '/production', icon: '🏭' },
  { name: 'Returns', href: '/returns', icon: '↩️' },
  { name: 'Feedback', href: '/feedback', icon: '💬' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-white text-xl font-bold">COH ERP</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg
                transition-colors
                ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </div>
  );
}
