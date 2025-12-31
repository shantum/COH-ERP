import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading product. Make sure the API server is running.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/products')}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">
              {product.category} · {product.productType}
            </p>
          </div>
        </div>
        <Button>Edit Product</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Product Info">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.productType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Production Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.baseProductionTimeMins} minutes
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Summary" className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {product.variations?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Variations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {product.variations?.reduce(
                  (sum: number, v: any) => sum + (v.skus?.length || 0),
                  0
                ) || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total SKUs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">-</p>
              <p className="text-sm text-gray-600 mt-1">In Stock</p>
            </div>
          </div>
        </Card>
      </div>

      {product.variations && product.variations.length > 0 ? (
        <div className="space-y-6">
          {product.variations.map((variation: any) => (
            <Card
              key={variation.id}
              title={
                <div className="flex items-center space-x-3">
                  {variation.colorHex && (
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: variation.colorHex }}
                    />
                  )}
                  <span>{variation.colorName}</span>
                  {variation.fabric && (
                    <span className="text-sm text-gray-500">
                      · {variation.fabric.name}
                    </span>
                  )}
                </div>
              }
              action={<Button size="sm">Add SKU</Button>}
            >
              {variation.skus && variation.skus.length > 0 ? (
                <Table
                  data={variation.skus}
                  columns={[
                    { header: 'SKU Code', accessor: 'skuCode' as const },
                    { header: 'Size', accessor: 'size' as const },
                    {
                      header: 'Fabric Consumption',
                      accessor: (row: any) => `${row.fabricConsumption} m`,
                    },
                    {
                      header: 'MRP',
                      accessor: (row: any) => `₹${row.mrp}`,
                    },
                    {
                      header: 'Target Stock',
                      accessor: 'targetStockQty' as const,
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
                  ]}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">No SKUs yet</p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-gray-500 text-center py-8">No variations yet</p>
        </Card>
      )}
    </div>
  );
}
