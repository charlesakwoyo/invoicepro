"use client";

const clients = [
  { name: "Acme Ltd", email: "contact@acme.com", totalInvoices: 12 },
  { name: "BlueTech", email: "hello@bluetech.com", totalInvoices: 5 },
  { name: "Nova Corp", email: "info@nova.com", totalInvoices: 8 },
];

export default function ClientsSection() {
  return (
    <div className="p-6 md:p-8 text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      <div className="overflow-x-auto bg-white border rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Total Invoices</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client.email} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{client.name}</td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4">{client.totalInvoices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
