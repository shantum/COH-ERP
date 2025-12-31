import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export function ProductList() {
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading products. Make sure the API server is running.
        </div>
      </div>
    );
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
      className: 'font-medium',
    },
    {
      header: 'Category',
      accessor: (row: any) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'productType' as const,
    },
    {
      header: 'Variations',
      accessor: 'variationCount' as const,
      className: 'text-center',
    },
    {
      header: 'SKUs',
      accessor: 'skuCount' as const,
      className: 'text-center',
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => navigate('/products/new')}>
          + Add Product
        </Button>
      </div>

      <Card>
        <Table
          data={products || []}
          columns={columns}
          onRowClick={(row) => navigate(`/products/${row.id}`)}
        />
      </Card>
    </div>
  );
}
