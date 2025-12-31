export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Creatures of Habit
          </h2>
          <p className="text-sm text-gray-500">Internal ERP System</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Admin User</span>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
