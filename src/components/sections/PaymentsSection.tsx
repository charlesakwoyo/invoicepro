"use client";

import { FiDollarSign, FiTrendingUp, FiCalendar, FiDownload } from 'react-icons/fi';
import PaymentsTable from "./PaymentsTable";

export default function PaymentsSection() {
  // Mock data - replace with actual data from your API
  const stats = [
    { 
      name: 'Total Revenue', 
      value: '$24,780', 
      change: '+12.5%', 
      changeType: 'increase',
      icon: FiDollarSign 
    },
    { 
      name: 'Pending Payments', 
      value: '$8,240', 
      change: '-2.3%', 
      changeType: 'decrease',
      icon: FiCalendar 
    },
    { 
      name: 'Avg. Transaction', 
      value: '$1,240', 
      change: '+5.7%', 
      changeType: 'increase',
      icon: FiTrendingUp 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your payment activities</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All payments from the last 30 days</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <PaymentsTable />
        </div>
      </div>
    </div>
  );
}
