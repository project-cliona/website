'use client'

import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export default function CampaignReports() {
  const [filters, setFilters] = useState({
    userName: 'All Users',
    dateType: 'Day',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const users = [
    { id: '1', name: 'All Users' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Jane Smith' },
    { id: '4', name: 'Mike Johnson' },
    { id: '5', name: 'Sarah Wilson' }
  ]

  const campaigns = [
    {
      id: '1',
      campaignName: 'Holiday Sale 2024',
      agentName: 'E-commerce Store',
      templateName: 'Holiday Sale',
      userName: 'John Doe',
      scheduledTime: '2024-01-15 10:30 AM',
      actualSentTime: '2024-01-15 10:32 AM',
      messageCount: 1250,
      deliveryRate: 95.8,
      readRate: 71.4,
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: '2',
      campaignName: 'Account Statement Alert',
      agentName: 'Banking Services',
      templateName: 'Account Statement',
      userName: 'Jane Smith',
      scheduledTime: '2024-01-15 02:00 PM',
      actualSentTime: '2024-01-15 02:01 PM',
      messageCount: 856,
      deliveryRate: 97.4,
      readRate: 75.3,
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: '3',
      campaignName: 'OTP Service Alert',
      agentName: 'Healthcare OTP',
      templateName: 'Login Verification',
      userName: 'Mike Johnson',
      scheduledTime: '2024-01-14 09:45 AM',
      actualSentTime: '2024-01-14 09:45 AM',
      messageCount: 3420,
      deliveryRate: 99.4,
      readRate: 100.0,
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: '4',
      campaignName: 'Cart Abandonment Reminder',
      agentName: 'E-commerce Store',
      templateName: 'Cart Abandonment',
      userName: 'Sarah Wilson',
      scheduledTime: '2024-01-13 06:00 PM',
      actualSentTime: 'Pending',
      messageCount: 2105,
      deliveryRate: 0,
      readRate: 0,
      status: 'Scheduled',
      downloadUrl: '#'
    },
    {
      id: '5',
      campaignName: 'Welcome Series',
      agentName: 'Travel Agency',
      templateName: 'Booking Confirmation',
      userName: 'David Brown',
      scheduledTime: '2024-01-12 11:00 AM',
      actualSentTime: '2024-01-12 11:02 AM',
      messageCount: 678,
      deliveryRate: 94.2,
      readRate: 68.9,
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: '6',
      campaignName: 'Payment Reminder',
      agentName: 'Banking Services',
      templateName: 'Payment Due',
      userName: 'Emily Davis',
      scheduledTime: '2024-01-11 09:00 AM',
      actualSentTime: 'Failed',
      messageCount: 1834,
      deliveryRate: 0,
      readRate: 0,
      status: 'Failed',
      downloadUrl: '#'
    }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.userName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesUser = filters.userName === 'All Users' || campaign.userName === filters.userName
    
    return matchesSearch && matchesUser
  })

  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700'
      case 'Sending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDownload = (campaignId: string, campaignName: string) => {
    console.log(`Downloading report for campaign ${campaignId}: ${campaignName}`)
    alert(`Download initiated for: ${campaignName}`)
  }

  const exportAllReports = () => {
    console.log('Exporting all campaign reports...', { filters, campaigns: filteredCampaigns })
    alert('Export all reports initiated!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Reports</h1>
          <button 
            onClick={exportAllReports}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <span className="mr-2">📊</span>
            Export All Reports
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                value={filters.userName}
                onChange={(e) => handleFilterChange('userName', e.target.value)}
              >
                {users.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Type
              </label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                value={filters.dateType}
                onChange={(e) => handleFilterChange('dateType', e.target.value)}
              >
                <option value="Day">Day</option>
                <option value="Range">Date Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filters.dateType === 'Day' ? 'Date' : 'Start Date'}
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            {filters.dateType === 'Range' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <input
            type="text"
            placeholder="Search campaigns, agents, templates, or users..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Campaign Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredCampaigns.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Campaigns</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredCampaigns.filter(c => c.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredCampaigns.filter(c => c.status === 'Scheduled').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Scheduled</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredCampaigns.filter(c => c.status === 'Failed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Failed</div>
            </div>
          </div>
        </div>

        {/* Campaign Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownload(campaign.id, campaign.campaignName)}
                        disabled={campaign.status === 'Scheduled' || campaign.status === 'Failed'}
                        className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        ⬇️
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.campaignName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.agentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.templateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{campaign.scheduledTime}</div>
                      {campaign.actualSentTime !== 'Pending' && campaign.actualSentTime !== 'Failed' && (
                        <div className="text-xs text-green-600">
                          Sent: {campaign.actualSentTime}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {campaign.messageCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {campaign.deliveryRate > 0 ? (
                        <span className={`font-medium ${
                          campaign.deliveryRate >= 95 ? 'text-green-600' :
                          campaign.deliveryRate >= 90 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {campaign.deliveryRate}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {campaign.readRate > 0 ? (
                        <span className={`font-medium ${
                          campaign.readRate >= 70 ? 'text-green-600' :
                          campaign.readRate >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {campaign.readRate}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{filteredCampaigns.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}