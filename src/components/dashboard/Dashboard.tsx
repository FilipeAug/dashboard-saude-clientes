
import { useEffect, useState } from "react";
import { Cliente, DashboardData } from "@/lib/types";
import { fetchGoogleSheetsData, processDashboardData } from "@/services/googleSheetsService";
import { useToast } from "@/hooks/use-toast";
import StatCard from "./StatCard";
import { ChartBar, ChartLine, Filter, Bell } from "lucide-react";
import ClientsBySquadChart from "./ClientsBySquadChart";
import ClientStatusTable from "./ClientStatusTable";
import AlertsList from "./AlertsList";
import ChatBox from "./ChatBox";
import SquadFeesChart from "./SquadFeesChart";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const clientsData = await fetchGoogleSheetsData();
        setClients(clientsData);
        
        const dashboardData = processDashboardData(clientsData);
        setData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Erro",
          description: "Houve um erro ao carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Set up polling every 5 minutes
    const intervalId = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p>Nenhum dado disponível. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard V4 Company</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium">Filtros</span>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Clientes" 
          value={data.totalClientes} 
          icon={<ChartBar />} 
        />
        <StatCard 
          title="Fee Total" 
          value={data.totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          icon={<ChartLine />} 
        />
        <StatCard 
          title="Média Fee por Cliente" 
          value={(data.totalFee / data.totalClientes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          icon={<ChartBar />} 
        />
        <StatCard 
          title="Alertas de Atraso" 
          value={data.clientesComAtraso.length} 
          description={`${data.clientesComAtraso.length} clientes sem atualização por 7+ dias`} 
          icon={<Bell />}
          className={data.clientesComAtraso.length > 0 ? "border border-primary/30" : ""}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ClientsBySquadChart data={data.clientesPorSquad} />
        <SquadFeesChart data={data.clientesPorSquad} />
      </div>
      
      {/* Content with Chat Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientStatusTable clients={clients} />
          {data.clientesComAtraso.length > 0 && (
            <AlertsList delayedClients={data.clientesComAtraso} />
          )}
        </div>
        <div className="lg:col-span-1">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
