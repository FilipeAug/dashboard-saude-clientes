
import React from "react";
import StatusPieChart from "./StatusPieChart";
import SquadMetricsChart from "./SquadMetricsChart";
import { DashboardData } from "@/lib/types";

interface DashboardChartsProps {
  dashboardData: DashboardData;
  squadFilter: string;
}

const DashboardCharts = ({ dashboardData, squadFilter }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <StatusPieChart 
          data={dashboardData?.clientesPorStatus || []} 
          title="Status dos Clientes" 
        />
      </div>
      <div>
        <SquadMetricsChart data={dashboardData?.clientesPorSquad.filter(
          squad => squadFilter === "all" || squad.nome === squadFilter
        ) || []} />
      </div>
    </div>
  );
};

export default DashboardCharts;
