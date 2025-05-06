
import { useState, useEffect } from "react";
import { Cliente, DashboardData } from "@/lib/types";
import { processCSVData, processDashboardData } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

// CSV data moved to a separate constant file
import { dashboardCSVData } from "@/data/dashboardData";

export const useDashboardData = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [squadFilter, setSquadFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [allSquads, setAllSquads] = useState<string[]>([]);

  // Function to load CSV data
  const loadCSVData = () => {
    try {
      // Process the data from the CSV
      const processedClients = processCSVData(dashboardCSVData);
      setClients(processedClients);
      
      // Extract unique squad names for the filter
      const squads = [...new Set(processedClients.map(client => client.squad))];
      setAllSquads(squads);

      // Process data for the dashboard
      const dashboardData = processDashboardData(processedClients);
      setDashboardData(dashboardData);
      setLoading(false);
      
      toast({
        title: "Dados atualizados",
        description: `${processedClients.length} clientes carregados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao processar dados CSV:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível processar os dados do dashboard.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, [toast]);

  // Filter clients by squad
  const filteredClients = squadFilter === "all" 
    ? clients 
    : clients.filter(client => client.squad === squadFilter);

  // Recalculate data based on filter
  const filteredDashboardData = dashboardData && squadFilter !== "all"
    ? processDashboardData(filteredClients)
    : dashboardData;

  return {
    loading,
    squadFilter,
    setSquadFilter,
    allSquads,
    filteredDashboardData,
    clients,
    filteredClients
  };
};
