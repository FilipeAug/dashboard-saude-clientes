
import React from "react";
import StatCard from "./StatCard";
import { Users, BarChart, ChartLine, ArrowUp } from "lucide-react";
import { DashboardData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  dashboardData: DashboardData;
}

const DashboardStats = ({ dashboardData }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total de Clientes"
        value={dashboardData?.totalClientes || 0}
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard
        title="Fee Total"
        value={formatCurrency(dashboardData?.totalFee || 0)}
        icon={<BarChart className="h-6 w-6" />}
      />
      <StatCard
        title="LT Médio"
        value={(dashboardData?.ltMedio || 0).toFixed(1) + " meses"}
        icon={<ChartLine className="h-6 w-6" />}
      />
      <StatCard
        title="Ticket Médio"
        value={formatCurrency(dashboardData?.ticketMedio || 0)}
        icon={<ArrowUp className="h-6 w-6" />}
      />
    </div>
  );
};

export default DashboardStats;
