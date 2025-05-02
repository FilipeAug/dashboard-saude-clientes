
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export default function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("card-gradient overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <span className={cn("text-xs", trend >= 0 ? "text-green-500" : "text-red-500")}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
