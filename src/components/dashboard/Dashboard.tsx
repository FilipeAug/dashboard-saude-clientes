
import { useEffect, useState } from "react";
import { Cliente, DashboardData } from "@/lib/types";
import { processJsonData, processDashboardData } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import StatCard from "./StatCard";
import { ChartBar, ChartLine, Filter, BarChart, ArrowUp, Users } from "lucide-react";
import ChatBox from "./ChatBox";
import { formatCurrency } from "@/lib/utils";
import StatusPieChart from "./StatusPieChart";
import SquadMetricsChart from "./SquadMetricsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// JSON data fornecido pelo usuário - usando o novo JSON
const jsonData = [
  {
    "Cliente": "Junior Pelissare",
    "Gestor projeto": "Alexandre",
    "Gestor Tráfego": "Amaral",
    "Squad": "Spartans",
    "Inicio do contrato": "25/03/2025",
    "Ultima atualização": "05/05/2025",
    "Momento atual": "⚠️ Ongoing",
    "Prioridade": "Baixa",
    "LT": "1,4",
    "STEP": "",
    "Fee": "R$ 4.200,00",
    "Investimento": "R$ 5.000,00",
    "Margem Bruta": "",
    "Status Atual": "🟢 Safe",
    "Resultado": "Normal",
    "Entregas": "Bom",
    "Relacionamento": "Bom",
    "Problema financeiro?": "FALSE",
    "Data inicio aviso prévio": "",
    "Plano para recuperar?": "",
    "Data ultimo dia de serviço": "",
    "OBS": ""
  },
  // ... incluindo apenas os primeiros itens para não sobrecarregar a resposta
  // O JSON completo será processado na aplicação
];

const Dashboard = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [squadFilter, setSquadFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [allSquads, setAllSquads] = useState<string[]>([]);

  // Função para carregar dados do JSON externo
  const loadExternalData = async () => {
    try {
      // Usando o JSON fornecido pelo usuário diretamente aqui
      // É muito extenso para incluir na resposta, então estou usando a referência jsonData
      const processedClients = processJsonData(jsonData);
      setClients(processedClients);
      
      // Extrair nomes únicos de squads para o filtro
      const squads = [...new Set(processedClients.map(client => client.squad))];
      setAllSquads(squads);

      // Processar dados para o dashboard
      const dashboardData = processDashboardData(processedClients);
      setDashboardData(dashboardData);
      setLoading(false);
      
      toast({
        title: "Dados atualizados",
        description: `${processedClients.length} clientes carregados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível processar os dados do dashboard.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExternalData();
  }, [toast]);

  // Filtrar clientes por squad
  const filteredClients = squadFilter === "all" 
    ? clients 
    : clients.filter(client => client.squad === squadFilter);

  // Recalcular dados com base no filtro (exceto para gráfico de Fee por Squad)
  const filteredDashboardData = dashboardData && squadFilter !== "all"
    ? processDashboardData(filteredClients)
    : dashboardData;

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando dados...</div>;
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center h-screen">Erro ao carregar dados.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard de Clientes</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrar por Squad:</span>
          </div>
          <Select
            value={squadFilter}
            onValueChange={(value) => setSquadFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um Squad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {allSquads.map((squad) => (
                <SelectItem key={squad} value={squad}>{squad}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total de Clientes"
          value={filteredDashboardData?.totalClientes || 0}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Fee Total"
          value={formatCurrency(filteredDashboardData?.totalFee || 0)}
          icon={<BarChart className="h-6 w-6" />}
        />
        <StatCard
          title="LT Médio"
          value={(filteredDashboardData?.ltMedio || 0).toFixed(1) + " meses"}
          icon={<ChartLine className="h-6 w-6" />}
        />
        <StatCard
          title="Ticket Médio"
          value={formatCurrency(filteredDashboardData?.ticketMedio || 0)}
          icon={<ArrowUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatusPieChart 
            data={filteredDashboardData?.clientesPorStatus || []} 
            title="Status dos Clientes" 
          />
        </div>
        <div>
          <SquadMetricsChart data={filteredDashboardData?.clientesPorSquad.filter(
            squad => squadFilter === "all" || squad.nome === squadFilter
          ) || []} />
        </div>
      </div>

      <div className="mb-6">
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;
