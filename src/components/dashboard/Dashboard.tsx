
import { useEffect, useState } from "react";
import { Cliente, DashboardData } from "@/lib/types";
import { fetchClientesData, processDashboardData } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import StatCard from "./StatCard";
import { ChartBar, ChartLine, Filter, BarChart, ArrowUp, Users } from "lucide-react";
import AlertsList from "./AlertsList";
import ChatBox from "./ChatBox";
import { formatCurrency } from "@/lib/utils";
import ClientStatusTable from "./ClientStatusTable";
import StatusPieChart from "./StatusPieChart";
import SquadMetricsChart from "./SquadMetricsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSquad, setSelectedSquad] = useState<string>("Todos");
  const [squadOptions, setSquadOptions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const clientsData = fetchClientesData();
        setClients(clientsData);
        
        // Extrair opções de squad para o filtro
        const uniqueSquads = Array.from(new Set(clientsData.map(client => client.squad)));
        setSquadOptions(["Todos", ...uniqueSquads]);
        
        const dashboardData = processDashboardData(clientsData, selectedSquad);
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
  }, [toast]);

  useEffect(() => {
    // Atualizar os dados quando o filtro de squad mudar
    if (clients.length > 0) {
      const dashboardData = processDashboardData(clients, selectedSquad);
      setData(dashboardData);
    }
  }, [selectedSquad, clients]);

  const handleSquadChange = (value: string) => {
    setSelectedSquad(value);
  };

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
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedSquad} onValueChange={handleSquadChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Squad" />
            </SelectTrigger>
            <SelectContent>
              {squadOptions.map((squad) => (
                <SelectItem key={squad} value={squad}>
                  {squad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Clientes" 
          value={data.totalClientes} 
          icon={<Users className="h-4 w-4" />} 
        />
        <StatCard 
          title="MRR (Fee Total)" 
          value={formatCurrency(data.totalFee)} 
          icon={<BarChart className="h-4 w-4" />} 
        />
        <StatCard 
          title="Ticket Médio" 
          value={formatCurrency(data.ticketMedio)} 
          icon={<ChartLine className="h-4 w-4" />} 
        />
        <StatCard 
          title="LT Médio" 
          value={data.ltMedio.toFixed(1)} 
          icon={<ArrowUp className="h-4 w-4" />} 
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusPieChart 
          data={data.clientesPorStatus} 
          title="Distribuição de Clientes por Status" 
        />
        <SquadMetricsChart data={data.clientesPorSquad} />
      </div>
      
      {/* Content with Chat Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientStatusTable clients={selectedSquad === 'Todos' ? clients : clients.filter(c => c.squad === selectedSquad)} />
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
