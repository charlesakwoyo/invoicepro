// src/components/sections/InvoicesSection.tsx
"use client";
import NewInvoiceModal from '../invoices/NewInvoiceModel';
import { useState, useMemo } from 'react';
import { 
  FiDollarSign, 
  FiCheck, 
  FiClock, 
  FiAlertTriangle, 
  FiSearch, 
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

const statuses = ['All', 'Paid', 'Pending', 'Overdue'] as const;
const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Amount (High to Low)' },
  { value: 'amount-asc', label: 'Amount (Low to High)' },
];

const mockInvoices: Invoice[] = [
  {
    id: "QP-2045",
    client: "Acme Ltd",
    amount: 1240.00,
    status: "Paid",
    date: "2026-01-10",
    dueDate: "2026-02-10",
    items: [
      { description: "Website Redesign", quantity: 1, unitPrice: 1000 },
      { description: "Hosting (1 year)", quantity: 1, unitPrice: 240 }
    ]
  },
  {
    id: "QP-2046",
    client: "BlueTech",
    amount: 620.00,
    status: "Pending",
    date: "2026-01-12",
    dueDate: "2026-02-12",
    items: [
      { description: "Mobile App Development", quantity: 1, unitPrice: 500 },
      { description: "API Integration", quantity: 1, unitPrice: 120 }
    ]
  },
  {
    id: "QP-2047",
    client: "Nova Corp",
    amount: 980.00,
    status: "Overdue",
    date: "2026-01-14",
    dueDate: "2026-01-31",
    items: [
      { description: "E-commerce Setup", quantity: 1, unitPrice: 800 },
      { description: "Payment Gateway", quantity: 1, unitPrice: 180 }
    ]
  },
  // Add more sample data
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `QP-${2048 + i}`,
    client: `Client ${i + 1}`,
    amount: 500 + (i * 100),
    status: ['Paid', 'Pending', 'Overdue'][i % 3] as InvoiceStatus,
    date: `2026-01-${15 + (i % 15)}`,
    dueDate: `2026-02-${15 + (i % 15)}`,
    items: [
      { description: `Service ${i + 1}`, quantity: 1, unitPrice: 400 + (i * 50) },
      { description: `Additional Service ${i + 1}`, quantity: 1, unitPrice: 100 + (i * 10) }
    ]
  }))
];

const statusStyles = {
  Paid: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheck },
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock },
  Overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: FiAlertTriangle },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function InvoicesSection() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [invoiceBeingEdited, setInvoiceBeingEdited] = useState<Invoice | null>(null);
  const [invoiceBeingDeleted, setInvoiceBeingDeleted] = useState<Invoice | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSavingInvoice, setIsSavingInvoice] = useState(false);
  const [isDeletingInvoice, setIsDeletingInvoice] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [paymentFields, setPaymentFields] = useState({
    phone: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof statuses[number]>('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const [sortField, sortOrder] = sortBy.split('-');
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePayNow = (invoice: Invoice) => {
    if (invoice.status === 'Paid') return;
    setPaymentInvoice(invoice);
    setPaymentMethod('mpesa');
    setPaymentFields({
      phone: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    });
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentSuccess(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentInvoice(null);
    setPaymentSuccess(false);
  };

  const calculateInvoiceTotal = (items: Invoice['items']) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * 0.16;
    return Number((subtotal + tax).toFixed(2));
  };

  const generateInvoiceId = (existing: Invoice[]) => {
    const maxNumber = existing.reduce((max, inv) => {
      const match = /^QP-(\d+)$/.exec(inv.id);
      if (!match) return max;
      return Math.max(max, Number(match[1]));
    }, 2044);
    return `QP-${maxNumber + 1}`;
  };

  const openCreateInvoiceModal = () => {
    setInvoiceBeingEdited(null);
    setIsNewInvoiceModalOpen(true);
  };

  const openEditInvoiceModal = (invoice: Invoice) => {
    setInvoiceBeingEdited(invoice);
    setIsNewInvoiceModalOpen(true);
  };

  const openDeleteInvoiceModal = (invoice: Invoice) => {
    setInvoiceBeingDeleted(invoice);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteInvoiceModal = () => {
    setIsDeleteConfirmOpen(false);
    setInvoiceBeingDeleted(null);
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceBeingDeleted) return;
    setIsDeletingInvoice(true);
    try {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceBeingDeleted.id));
      if (selectedInvoice?.id === invoiceBeingDeleted.id) {
        setSelectedInvoice(null);
      }
      if (paymentInvoice?.id === invoiceBeingDeleted.id) {
        closePaymentModal();
      }
      setCurrentPage(1);
      closeDeleteInvoiceModal();
    } finally {
      setIsDeletingInvoice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your invoices and payments</p>
        </div>
        <button
          onClick={openCreateInvoiceModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as typeof statuses[number]);
                setCurrentPage(1);
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedInvoices.map((invoice) => {
                const status = statusStyles[invoice.status];
                const StatusIcon = status.icon;
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.bg} ${status.text}`}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handlePayNow(invoice)}
                          disabled={invoice.status === 'Paid'}
                          className={`${
                            invoice.status === 'Paid'
                              ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm`}
                        >
                          {invoice.status === 'Paid' ? (
                            <span>Paid <FiCheck className="ml-1 h-3 w-3" /></span>
                          ) : (
                            <>
                              <FiDollarSign className="mr-1 h-3 w-3" />
                              Pay Now
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          disabled={isSavingInvoice || isDeletingInvoice}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditInvoiceModal(invoice)}
                          disabled={isSavingInvoice || isDeletingInvoice}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiEdit2 className="mr-1 h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteInvoiceModal(invoice)}
                          disabled={isSavingInvoice || isDeletingInvoice}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white dark:bg-gray-700 dark:border-red-600 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 className="mr-1 h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredInvoices.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Detail View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Invoice {selectedInvoice.id}</h3>
                  <p className="text-sm text-gray-500">Issued on {formatDate(selectedInvoice.date)}</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Bill To</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.client}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-medium text-gray-500">Amount Due</h4>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {formatCurrency(selectedInvoice.amount)}
                    </p>
                    <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[selectedInvoice.status].bg
                    } ${statusStyles[selectedInvoice.status].text}`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-900">Items</h4>
                  <div className="mt-2 border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-4 text-sm text-gray-900">{item.description}</td>
                            <td className="px-3 py-4 text-sm text-gray-500 text-right">{item.quantity}</td>
                            <td className="px-3 py-4 text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-4 text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="text-right text-sm font-medium text-gray-700 py-2">
                            Subtotal
                          </td>
                          <td className="text-right text-sm font-medium text-gray-900 py-2">
                            {formatCurrency(selectedInvoice.amount)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right text-sm font-medium text-gray-700 py-2">
                            Tax (0%)
                          </td>
                          <td className="text-right text-sm font-medium text-gray-900 py-2">
                            {formatCurrency(0)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right text-sm font-bold text-gray-900 py-2">
                            Total
                          </td>
                          <td className="text-right text-sm font-bold text-gray-900 py-2">
                            {formatCurrency(selectedInvoice.amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => openEditInvoiceModal(selectedInvoice)}
                  disabled={isSavingInvoice || isDeletingInvoice}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteInvoiceModal(selectedInvoice)}
                  disabled={isSavingInvoice || isDeletingInvoice}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded text-red-700 bg-white dark:bg-gray-700 dark:border-red-600 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
                {selectedInvoice.status !== 'Paid' && (
                  <button
                    type="button"
                    onClick={() => handlePayNow(selectedInvoice)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiDollarSign className="mr-2 h-4 w-4" />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <NewInvoiceModal
        key={`${isNewInvoiceModalOpen ? 'open' : 'closed'}-${invoiceBeingEdited?.id ?? 'new'}`}
        isOpen={isNewInvoiceModalOpen}
        onClose={() => {
          setIsNewInvoiceModalOpen(false);
          setInvoiceBeingEdited(null);
        }}
        initialData={
          invoiceBeingEdited
            ? {
                clientName: invoiceBeingEdited.client,
                items: invoiceBeingEdited.items,
                dueDate: invoiceBeingEdited.dueDate,
                notes: '',
              }
            : undefined
        }
        onSave={async (invoiceData) => {
          setIsSavingInvoice(true);
          try {
            const nextItems = invoiceData.items;
            const nextAmount = calculateInvoiceTotal(nextItems);

            if (invoiceBeingEdited) {
              setInvoices(prev =>
                prev.map(inv =>
                  inv.id === invoiceBeingEdited.id
                    ? {
                        ...inv,
                        client: invoiceData.clientName,
                        items: nextItems,
                        dueDate: invoiceData.dueDate,
                        amount: nextAmount,
                      }
                    : inv
                )
              );

              if (selectedInvoice?.id === invoiceBeingEdited.id) {
                setSelectedInvoice(prev =>
                  prev
                    ? {
                        ...prev,
                        client: invoiceData.clientName,
                        items: nextItems,
                        dueDate: invoiceData.dueDate,
                        amount: nextAmount,
                      }
                    : prev
                );
              }

              if (paymentInvoice?.id === invoiceBeingEdited.id) {
                setPaymentInvoice(prev =>
                  prev
                    ? {
                        ...prev,
                        client: invoiceData.clientName,
                        items: nextItems,
                        dueDate: invoiceData.dueDate,
                        amount: nextAmount,
                      }
                    : prev
                );
              }
            } else {
              const today = new Date().toISOString().split('T')[0];
              const newInvoice: Invoice = {
                id: generateInvoiceId(invoices),
                client: invoiceData.clientName,
                items: nextItems,
                amount: nextAmount,
                status: 'Pending',
                date: today,
                dueDate: invoiceData.dueDate,
              };
              setInvoices(prev => [newInvoice, ...prev]);
              setCurrentPage(1);
            }

            setIsNewInvoiceModalOpen(false);
            setInvoiceBeingEdited(null);
          } finally {
            setIsSavingInvoice(false);
          }
        }}
      />

      {isDeleteConfirmOpen && invoiceBeingDeleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delete invoice</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {invoiceBeingDeleted.id} • {invoiceBeingDeleted.client}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteInvoiceModal}
                disabled={isDeletingInvoice}
                className="rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              This action cannot be undone.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteInvoiceModal}
                disabled={isDeletingInvoice}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteInvoice}
                disabled={isDeletingInvoice}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && paymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pay Invoice</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {paymentInvoice.id} • {formatCurrency(paymentInvoice.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={closePaymentModal}
                className="rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <h3 className="text-sm font-semibold">Payment successful</h3>
                <p className="text-sm">Your mock payment was processed successfully.</p>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="mt-4 inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      paymentMethod === 'mpesa'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    }`}
                  >
                    Mpesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    }`}
                  >
                    Card
                  </button>
                </div>

                {paymentMethod === 'mpesa' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Mpesa Phone Number
                    </label>
                    <input
                      type="tel"
                      value={paymentFields.phone}
                      onChange={(e) =>
                        setPaymentFields((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="2547XXXXXXXX"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Name on Card
                      </label>
                      <input
                        value={paymentFields.cardName}
                        onChange={(e) =>
                          setPaymentFields((prev) => ({ ...prev, cardName: e.target.value }))
                        }
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Card Number
                      </label>
                      <input
                        value={paymentFields.cardNumber}
                        onChange={(e) =>
                          setPaymentFields((prev) => ({ ...prev, cardNumber: e.target.value }))
                        }
                        placeholder="4242 4242 4242 4242"
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Expiry
                        </label>
                        <input
                          value={paymentFields.cardExpiry}
                          onChange={(e) =>
                            setPaymentFields((prev) => ({ ...prev, cardExpiry: e.target.value }))
                          }
                          placeholder="MM/YY"
                          required
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          CVV
                        </label>
                        <input
                          value={paymentFields.cardCvv}
                          onChange={(e) =>
                            setPaymentFields((prev) => ({ ...prev, cardCvv: e.target.value }))
                          }
                          placeholder="123"
                          required
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closePaymentModal}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}