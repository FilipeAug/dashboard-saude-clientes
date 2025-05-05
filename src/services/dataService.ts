
import { Cliente, DashboardData, SquadSummary } from "@/lib/types";

// Função para processar os dados do dashboard
export function processDashboardData(clients: Cliente[], squadFilter: string = "Todos"): DashboardData {
  // Calcular o total de clientes (o filtro NÃO afeta o gráfico de "Fee por Squad")
  const totalClientes = squadFilter === "Todos" 
    ? clients.length 
    : clients.filter(client => client.squad === squadFilter).length;
  
  // Para o gráfico de "Fee por Squad", usamos SEMPRE todos os clientes (não filtrados)
  const allSquads = [...new Set(clients.map(client => client.squad))];
  const clientesPorSquad: SquadSummary[] = [];
  
  allSquads.forEach(squad => {
    const squadClients = clients.filter(client => client.squad === squad);
    const totalSquadClients = squadClients.length;
    
    // Calcular status por squad
    const statusCountMap: Record<string, number> = {};
    squadClients.forEach(client => {
      let statusKey = client.status;
      statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
    });
    
    // Calcular fee total por squad (sempre usa todos os clientes do squad)
    const feeTotal = squadClients.reduce((sum, client) => sum + (client.fee || 0), 0);
    
    // Calcular LT médio por squad
    const validLTClients = squadClients.filter(client => client.lt > 0);
    const ltMedio = validLTClients.length > 0 
      ? validLTClients.reduce((sum, client) => sum + client.lt, 0) / validLTClients.length 
      : 0;
    
    clientesPorSquad.push({
      nome: squad,
      totalClientes: totalSquadClients,
      clientesPorStatus: statusCountMap,
      feeTotal,
      ltMedio
    });
  });
  
  // Filtrar clientes para métricas gerais (exceto para o gráfico de Fee por Squad)
  const filteredClients = squadFilter === "Todos" 
    ? clients 
    : clients.filter(client => client.squad === squadFilter);
  
  // Calcular fee total dos clientes filtrados
  const totalFee = filteredClients.reduce((sum, client) => sum + (client.fee || 0), 0);
  
  // Calcular LT médio
  const validLTClients = filteredClients.filter(client => client.lt > 0);
  const ltMedio = validLTClients.length > 0 
    ? validLTClients.reduce((sum, client) => sum + client.lt, 0) / validLTClients.length 
    : 0;
  
  // Calcular ticket médio
  const ticketMedio = filteredClients.length > 0 ? totalFee / filteredClients.length : 0;
  
  // Clientes por status
  const statusCountMap: Record<string, number> = {};
  filteredClients.forEach(client => {
    let statusKey = client.status;
    if (statusKey.includes('🟢')) statusKey = '🟢 Safe';
    else if (statusKey.includes('🟡')) statusKey = '🟡 Care';
    else if (statusKey.includes('🔴')) statusKey = '🔴 Danger';
    else if (statusKey.includes('Aviso')) statusKey = '⏳ Aviso Prévio';
    else if (client.momentoAtual.includes('🛫')) statusKey = '🛫 Onboarding';
    else if (client.momentoAtual.includes('⚙️')) statusKey = '⚙️ Implementação';
    else statusKey = 'Outros';
    
    statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
  });
  
  const clientesPorStatus = Object.entries(statusCountMap).map(([name, value]) => ({ name, value }));
  
  // Clientes com atraso (usando observações como critério)
  const clientesComAtraso = filteredClients.filter(client => {
    return client.observacoes && (
      client.observacoes.includes("ONBOARDING ATRASADO") || 
      client.observacoes.includes("IMPLEMENTAÇÃO ATRASADA") ||
      client.observacoes.includes("PERIODO CRITICO")
    );
  });
  
  return {
    totalClientes,
    totalFee,
    ltMedio,
    ticketMedio,
    clientesPorSquad,
    clientesComAtraso,
    clientesPorStatus
  };
}

// Converter string de moeda BR para número
function parseBrazilianCurrency(currencyString: string): number {
  if (!currencyString) return 0;
  return Number(currencyString.replace('R$', '').replace('.', '').replace(',', '.').trim());
}

// Converter data no formato DD/MM/YYYY para objeto Date
function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return undefined;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Mês em JS começa de 0
  const year = parseInt(parts[2]);
  
  return new Date(year, month, day);
}

// Converter string de número BR para número
function parseBrazilianNumber(numberString: string): number {
  if (!numberString) return 0;
  return Number(numberString.replace(',', '.').trim());
}

// Função para converter os dados JSON recebidos em objetos Cliente
export function processJsonData(jsonData: any[]): Cliente[] {
  return jsonData.map((item, index) => {
    return {
      id: (index + 1).toString(),
      nome: item.Cliente,
      gestor: item["Gestor projeto"],
      gestorTrafego: item["Gestor Tráfego"],
      squad: item.Squad,
      inicioContrato: parseDate(item["Inicio do contrato"]),
      ultimaAtualizacao: parseDate(item["Ultima atualização"]),
      momentoAtual: item["Momento atual"] || "",
      prioridade: item.Prioridade,
      lt: parseBrazilianNumber(item.LT),
      step: item.STEP,
      fee: parseBrazilianCurrency(item.Fee),
      investimento: parseBrazilianCurrency(item.Investimento),
      margemBruta: item["Margem Bruta"],
      status: item["Status Atual"],
      resultado: item.Resultado,
      entregas: item.Entregas,
      relacionamento: item.Relacionamento,
      problemaFinanceiro: item["Problema financeiro?"] === "TRUE",
      dataInicioAvisoPrevio: parseDate(item["Data inicio aviso prévio"]),
      planoRecuperacao: item["Plano para recuperar?"],
      dataUltimoDiaServico: parseDate(item["Data ultimo dia de serviço"]),
      observacoes: item.OBS
    };
  });
}

// Dados estáticos dos clientes (movidos para outra função para organização)
const clientesJsonData = [
  // Removendo o conteúdo pré-definido já que usaremos o processJsonData
];

// Função para buscar os dados dos clientes
export function fetchClientesData(): Cliente[] {
  // Usando os dados estáticos
  return [];
}
