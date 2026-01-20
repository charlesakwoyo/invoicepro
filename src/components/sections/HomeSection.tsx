// src/components/sections/HomeSection.tsx
"use client";

import { useDashboardStore } from '../store/dashboardStore';

export default function HomeSection() {
  const { user } = useDashboardStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name.split(' ')[0]}!
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Total Revenue', value: '$24,780', change: '+12%', changeType: 'increase' },
          { name: 'Active Clients', value: '1,429', change: '+8%', changeType: 'increase' },
          { name: 'Pending Invoices', value: '24', change: '-2%', changeType: 'decrease' },
          { name: 'Paid This Month', value: '$8,420', change: '+5%', changeType: 'increase' },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center">
                    <span className="text-xl font-bold">{stat.value}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { id: 1, type: 'payment', description: 'Payment received from Acme Inc.', amount: '$1,200', time: '2h ago' },
              { id: 2, type: 'invoice', description: 'New invoice sent to John Smith', amount: '$850', time: '5h ago' },
              { id: 3, type: 'client', description: 'New client added: Sarah Johnson', amount: '', time: '1d ago' },
              { id: 4, type: 'payment', description: 'Payment received from TechCorp', amount: '$3,450', time: '2d ago' },
              { id: 5, type: 'invoice', description: 'Invoice #1005 marked as paid', amount: '$1,750', time: '3d ago' },
            ].map((activity) => (
              <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      {activity.type === 'payment' ? (
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : activity.type === 'invoice' ? (
                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.amount}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
