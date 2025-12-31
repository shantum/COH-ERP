import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';

export function FabricDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const { data: fabric, isLoading, error } = useQuery({
    queryKey: ['fabric', id],
    queryFn: () => api.getFabric(id!),
    enabled: !!id,
  });

  const { data: transactions } = useQuery({
    queryKey: ['fabric-transactions', id],
    queryFn: () => api.getFabricTransactions(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading fabric...</div>
      </div>
    );
  }

  if (error || !fabric) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading fabric. Make sure the API server is running.
        </div>
      </div>
    );
  }

  const balance = fabric.balance || 0;
  const isLowStock = balance < (fabric.minOrderQty || 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/fabrics')}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fabric.name}</h1>
            <p className="text-gray-600">{fabric.fabricType?.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary">Edit Fabric</Button>
          <Button onClick={() => setShowTransactionForm(!showTransactionForm)}>
            {showTransactionForm ? 'Cancel' : 'Record Transaction'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Fabric Info">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Color</dt>
              <dd className="mt-1 flex items-center space-x-2">
                {fabric.colorHex && (
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: fabric.colorHex }}
                  />
                )}
                <span className="text-sm text-gray-900">{fabric.colorName}</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Composition</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.fabricType?.composition}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cost per Unit</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{fabric.costPerUnit}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Lead Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.leadTimeDays} days
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Min Order Qty</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.minOrderQty} m
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Current Balance" className="lg:col-span-2">
          <div className="text-center">
            <p className={`text-5xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {balance.toFixed(2)} m
            </p>
            {isLowStock && (
              <p className="mt-2 text-red-600 font-medium">
                ⚠️ Low Stock - Below minimum order quantity
              </p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Shrinkage Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {fabric.fabricType?.avgShrinkagePct || 0}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Used In</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {fabric.variations?.length || 0} variations
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showTransactionForm && (
        <Card title="Record Transaction">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="INWARD">Inward (Receipt)</option>
                  <option value="OUTWARD">Outward (Usage)</option>
                </select>
              </div>
              <Input label="Quantity (meters)" type="number" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="SUPPLIER_RECEIPT">Supplier Receipt</option>
                <option value="PRODUCTION">Production</option>
                <option value="SHRINKAGE">Shrinkage</option>
                <option value="DAMAGE">Damage</option>
                <option value="ADJUSTMENT">Adjustment</option>
              </select>
            </div>
            <Input label="Notes (Optional)" />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowTransactionForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Record Transaction</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Transaction History">
        {transactions && transactions.length > 0 ? (
          <Table
            data={transactions}
            columns={[
              {
                header: 'Date',
                accessor: (row: any) =>
                  new Date(row.createdAt).toLocaleDateString(),
              },
              {
                header: 'Type',
                accessor: (row: any) => (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    row.txnType === 'INWARD'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.txnType}
                  </span>
                ),
              },
              {
                header: 'Quantity',
                accessor: (row: any) => (
                  <span className={row.txnType === 'INWARD' ? 'text-green-600' : 'text-red-600'}>
                    {row.txnType === 'INWARD' ? '+' : '-'}{row.qty} m
                  </span>
                ),
              },
              { header: 'Reason', accessor: 'reason' as const },
              { header: 'Notes', accessor: (row: any) => row.notes || '-' },
            ]}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        )}
      </Card>
    </div>
  );
}
