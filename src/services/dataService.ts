
import { Cliente, DashboardData } from "@/lib/types";

// Dados estáticos fornecidos pelo usuário
const clientesData: Cliente[] = [
  {
    id: "1",
    nome: "Junior Pelissare",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2025-03-25"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Média",
    lt: 1.3,
    fee: 4200,
    status: "🟢 Safe",
    resultado: "Normal",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  {
    id: "2",
    nome: "Ecoflex",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-09-06"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Baixa",
    lt: 7.9,
    fee: 3093,
    status: "🟢 Safe",
    resultado: "Normal",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  {
    id: "3",
    nome: "Maahs",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2025-03-24"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Baixa",
    lt: 1.3,
    fee: 5000,
    status: "🟢 Safe",
    resultado: "Normal",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  {
    id: "4",
    nome: "Yeda Supermercados",
    gestor: "Alexandre",
    gestorTrafego: "Eduardo",
    squad: "Spartans",
    inicioContrato: new Date("2025-03-10"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Alta",
    lt: 1.8,
    fee: 3700,
    status: "🟡 Care",
    resultado: "Bom",
    entregas: "Normal",
    relacionamento: "Normal",
    problemaFinanceiro: false
  },
  {
    id: "5",
    nome: "Dr, Daniel Longhi",
    gestor: "Alexandre",
    gestorTrafego: "Eduardo",
    squad: "Spartans",
    inicioContrato: new Date("2025-01-31"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Baixa",
    lt: 3.0,
    fee: 5700,
    status: "🔴 Danger",
    resultado: "Ruim",
    entregas: "Normal",
    relacionamento: "Normal",
    problemaFinanceiro: false,
    observacoes: "- PERIODO CRITICO DO CONTRATO"
  },
  {
    id: "6",
    nome: "La Mobel",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-08-27"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Baixa",
    lt: 8.3,
    fee: 5297,
    status: "🟢 Safe",
    resultado: "Bom",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  {
    id: "7",
    nome: "Flore Extensions",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-07-29"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Alta",
    lt: 9.2,
    fee: 7000,
    status: "🟡 Care",
    resultado: "Normal",
    entregas: "Normal",
    relacionamento: "Normal",
    problemaFinanceiro: false
  },
  {
    id: "8",
    nome: "Atlântica",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-08-01"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⏳ Aviso Prévio",
    prioridade: "Baixa",
    lt: 9.1,
    fee: 4000,
    status: "Aviso prévio",
    resultado: "Bom",
    entregas: "Normal",
    relacionamento: "Normal",
    problemaFinanceiro: false,
    observacoes: "INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
  },
  {
    id: "9",
    nome: "Montelise",
    gestor: "Alexandre",
    gestorTrafego: "Eduardo",
    squad: "Spartans",
    inicioContrato: new Date("2024-10-01"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Média",
    lt: 7.1,
    fee: 4922,
    status: "🟢 Safe",
    resultado: "Normal",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: true
  },
  {
    id: "10",
    nome: "Casttini",
    gestor: "Alexandre",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2025-02-24"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⚠️ Ongoing",
    prioridade: "Baixa",
    lt: 2.2,
    fee: 0,
    status: "🔴 Danger",
    resultado: "Ruim",
    entregas: "Normal",
    relacionamento: "Ruim",
    problemaFinanceiro: false
  },
  // Templários Squad
  {
    id: "15",
    nome: "Ability",
    gestor: "Gláucia",
    gestorTrafego: "Matheus Azael",
    squad: "Templários",
    inicioContrato: new Date("2025-01-20"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⏳ Aviso Prévio",
    lt: 3.4,
    fee: 4000,
    investimento: 2000,
    status: "Aviso prévio",
    resultado: "Ruim",
    entregas: "Ruim",
    relacionamento: "Ruim",
    problemaFinanceiro: true,
    observacoes: "INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
  },
  {
    id: "16",
    nome: "Hamonir",
    gestor: "Gláucia",
    gestorTrafego: "Matheus Azael",
    squad: "Templários",
    inicioContrato: new Date("2025-03-26"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "🛫 Onboarding",
    lt: 1.2,
    fee: 3500,
    investimento: 3000,
    status: "🟡 Care",
    resultado: "Normal",
    entregas: "Normal",
    relacionamento: "Bom",
    problemaFinanceiro: false,
    observacoes: "ONBOARDING ATRASADO"
  },
  {
    id: "17",
    nome: "Moca Café",
    gestor: "Gláucia",
    gestorTrafego: "Matheus Azael",
    squad: "Templários",
    inicioContrato: new Date("2025-02-17"),
    ultimaAtualizacao: new Date("2025-04-28"),
    momentoAtual: "⏳ Aviso Prévio",
    lt: 2.5,
    fee: 6400,
    investimento: 3000,
    status: "Aviso prévio",
    resultado: "Normal",
    entregas: "Bom",
    relacionamento: "Normal",
    problemaFinanceiro: false,
    observacoes: "INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
  },
  // Calebe's squad
  {
    id: "45",
    nome: "Vidrolin",
    gestor: "Calebe",
    gestorTrafego: "Kelvin",
    squad: "Templários",
    inicioContrato: new Date("2023-01-16"),
    ultimaAtualizacao: new Date("2025-04-22"),
    momentoAtual: "⚠️ Ongoing",
    lt: 27.9,
    fee: 3000,
    status: "🔴 Danger",
    resultado: "Bom",
    entregas: "Ruim",
    relacionamento: "Ruim",
    problemaFinanceiro: false
  },
  {
    id: "46",
    nome: "Holz Máquinas",
    gestor: "Calebe",
    gestorTrafego: "Kelvin",
    squad: "Templários",
    inicioContrato: new Date("2023-04-01"),
    ultimaAtualizacao: new Date("2025-04-22"),
    momentoAtual: "⚠️ Ongoing",
    lt: 25.4,
    fee: 3000,
    status: "🟢 Safe",
    resultado: "Bom",
    entregas: "Ruim",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  // Bruno's squad
  {
    id: "30",
    nome: "Beaumont Colchões",
    gestor: "Bruno",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-02-26"),
    momentoAtual: "⚠️ Ongoing",
    lt: 14.4,
    fee: 3814,
    status: "🟢 Safe",
    resultado: "Bom",
    entregas: "Bom",
    relacionamento: "Bom",
    problemaFinanceiro: false
  },
  {
    id: "31",
    nome: "Dankana",
    gestor: "Bruno",
    gestorTrafego: "Amaral",
    squad: "Spartans",
    inicioContrato: new Date("2024-10-17"),
    momentoAtual: "⏳ Aviso Prévio",
    lt: 6.6,
    fee: 3632,
    status: "Aviso prévio",
    resultado: "Bom",
    entregas: "Ruim",
    relacionamento: "Ruim",
    problemaFinanceiro: false,
    observacoes: "INFOS DE AVISO PRÉVIO NÃO PREENCHIDAS"
  }
];

// Função para processar os dados do dashboard
export function processDashboardData(clients: Cliente[], squadFilter: string = "Todos"): DashboardData {
  // Filtrar clientes se necessário
  const filteredClients = squadFilter === "Todos" 
    ? clients 
    : clients.filter(client => client.squad === squadFilter);
  
  // Calcular o total de clientes
  const totalClientes = filteredClients.length;
  
  // Calcular fee total
  const totalFee = filteredClients.reduce((sum, client) => sum + client.fee, 0);
  
  // Calcular LT médio
  const validLTClients = filteredClients.filter(client => client.lt > 0);
  const ltMedio = validLTClients.length > 0 
    ? validLTClients.reduce((sum, client) => sum + client.lt, 0) / validLTClients.length 
    : 0;
  
  // Calcular ticket médio
  const ticketMedio = totalClientes > 0 ? totalFee / totalClientes : 0;
  
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
    
    statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
  });
  
  const clientesPorStatus = Object.entries(statusCountMap).map(([name, value]) => ({ name, value }));
  
  // Processar dados por squad
  const squadsMap: Record<string, SquadSummary> = {};
  
  filteredClients.forEach(client => {
    const squad = client.squad;
    
    if (!squadsMap[squad]) {
      squadsMap[squad] = {
        nome: squad,
        totalClientes: 0,
        clientesPorStatus: {},
        feeTotal: 0,
        ltMedio: 0
      };
    }
    
    squadsMap[squad].totalClientes += 1;
    
    let statusKey = client.status;
    if (statusKey.includes('🟢')) statusKey = '🟢 Safe';
    else if (statusKey.includes('🟡')) statusKey = '🟡 Care';
    else if (statusKey.includes('🔴')) statusKey = '🔴 Danger';
    else if (statusKey.includes('Aviso')) statusKey = '⏳ Aviso Prévio';
    else if (client.momentoAtual.includes('🛫')) statusKey = '🛫 Onboarding';
    else if (client.momentoAtual.includes('⚙️')) statusKey = '⚙️ Implementação';
    
    squadsMap[squad].clientesPorStatus[statusKey] = 
      (squadsMap[squad].clientesPorStatus[statusKey] || 0) + 1;
    squadsMap[squad].feeTotal += client.fee;
  });
  
  // Calcular LT médio por squad
  Object.keys(squadsMap).forEach(squad => {
    const squadClients = filteredClients.filter(client => client.squad === squad && client.lt > 0);
    squadsMap[squad].ltMedio = squadClients.length > 0
      ? squadClients.reduce((sum, client) => sum + client.lt, 0) / squadClients.length
      : 0;
  });
  
  const clientesPorSquad = Object.values(squadsMap);
  
  // Clientes com atraso (usando momento atual como critério)
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

// Função para buscar os dados dos clientes
export function fetchClientesData(): Cliente[] {
  return clientesData;
}
