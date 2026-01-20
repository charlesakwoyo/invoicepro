export default function PaymentsTable() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-160 w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Invoice</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-3">INV-001</td>
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3">Jan 12</td>
            <td className="px-4 py-3">$450</td>
            <td className="px-4 py-3">
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                Paid
              </span>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
