import { PageHeading } from "@/components/PageHeading";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeading
          title="Services"
          subtitle="Welcome back! Here's what's happening with your campaigns."
        />
      </div>
    </div>
  );
}
