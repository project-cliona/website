import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "../../../components/ui/StatsCard";
import { BarChart, Send, CheckCircle, Users } from 'lucide-react';

const statsData = [
  {
    label: "Total Campaigns",
    value: "24",
    icon: <BarChart className="h-4 w-4" />,
    trend: { value: "+12%", positive: true },
  },
  {
    label: "RCS Sent",
    value: "1,247",
    icon: <Send className="h-4 w-4" />,
    trend: { value: "+8%", positive: true },
  },
  {
    label: "Delivery Rate",
    value: "94.2%",
    icon: <CheckCircle className="h-4 w-4" />,
    trend: { value: "+2.1%", positive: true },
  },
  {
    label: "Active Agents",
    value: "8",
    icon: <Users className="h-4 w-4" />,
    trend: { value: "+1", positive: true },
  },
];


export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeading
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your campaigns."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Campaigns
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Holiday Promotion",
                status: "Delivered",
                count: "1,245",
                time: "2 hours ago",
              },
              {
                name: "Cart Abandonment",
                status: "Sending",
                count: "856",
                time: "4 hours ago",
              },
              {
                name: "Welcome Series",
                status: "Completed",
                count: "2,103",
                time: "1 day ago",
              },
            ].map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {campaign.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {campaign.count} messages • {campaign.time}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === "Delivered"
                      ? "bg-green-50 text-green-700"
                      : campaign.status === "Sending"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                >
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
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
        </Card>
      </div>
    </div>
  );
}
