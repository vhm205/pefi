
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { fundService } from '../../services/fund';
import { PageLoading } from '../../components/PageLoading';
import FundModal from './components/FundModal';
import type { Fund, CreateFundDTO } from '../../services/fund';
import { useNotification } from '../../hooks/useNotification';

export default function FundsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const notify = useNotification();

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['funds', currentPage, itemsPerPage],
    queryFn: () => fundService.getAll(currentPage, itemsPerPage),
  });

  const createMutation = useMutation({
    mutationFn: fundService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      notify.success('Fund created successfully');
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      fundService.update(id, data as Partial<CreateFundDTO>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      notify.success('Fund updated successfully');
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: fundService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      notify.success('Fund deleted successfully');
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fund?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (formData: CreateFundDTO) => {
    if (selectedFund) {
      await updateMutation.mutateAsync({
        id: selectedFund.name,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const filteredFunds = data?.data.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <PageLoading />;
  if (error) return <div>Error: {error.message}</div>;

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-grow">
          <div className="relative flex-1" style={{ maxWidth: '600px', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search funds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedFund(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Fund
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFunds.map((fund) => (
                <tr
                  key={fund.name}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{fund.name}</td>
                  <td className="px-6 py-4">{fund.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedFund(fund);
                          setIsModalOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                        title="Edit fund"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fund.name)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                        title="Delete fund"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              <ChevronsLeft className="h-4 w-4" />
              First
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              Last
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <FundModal
        isOpen={isModalOpen}
        fund={selectedFund}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

