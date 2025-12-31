import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export function FabricList() {
  const navigate = useNavigate();

  const { data: fabrics, isLoading, error } = useQuery({
    queryKey: ['fabrics'],
    queryFn: () => api.getFabrics(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading fabrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading fabrics. Make sure the API server is running.
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
      header: 'Type',
      accessor: (row: any) => row.fabricType?.name || '-',
    },
    {
      header: 'Color',
      accessor: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.colorHex && (
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: row.colorHex }}
            />
          )}
          <span>{row.colorName}</span>
        </div>
      ),
    },
    {
      header: 'Cost/Unit',
      accessor: (row: any) => `₹${row.costPerUnit}`,
    },
    {
      header: 'Balance',
      accessor: (row: any) => {
        const balance = row.balance || 0;
        return (
          <span className={balance < 50 ? 'text-red-600 font-medium' : ''}>
            {balance.toFixed(2)} m
          </span>
        );
      },
    },
    {
      header: 'Lead Time',
      accessor: (row: any) => `${row.leadTimeDays} days`,
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
          <h1 className="text-2xl font-bold text-gray-900">Fabrics</h1>
          <p className="text-gray-600">Manage fabric inventory</p>
        </div>
        <Button onClick={() => navigate('/fabrics/new')}>
          + Add Fabric
        </Button>
      </div>

      <Card>
        <Table
          data={fabrics || []}
          columns={columns}
          onRowClick={(row) => navigate(`/fabrics/${row.id}`)}
        />
      </Card>
    </div>
  );
}
