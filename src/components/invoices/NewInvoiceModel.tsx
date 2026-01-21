"use client";

import { useState } from 'react';
import { FiX, FiUser, FiFileText, FiDollarSign, FiCalendar, FiPlus, FiMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: {
    clientName: string;
    items: InvoiceItem[];
    dueDate: string;
    notes: string;
  }) => void;
  initialData?: {
    clientName: string;
    items: InvoiceItem[];
    dueDate: string;
    notes: string;
  };
}

const NewInvoiceModal = ({ isOpen, onClose, onSave, initialData }: NewInvoiceModalProps) => {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items?.length ? initialData.items : [{ description: '', quantity: 1, unitPrice: 0 }]
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [currentStep, setCurrentStep] = useState<'details' | 'preview'>('details');

  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice), 
    0
  );
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'details') {
      setCurrentStep('preview');
    } else {
      onSave({
        clientName,
        items: items.filter(item => item.description && item.quantity > 0 && item.unitPrice >= 0),
        dueDate,
        notes
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div 
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left shadow-xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {currentStep === 'details' 
                ? initialData ? 'Edit Invoice' : 'Create New Invoice' 
                : 'Review Invoice'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 'details' ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Form fields for invoice details */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Client name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="date"
                          required
                          value={dueDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Invoice items management */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Items <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <FiPlus className="mr-1 h-4 w-4" /> Add Item
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-3 items-start">
                            <div className="col-span-6">
                              <input
                                type="text"
                                required
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Item description"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Qty"
                              />
                            </div>
                            <div className="col-span-3">
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-slate-500 sm:text-sm">KSh</span>
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  required
                                  value={item.unitPrice || ''}
                                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                  className="block w-full pl-7 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div className="col-span-1 flex justify-center">
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  title="Remove item"
                                >
                                  <FiMinus className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Additional notes or terms"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Invoice Preview */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Invoice Preview</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Review before saving</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Due Date</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bill To:</h4>
                        <p className="text-slate-900 dark:text-white">{clientName}</p>
                      </div>

                      <div className="border-t border-b border-slate-200 dark:border-slate-700 py-2 mb-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          <div className="col-span-6">Item</div>
                          <div className="col-span-2 text-right">Qty</div>
                          <div className="col-span-3 text-right">Price</div>
                          <div className="col-span-1"></div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-4 items-center text-sm">
                            <div className="col-span-6 text-slate-900 dark:text-white">{item.description}</div>
                            <div className="col-span-2 text-right text-slate-500 dark:text-slate-400">
                              {item.quantity}
                            </div>
                            <div className="col-span-3 text-right text-slate-900 dark:text-white">
                              KSh {item.unitPrice.toFixed(2)}
                            </div>
                            <div className="col-span-1"></div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                          <span className="text-slate-900 dark:text-white">KSh {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Tax (16%)</span>
                          <span className="text-slate-900 dark:text-white">KSh {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">KSh {total.toFixed(2)}</span>
                        </div>
                      </div>

                      {notes && (
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={currentStep === 'details' ? onClose : () => setCurrentStep('details')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentStep === 'details' ? 'Cancel' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentStep === 'details' ? 'Continue to Review' : 'Save Invoice'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewInvoiceModal;