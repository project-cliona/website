'use client'

import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export default function DeliveryReports() {
  const [filters, setFilters] = useState({
    userName: '',
    dateType: 'Day',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    uploadSource: 'All'
  })

  const users = [
    { id: '1', name: 'All Users' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Jane Smith' },
    { id: '4', name: 'Mike Johnson' }
  ]

  // Mock delivery data
  const deliveryData = {
    totalSubmitted: 10450,
    sent: 10234,
    delivered: 9856,
    undelivered: 378,
    read: 7234
  }

  const deliveryDetails = [
    {
      id: '1',
      campaignName: 'Holiday Sale 2024',
      agentName: 'E-commerce Store',
      userName: 'John Doe',
      submissionTime: '2024-01-15 10:30 AM',
      totalNumbers: 1250,
      sent: 1245,
      delivered: 1198,
      undelivered: 47,
      read: 892,
      uploadSource: 'File Upload'
    },
    {
      id: '2',
      campaignName: 'Account Statement',
      agentName: 'Banking Services',
      userName: 'Jane Smith',
      submissionTime: '2024-01-15 02:15 PM',
      totalNumbers: 856,
      sent: 856,
      delivered: 834,
      undelivered: 22,
      read: 645,
      uploadSource: 'Manual Entry'
    },
    {
      id: '3',
      campaignName: 'OTP Verification',
      agentName: 'Healthcare OTP',
      userName: 'Mike Johnson',
      submissionTime: '2024-01-14 09:45 AM',
      totalNumbers: 3420,
      sent: 3420,
      delivered: 3398,
      undelivered: 22,
      read: 3398,
      uploadSource: 'File Upload'
    }
  ]

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const exportToExcel = () => {
    console.log('Exporting to Excel...', { filters, deliveryData, deliveryDetails })
    alert('Export to Excel initiated!')
  }

  const downloadReport = () => {
    console.log('Downloading report...', { filters, deliveryData, deliveryDetails })
    alert('Report download initiated!')
  }

  const getDeliveryRate = () => {
    return ((deliveryData.delivered / deliveryData.sent) * 100).toFixed(1)
  }

  const getReadRate = () => {
    return ((deliveryData.read / deliveryData.delivered) * 100).toFixed(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Reports</h1>
          <div className="flex gap-2">
            <button 
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <span className="mr-2">📊</span>
              Export to Excel
            </button>
            <button 
              onClick={downloadReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">⬇️</span>
              Download
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Source
              </label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                value={filters.uploadSource}
                onChange={(e) => handleFilterChange('uploadSource', e.target.value)}
              >
                <option value="All">All Sources</option>
                <option value="File Upload">File Upload</option>
                <option value="Manual Entry">Manual Entry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{deliveryData.totalSubmitted.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Submitted</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{deliveryData.sent.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Sent</div>
              <div className="text-xs text-green-500">
                {((deliveryData.sent / deliveryData.totalSubmitted) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{deliveryData.delivered.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Delivered</div>
              <div className="text-xs text-blue-500">{getDeliveryRate()}%</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{deliveryData.undelivered.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Undelivered</div>
              <div className="text-xs text-red-500">
                {((deliveryData.undelivered / deliveryData.sent) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{deliveryData.read.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Read</div>
              <div className="text-xs text-purple-500">{getReadRate()}%</div>
            </div>
          </div>
        </div>

        {/* Delivery Funnel Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Funnel</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Submitted</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="w-20 text-right text-sm font-medium ml-4">{deliveryData.totalSubmitted.toLocaleString()}</div>
            </div>

            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Sent</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div className="bg-green-500 h-4 rounded-full" style={{width: `${(deliveryData.sent / deliveryData.totalSubmitted) * 100}%`}}></div>
              </div>
              <div className="w-20 text-right text-sm font-medium ml-4">{deliveryData.sent.toLocaleString()}</div>
            </div>

            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Delivered</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: `${(deliveryData.delivered / deliveryData.totalSubmitted) * 100}%`}}></div>
              </div>
              <div className="w-20 text-right text-sm font-medium ml-4">{deliveryData.delivered.toLocaleString()}</div>
            </div>

            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Read</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                <div className="bg-purple-500 h-4 rounded-full" style={{width: `${(deliveryData.read / deliveryData.totalSubmitted) * 100}%`}}></div>
              </div>
              <div className="w-20 text-right text-sm font-medium ml-4">{deliveryData.read.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Delivery Reports</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Numbers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Undelivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryDetails.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.campaignName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.agentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.submissionTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.totalNumbers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {report.sent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {report.delivered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {report.undelivered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                      {report.read.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        report.uploadSource === 'File Upload' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {report.uploadSource}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}