import { create } from 'zustand';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'An unknown error occurred';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'draft' | 'pending' | 'pending_payment' | 'paid' | 'overdue' | 'processing' | 'failed';
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  paymentInitiatedAt?: string;
}

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  processPayment: (invoiceId: string) => Promise<boolean>;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      set({ invoices: data, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  getInvoice: (id: string) => {
    return get().invoices.find(invoice => invoice.id === id);
  },

  createInvoice: async (invoice) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoice,
          status: 'pending',
          createdAt: new Date().toISOString()
        }),
      });
      if (!response.ok) throw new Error('Failed to create invoice');
      const newInvoice = await response.json();
      set(state => ({
        invoices: [...state.invoices, newInvoice],
        loading: false 
      }));
      return newInvoice;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      if (error instanceof Error) throw error;
      throw new Error(message);
    }
  },

  updateInvoice: async (id, updates) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        }),
      });
      if (!response.ok) throw new Error('Failed to update invoice');
      const updated = await response.json();
      set(state => ({
        invoices: state.invoices.map(inv => 
          inv.id === id ? { ...inv, ...updated } : inv
        ),
        selectedInvoice: state.selectedInvoice?.id === id 
          ? { ...state.selectedInvoice, ...updated } 
          : state.selectedInvoice,
        loading: false
      }));
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      if (error instanceof Error) throw error;
      throw new Error(message);
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete invoice');
      set(state => ({
        invoices: state.invoices.filter(inv => inv.id !== id),
        selectedInvoice: state.selectedInvoice?.id === id ? null : state.selectedInvoice,
        loading: false
      }));
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      if (error instanceof Error) throw error;
      throw new Error(message);
    }
  },

  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),

  processPayment: async (invoiceId) => {
    set({ loading: true });
    try {
      // Update status to processing
      await get().updateInvoice(invoiceId, { status: 'processing' });
      
      // Get invoice amount
      const invoice = get().getInvoice(invoiceId);
      if (!invoice) throw new Error('Invoice not found');
      
      // Call STK push API
      const response = await fetch('/api/payments/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          amount: invoice.amount,
        }),
      });

      if (!response.ok) {
        await get().updateInvoice(invoiceId, { status: 'failed' });
        return false;
      }

      // If we get here, payment was initiated successfully
      await get().updateInvoice(invoiceId, { 
        status: 'pending_payment',
        paymentInitiatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      await get().updateInvoice(invoiceId, { status: 'failed' });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
