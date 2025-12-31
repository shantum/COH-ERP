import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/products/ProductList';
import { ProductDetail } from './pages/products/ProductDetail';
import { FabricList } from './pages/fabrics/FabricList';
import { FabricDetail } from './pages/fabrics/FabricDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/fabrics" element={<FabricList />} />
            <Route path="/fabrics/:id" element={<FabricDetail />} />
            {/* Placeholder routes for other modules */}
            <Route path="/inventory" element={<ComingSoon module="Inventory" />} />
            <Route path="/orders" element={<ComingSoon module="Orders" />} />
            <Route path="/production" element={<ComingSoon module="Production" />} />
            <Route path="/returns" element={<ComingSoon module="Returns" />} />
            <Route path="/feedback" element={<ComingSoon module="Feedback" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function ComingSoon({ module }: { module: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{module}</h2>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
}

export default App;
