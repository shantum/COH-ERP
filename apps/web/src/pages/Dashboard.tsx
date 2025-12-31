import { Card } from '../components/ui/Card';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to COH Internal ERP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-600 mt-1">Total Products</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">6</p>
            <p className="text-sm text-gray-600 mt-1">Fabric Types</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Pending Orders</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Low Stock Items</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              📦 View Inventory
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              🛒 New Order
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              🏭 Create Production Batch
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              📊 View Reports
            </button>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="text-center text-gray-500 py-8">
            No recent activity
          </div>
        </Card>
      </div>
    </div>
  );
}
