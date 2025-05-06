
import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import ChatBox from "./ChatBox";

const Dashboard = () => {
  const {
    loading,
    squadFilter,
    setSquadFilter,
    allSquads,
    filteredDashboardData
  } = useDashboardData();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando dados...</div>;
  }

  if (!filteredDashboardData) {
    return <div className="flex items-center justify-center h-screen">Erro ao carregar dados.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader 
        squadFilter={squadFilter} 
        setSquadFilter={setSquadFilter} 
        allSquads={allSquads} 
      />
      
      <DashboardStats dashboardData={filteredDashboardData} />
      
      <DashboardCharts 
        dashboardData={filteredDashboardData} 
        squadFilter={squadFilter} 
      />

      <div className="mb-6">
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;
