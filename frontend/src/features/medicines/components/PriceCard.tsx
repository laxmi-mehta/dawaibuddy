import { Bell, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PriceCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-small text-muted">Average price</p>
        <Badge variant="success" size="sm">In stock</Badge>
      </div>
      <p className="mt-2">
        <span className="text-h1 font-extrabold text-ink">₹42</span>
        <span className="ml-1 text-small text-muted">/ pack of 15</span>
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Button size="lg" className="w-full">
          <Bell className="h-5 w-5" strokeWidth={2} /> Set a reminder
        </Button>
        <Button variant="ghost" size="lg" className="w-full">
          <Download className="h-5 w-5" strokeWidth={2} /> Save to my medicines
        </Button>
      </div>
    </Card>
  );
}
