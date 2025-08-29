import { DashboardLayout } from '../components/DashboardLayout'
import { StatsCard } from '../components/StatsCard'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Campaigns" 
            value="24" 
            icon="📊" 
            trend="+12%" 
            trendUp={true}
          />
          <StatsCard 
            title="Messages Sent" 
            value="1,247" 
            icon="📤" 
            trend="+8%" 
            trendUp={true}
          />
          <StatsCard 
            title="Delivery Rate" 
            value="94.2%" 
            icon="✅" 
            trend="+2.1%" 
            trendUp={true}
          />
          <StatsCard 
            title="Active Agents" 
            value="8" 
            icon="👥" 
            trend="+1" 
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Campaigns</h3>
            <div className="space-y-4">
              {[
                { name: "Holiday Promotion", status: "Delivered", count: "1,245", time: "2 hours ago" },
                { name: "Cart Abandonment", status: "Sending", count: "856", time: "4 hours ago" },
                { name: "Welcome Series", status: "Completed", count: "2,103", time: "1 day ago" }
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{campaign.count} messages • {campaign.time}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                    campaign.status === 'Sending' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                <span className="mr-2">📱</span>
                Send New Campaign
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <span className="mr-2">📄</span>
                Create Template
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <span className="mr-2">👥</span>
                Add New Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}