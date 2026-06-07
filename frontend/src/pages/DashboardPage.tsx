import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";

const stats = [
  { label: "Prescriptions", value: "—" },
  { label: "Medicines", value: "—" },
  { label: "Active Reminders", value: "—" },
  { label: "Interactions Found", value: "—" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your medication management" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Dashboard charts and activity — coming soon
      </div>
    </div>
  );
}
