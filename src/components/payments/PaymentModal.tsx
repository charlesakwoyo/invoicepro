// src/components/payments/PaymentModal.tsx
"use client";

import { JSX, useState } from 'react';
import { FiX, FiCreditCard, FiDollarSign, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceAmount: number;
  invoiceNumber: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  invoiceAmount, 
  invoiceNumber 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success' | 'error'>('method');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FiCreditCard className="w-5 h-5 text-blue-500" />,
      description: 'Pay with Visa, Mastercard, or American Express',
    },
    {
      id: 'mpesa',
      name: 'M-PESA',
      icon: <FiDollarSign className="w-5 h-5 text-green-500" />,
      description: 'Pay via M-PESA mobile money',
    },
  ];

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s+/g, '')
        .match(/.{1,4}/g)
        ?.join(' ')
        .substr(0, 19) || '';
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    if (name === 'expiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 12);
    let formattedValue = value;
    if (value.startsWith('0')) {
      formattedValue = `254${value.substring(1)}`;
    } else if (value.startsWith('7')) {
      formattedValue = `254${value}`;
    } else if (value.startsWith('254')) {
      formattedValue = value;
    }
    setPhoneNumber(formattedValue);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setPaymentStep('success');
        setTimeout(() => {
          onClose();
          setTimeout(() => {
            setPaymentStep('method');
            setSelectedMethod(null);
            setCardDetails({
              number: '',
              name: '',
              expiry: '',
              cvv: '',
            });
            setPhoneNumber('');
          }, 500);
        }, 2000);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep('error');
    }
  };

  const renderPaymentMethodStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">Select Payment Method</h3>
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedMethod === method.id
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/30 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {method.icon}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">{method.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => selectedMethod && setPaymentStep('details')}
          disabled={!selectedMethod}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderCardPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">Card Details</h3>
      
      <div className="space-y-1">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="number"
          value={cardDetails.number}
          onChange={handleCardInputChange}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="cardName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Name on Card
        </label>
        <input
          type="text"
          id="cardName"
          name="name"
          value={cardDetails.name}
          onChange={handleCardInputChange}
          placeholder="Cardholder Name"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry"
            name="expiry"
            value={cardDetails.expiry}
            onChange={handleCardInputChange}
            placeholder="MM/YY"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleCardInputChange}
            placeholder="123"
            maxLength={4}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setPaymentStep('method')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        >
          ← Back to payment methods
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Pay {formatCurrency(invoiceAmount)}</span>
        </button>
      </div>
    </form>
  );

  const renderMpesaPaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">M-PESA Payment</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          You will receive an M-PESA payment request on your phone. Please check your phone to complete the payment.
        </p>
      </div>
      
      <div className="space-y-1">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 dark:text-slate-400">+</span>
          </div>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="254 7XX XXX XXX"
            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Enter your M-PESA registered phone number
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiDollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Payment Amount
            </h4>
            <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              <p>{formatCurrency(invoiceAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setPaymentStep('method')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        >
          ← Back to payment methods
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Request Payment</span>
        </button>
      </div>
    </form>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        Processing Payment
      </h3>
      <p className="text-slate-500 dark:text-slate-400">
        Please wait while we process your payment...
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
        <FiCheck className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        Payment Successful!
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Your payment of {formatCurrency(invoiceAmount)} has been processed successfully.
      </p>
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300 text-left">
        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
          <span>Invoice Number:</span>
          <span className="font-medium">{invoiceNumber}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
          <span>Amount Paid:</span>
          <span className="font-medium">{formatCurrency(invoiceAmount)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Date:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Done
      </button>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
        <FiAlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        Payment Failed
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        We couldn't process your payment. Please try again or use a different payment method.
      </p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={() => setPaymentStep('method')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

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
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left shadow-xl transition-all"
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
            {paymentStep === 'method' && renderPaymentMethodStep()}
            {paymentStep === 'details' && selectedMethod === 'card' && renderCardPaymentForm()}
            {paymentStep === 'details' && selectedMethod === 'mpesa' && renderMpesaPaymentForm()}
            {paymentStep === 'processing' && renderProcessingStep()}
            {paymentStep === 'success' && renderSuccessStep()}
            {paymentStep === 'error' && renderErrorStep()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentModal;