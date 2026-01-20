"use client";

import { useState } from "react";
import { useDashboardStore } from "../store/dashboardStore";

interface InvoiceDetails {
  id: string;
  client: string;
  amount: string;
  status: string;
  date: string;
  items?: { name: string; qty: number; price: string }[];
}

export default function InvoicePanel() {
  const { selectedInvoice, setSelectedInvoice } = useDashboardStore();
  
  if (!selectedInvoice) return null; // hide if no invoice selected

  return (
    <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md md:max-w-lg bg-white shadow-xl overflow-y-auto transition-transform transform translate-x-0">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Invoice {selectedInvoice.id}</h2>
        <button onClick={() => setSelectedInvoice(null)} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      <div className="p-6 space-y-4 text-gray-900">
        <p><span className="font-semibold">Client:</span> {selectedInvoice.client}</p>
        <p><span className="font-semibold">Amount:</span> {selectedInvoice.amount}</p>
        <p><span className="font-semibold">Status:</span> {selectedInvoice.status}</p>
        <p><span className="font-semibold">Date:</span> {selectedInvoice.date}</p>

        {selectedInvoice.items && (
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <ul className="list-disc list-inside text-gray-700">
              {selectedInvoice.items.map((item: { name: string; qty: number; price: string }, idx: number) => (
                <li key={idx}>
                  {item.name} - {item.qty} x {item.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
