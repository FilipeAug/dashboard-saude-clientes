
import { useEffect, useState } from "react";
import { Cliente, DashboardData } from "@/lib/types";
import { processCSVData, processDashboardData } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import StatCard from "./StatCard";
import { ChartBar, ChartLine, Filter, BarChart, ArrowUp, Users } from "lucide-react";
import ChatBox from "./ChatBox";
import { formatCurrency } from "@/lib/utils";
import StatusPieChart from "./StatusPieChart";
import SquadMetricsChart from "./SquadMetricsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// CSV fornecido pelo usuário
const csvData = `"Cliente","Gestor projeto","Gestor Tráfego","Squad","Inicio do contrato","Ultima atualização","Momento atual","Prioridade","LT","STEP","Fee","Investimento","Margem Bruta","Status Atual","Resultado","Entregas","Relacionamento","Problema financeiro?","Data inicio aviso prévio","Plano para recuperar?","Data ultimo dia de serviço","OBS"
"Junior Pelissare","Alexandre","Amaral","Spartans","25/03/2025","05/05/2025","⚠️ Ongoing","Baixa","1,4","","R$ 4.200,00","R$ 5.000,00","","🟢 Safe","Normal","Bom","Bom","FALSE","","","",""
"Ecoflex","Alexandre","Amaral","Spartans","06/09/2024","05/05/2025","⚠️ Ongoing","Média","8,0","","R$ 3.093,00","R$ 3.000,00","","🟢 Safe","Ruim","Bom","Bom","FALSE","","","",""
"Maahs","Alexandre","Amaral","Spartans","24/03/2025","05/05/2025","⚠️ Ongoing","Baixa","1,4","","R$ 5.000,00","R$ 2.000,00","","🟢 Safe","Normal","Bom","Bom","FALSE","","","",""
"Yeda Supermercados","Alexandre","Eduardo","Spartans","10/03/2025","05/05/2025","⚠️ Ongoing","Média","1,9","","R$ 3.700,00","R$ 3.000,00","","🟢 Safe","Bom","Normal","Normal","FALSE","","","",""
"Dr. Daniel Longhi","Alexandre","Eduardo","Spartans","31/01/2025","05/05/2025","⚠️ Ongoing","Média","3,1","","R$ 5.700,00","R$ 4.000,00","","🔴 Danger","Ruim","Ruim","Normal","FALSE","","","","- PERIODO CRITICO DO CONTRATO"
"La Mobel","Alexandre","Amaral","Spartans","27/08/2024","05/05/2025","⚠️ Ongoing","Baixa","8,4","","R$ 5.297,00","R$ 3.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Flore Extensions","Alexandre","Amaral","Spartans","29/07/2024","05/05/2025","⚠️ Ongoing","Alta","9,3","","R$ 7.000,00","R$ 5.000,00","","🟡 Care","Normal","Normal","Normal","FALSE","","","",""
"Atlântica","Alexandre","Amaral","Spartans","01/08/2024","05/05/2025","⏳ Aviso Prévio","Baixa","9,2","","R$ 4.000,00","R$ 5.000,00","","🔴 Danger","Bom","Normal","Normal","FALSE","","","","INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
"Ni Estofados","Alexandre","Eduardo","Spartans","01/10/2024","05/05/2025","⚠️ Ongoing","Média","7,2","","R$ 4.922,00","R$ 3.000,00","","🟢 Safe","Normal","Bom","Bom","TRUE","","","",""
"Casttini","Alexandre","Amaral","Spartans","24/02/2025","05/05/2025","⚠️ Ongoing","Alta","2,3","","R$ 0,00","R$ 5.000,00","","🟡 Care","Normal","Normal","Ruim","FALSE","","","",""
"Decor Maxi","Alexandre","Eduardo","Spartans","07/04/2025","05/05/2025","⚠️ Ongoing","Média","0,9","","R$ 4.200,00","R$ 4.000,00","","🟢 Safe","Normal","Bom","Bom","FALSE","","","",""
"Ateliê Móveis Kids","Alexandre","Amaral","Spartans","11/04/2025","05/05/2025","⚠️ Ongoing","Alta","0,8","","R$ 4.000,00","R$ 5.000,00","","🟢 Safe","Normal","Normal","Normal","FALSE","","","",""
"Vorlene & Chagas","Alexandre","Amaral","Spartans","12/05/2025","05/05/2025","🛫 Onboarding","Alta","-0,2","","R$ 3.100,00","","","🟢 Safe","Normal","Normal","Normal","FALSE","","","","EM ONBOARDING"
"Ability","Gláucia","Matheus Azael","Templários","20/01/2025","28/04/2025","⏳ Aviso Prévio","","3,5","","R$ 4.000,00","R$ 2.000,00","","Aviso prévio","Ruim","Ruim","Ruim","TRUE","","","","INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
"Hamonir","Gláucia","Matheus Azael","Templários","26/03/2025","28/04/2025","🛫 Onboarding","","1,3","","R$ 3.500,00","R$ 3.000,00","","🟡 Care","Normal","Normal","Bom","FALSE","","","","ONBOARDING ATRASADO"
"Moca Café","Gláucia","Matheus Azael","Templários","17/02/2025","28/04/2025","⏳ Aviso Prévio","","2,6","","R$ 6.400,00","R$ 3.000,00","","Aviso prévio","Normal","Bom","Normal","FALSE","","","","INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
"Móveis Reinheimer","Gláucia","Matheus Azael","Templários","01/10/2024","28/04/2025","⚠️ Ongoing","","7,2","","R$ 3.000,00","R$ 3.000,00","","🟡 Care","Normal","Bom","Normal","FALSE","","","",""
"Pellens","Gláucia","Matheus Azael","Templários","26/02/2024","28/04/2025","❌ Cancelado","","14,5","","R$ 8.000,00","R$ 10.000,00","","Aviso prévio","Normal","Normal","Normal","TRUE","","","",""
"Ortobom - Água Boa","Gláucia","Matheus Azael","Templários","16/01/2025","28/04/2025","⏳ Aviso Prévio","","3,6","","R$ 3.500,00","R$ 2.000,00","","Aviso prévio","Normal","Normal","Normal","FALSE","","","","INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
"Makiê","Gláucia","Matheus Azael","Templários","01/09/2023","28/04/2025","⚠️ Ongoing","","20,4","","R$ 2.900,00","R$ 33.000,00","","🟡 Care","Ruim","Normal","Bom","FALSE","","","",""
"ModelismoBH","Gláucia","Matheus Azael","Templários","04/06/2023","28/04/2025","⚠️ Ongoing","","23,4","","R$ 6.500,00","R$ 30.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Dra Ana Maria","Gláucia","Matheus Azael","Templários","01/04/2025","28/04/2025","🛫 Onboarding","","1,1","","R$ 3.907,00","R$ 3.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","","ONBOARDING ATRASADO"
"TN4-Tech","Gláucia","Matheus Azael","Templários","26/11/2024","28/04/2025","⚠️ Ongoing","","5,3","","R$ 4.900,00","R$ 10.000,00","","🟡 Care","Normal","Bom","Bom","FALSE","","","","- PERIODO CRITICO DO CONTRATO"
"La Vie en Mode","Gláucia","Matheus Azael","Templários","01/03/2025","28/04/2025","⚠️ Ongoing","","2,2","","R$ 5.000,00","R$ 5.000,00","","🟡 Care","Bom","Ruim","Normal","FALSE","","","",""
"Sleep Brand Colchões","Gláucia","Matheus Azael","Templários","01/03/2025","28/04/2025","🛫 Onboarding","Alta","2,2","","R$ 3.000,00","R$ 4.000,00","","🟡 Care","Ruim","Bom","Bom","FALSE","","","","ONBOARDING ATRASADO"
"ChiqueB","Gláucia","Matheus Azael","Templários","08/04/2025","28/04/2025","🛫 Onboarding","","0,9","","R$ 4.500,00","R$ 4.000,00","","🔴 Danger","Ruim","Ruim","Normal","FALSE","","","","ONBOARDING ATRASADO"
"Contorno do Sorriso","Gláucia","Matheus Azael","Templários","10/04/2025","28/04/2025","🛫 Onboarding","","0,8","","R$ 6.601,00","R$ 8.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","","ONBOARDING ATRASADO"
"Beaumont Colchões","Bruno","Amaral","Spartans","26/02/2024","05/05/2025","⏳ Aviso Prévio","Alta","14,5","","R$ 3.814,00","R$ 10.000,00","","🔴 Danger","Bom","Normal","Ruim","FALSE","","","","TRATATIVA DE CANCELAMENTO "
"Dankana","Bruno","Amaral","Spartans","17/10/2024","05/05/2025","⏳ Aviso Prévio","Alta","6,7","","R$ 3.632,00","R$ 6.000,00","","🔴 Danger","Bom","Ruim","Ruim","FALSE","","","","AGUARDANDO RESPOSTA DA PROPOSTA"
"Kubera ","Bruno","Eduardo","Spartans","16/12/2024","05/05/2025","⚠️ Ongoing","Baixa","4,7","","R$ 0,00","R$ 10.000,00","","🟡 Care","Ruim","Ruim","Ruim","FALSE","","","","AGUARDANDO RESPOTA SOBRE O CONTRATO"
"Meicos","Bruno","Amaral","Spartans","31/07/2024","05/05/2025","⚠️ Ongoing","Baixa","9,3","","R$ 2.127,50","R$ 4.000,00","","🟢 Safe","Bom","Normal","Bom","FALSE","","","","LANDING PAGE E SOCIAL MIDIA"
"Harmoniká","Bruno","Eduardo","Spartans","18/07/2024","05/05/2025","⚠️ Ongoing","Baixa","9,7","","R$ 3.000,00","R$ 4.000,00","","🟢 Safe","Normal","Bom","Bom","FALSE","","","","LANDING PAGE E GOOGLE ADS"
"Nikkomag Colchões","Bruno","Eduardo","Spartans","29/08/2024","05/05/2025","⚠️ Ongoing","Baixa","8,3","","R$ 2.500,00","R$ 3.000,00","","🟢 Safe","Normal","Normal","Normal","FALSE","","","","GOOGLE ADS"
"Aloha Outlett","Bruno","Amaral","Spartans","19/03/2025","05/05/2025","⚠️ Ongoing","Alta","1,6","","R$ 3.000,00","R$ 4.000,00","","🟢 Safe","Ruim","Normal","Bom","FALSE","","","","NOVAS ABORDAGEM DE CRIATIVOS "
"Solumade Madeiras","Bruno","Eduardo","Spartans","09/04/2025","05/05/2025","⚙️ Implementação","Alta","0,9","","R$ 3.300,00","R$ 4.000,00","","🟢 Safe","Normal","Normal","Bom","FALSE","","","","LANDING PAGE E AGENTE DE IA"
"Ozimme","Bruno","Amaral","Spartans","31/01/2025","05/05/2025","⚠️ Ongoing","Média","3,1","","R$ 4.200,00","R$ 2.000,00","","🟡 Care","Normal","Normal","Normal","FALSE","","","","ACOMPANHAMENTO COMERCIAL"
"Living Casa","Bruno","Amaral","Spartans","21/04/2025","05/05/2025","⚙️ Implementação","Alta","0,5","","R$ 3.000,00","R$ 1.500,00","","🟡 Care","Normal","Normal","Normal","FALSE","","","","LANDING PAGE E FOCO EM CAPTURAÇÃO DE ARQUITETOS"
"BR Face Estética","Bruno","Eduardo","Spartans","23/04/2025","05/05/2025","🛫 Onboarding","Alta","0,4","","R$ 3.700,00","R$ 3.500,00","","🟢 Safe","Normal","Normal","Bom","FALSE","","","","APRESENTAÇÃO PLANEJAMENTO EXTRATEGICO"
"Pupim Odontologia","Bruno","Eduardo","Spartans","15/11/2022","05/05/2025","⚠️ Ongoing","Alta","30,1","","R$ 3.000,00","R$ 4.500,00","","🟢 Safe","Bom","Bom","Normal","FALSE","","","","CALCULO DE ROI E VENDA DE AGENTE DE IA"
"Oba Colinho","Bruno","Eduardo","Spartans","04/05/2024","05/05/2025","⚠️ Ongoing","Média","12,2","","R$ 0,00","R$ 5.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","","OVERVIEW COM EDUARDO SOBRE"
"Dr. Eduardo Cirilo","Mari","Eduardo","Spartans","17/06/2024","05/05/2025","⚠️ Ongoing","Alta","10,7","","R$ 4.000,00","R$ 3.000,00","","🟡 Care","Normal","Normal","Normal","FALSE","","","",""
"Yourskin Beauty","Bruno","Eduardo","Spartans","25/11/2024","05/05/2025","⚠️ Ongoing","Média","5,4","","R$ 2.000,00","R$ 4.000,00","","🔴 Danger","Ruim","Bom","Bom","FALSE","","","","OVER VIEW COM EDUARDO SOBRE"
"MM Imóveis","Alexandre","Eduardo","Spartans","01/09/2022","05/05/2025","⚠️ Ongoing","Baixa","32,6","","R$ 2.000,00","R$ 2.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Requinte Tintas","Mari","Eduardo","Spartans","04/11/2024","05/05/2025","⚠️ Ongoing","Alta","6,1","","R$ 3.200,00","R$ 1.800,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","","OVER VIEW COM A MARI SOBRE"
"Móveis Toledo","Mari","Amaral","Spartans","19/03/2025","05/05/2025","⚠️ Ongoing","Alta","1,6","","R$ 3.500,00","R$ 3.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Orthodent's","Bruno","Eduardo","Spartans","21/03/2025","05/05/2025","⚙️ Implementação","Média","1,5","","R$ 3.000,00","R$ 4.000,00","","🟢 Safe","Bom","Normal","Bom","FALSE","","","","IMPLEMENTAÇÃO ATRASADA"
"Vidrolin","Calebe","Kelvin","Templários","16/01/2023","05/05/2025","⏳ Aviso Prévio","Alta","28,0","","R$ 3.000,00","R$ 2.000,00","15","🔴 Danger","Bom","Ruim","Ruim","FALSE","","","","INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
"Holz Máquinas","Calebe","Kelvin","Templários","01/04/2023","05/05/2025","⚠️ Ongoing","Alta","25,5","","R$ 3.000,00","R$ 20.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Isopack","Calebe","Kelvin","Templários","07/08/2023","05/05/2025","⚠️ Ongoing","Média","21,2","","R$ 6.500,00","R$ 9.000,00","","🟢 Safe","Bom","Bom","Bom","FALSE","","","",""
"Clinica Awada","Calebe","Kelvin","Templários","17/05/2024","05/05/2025","⚠️ Ongoing","Média","11,8","","R$ 5.042,00","R$ 4.000,00","","🟡 Care","Normal","Ruim","Bom","FALSE","","","",""
"Aguazul Piracicaba","Calebe","Kelvin","Templários","10/06/2024","05/05/2025","⚠️ Ongoing","Baixa","11,0","","R$ 4.000,00","","","🔴 Danger","Ruim","Normal","Normal","TRUE","","","",""
"Leopoldo Embalagens","Calebe","Kelvin","Templários","17/06/2024","05/05/2025","⚠️ Ongoing","Média","10,7","","R$ 4.200,00","R$ 2.500,00","","🟢 Safe","Bom","Normal","Bom","FALSE","","","",""
"Fibras Campo Belo","Calebe","Kelvin","Templários","29/08/2024","05/05/2025","⚠️ Ongoing","Alta","8,3","","R$ 4.000,00","R$ 6.000,00","","🟡 Care","Ruim","Bom","Bom","TRUE","","","",""
"Açaí Central","Calebe","Kelvin","Templários","31/10/2024","05/05/2025","⚠️ Ongoing","Baixa","6,2","","R$ 4.000,00","R$ 2.000,00","","🔴 Danger","Ruim","Bom","Ruim","FALSE","","","",""
"Shilo Pizzaria","Calebe","Kelvin","Templários","31/10/2024","05/05/2025","⚠️ Ongoing","Baixa","6,2","","R$ 3.000,00","R$ 4.000,00","","🟢 Safe","Bom","Bom","Bom","TRUE","","","",""
"Arc Carretas","Calebe","Kelvin","Templários","26/11/2024","05/05/2025","⚠️ Ongoing","Alta","5,3","","R$ 5.000,00","","","🟡 Care","Ruim","Bom","Bom","FALSE","","","","- PERIODO CRITICO DO CONTRATO"
"3CAS","Calebe","Kelvin","Templários","21/11/2024","05/05/2025","⚠️ Ongoing","Alta","5,5","","R$ 4.200,00","","","🔴 Danger","Ruim","Bom","Normal","FALSE","","","","- PERIODO CRITICO DO CONTRATO"
"Esquadria Gaúcha","Calebe","Kelvin","Templários","23/01/2025","05/05/2025","⚠️ Ongoing","Média","3,4","","R$ 3.500,00","","","🟢 Safe","Bom","Bom","Normal","FALSE","","","","- PERIODO CRITICO DO CONTRATO"
"Kadom Uniformes","Calebe","Kelvin","Templários","03/03/2025","05/05/2025","⚠️ Ongoing","Alta","2,1","","R$ 5.679,00","","","🔴 Danger","Ruim","Normal","Normal","FALSE","","","",""
"Laticinios Odilon","Calebe","Kelvin","Templários","24/03/2025","05/05/2025","⚙️ Implementação","Alta","1,4","","R$ 4.500,00","","","Implantação","Normal","Bom","Bom","FALSE","","","","IMPLEMENTAÇÃO ATRASADA"
"Passeios de Trem","Calebe","Kelvin","Templários","31/03/2025","05/05/2025","⚠️ Ongoing","Alta","1,2","","R$ 4.000,00","","","🔴 Danger","Ruim","Normal","Normal","FALSE","","","",""`;

const Dashboard = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [squadFilter, setSquadFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [allSquads, setAllSquads] = useState<string[]>([]);

  // Função para carregar dados do CSV
  const loadCSVData = () => {
    try {
      // Processar os dados do CSV
      const processedClients = processCSVData(csvData);
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
