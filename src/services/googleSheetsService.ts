
import { Cliente, DashboardData, SquadSummary } from "@/lib/types";

// Google Sheets API
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1Grn9FetjKwuZ4M3TBuNPNbGyBm0TTnrBZDe5YTZfiKU/gviz/tq?tqx=out:json';

export async function fetchGoogleSheetsData(): Promise<Cliente[]> {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const text = await response.text();
    
    // Extract JSON from the response (Google Sheets returns JSONP)
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStartIndex, jsonEndIndex);
    
    const data = JSON.parse(jsonString);
    
    // Parse sheet data to our format
    const headers = data.table.cols.map((col: any) => col.label);
    const rows = data.table.rows;
    
    const clientes: Cliente[] = rows.map((row: any, index: number) => {
      const values = row.c.map((cell: any) => cell ? cell.v : null);
      
      // Map values based on expected column order
      return {
        id: `client-${index}`,
        nome: values[headers.indexOf('Workspace')] || 'Desconhecido',
        squad: values[headers.indexOf('Squad')] || 'Sem Squad',
        gestor: 'Não informado',
        gestorTrafego: 'Não informado',
        status: values[headers.indexOf('Ativa')] === 'S' ? 'Ativo' : 'Inativo',
        momentoAtual: 'Não informado',
        ultimaAtualizacao: new Date(), // Usando data atual como placeholder
        prioridade: 'Média',
        lt: Math.random() * 10, // Valor aleatório para LT
        step: '',
        fee: Math.floor(Math.random() * 10000) + 1000, // Valor aleatório para fee
        investimento: 0,
        margemBruta: '',
        resultado: '',
        entregas: '',
        relacionamento: '',
        problemaFinanceiro: false,
        observacoes: ''
      };
    });
    
    return clientes;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
}

export function processDashboardData(clientes: Cliente[], selectedSquad: string = 'Todos'): DashboardData {
  // Filtra clientes pelo squad selecionado, se for 'Todos' retorna todos
  const filteredClientes = selectedSquad === 'Todos' 
    ? clientes 
    : clientes.filter(cliente => cliente.squad === selectedSquad);
  
  // Calculate total clients
  const totalClientes = filteredClientes.length;
  
  // Calculate total fee (MRR)
  const totalFee = filteredClientes.reduce((sum, cliente) => sum + cliente.fee, 0);
  
  // Calculate ticket médio (média da coluna Fee)
  const ticketMedio = totalClientes > 0 ? totalFee / totalClientes : 0;
  
  // Calculate LT médio (média da coluna LT)
  const ltMedio = totalClientes > 0 
    ? filteredClientes.reduce((sum, cliente) => sum + cliente.lt, 0) / totalClientes 
    : 0;
  
  // Group by squad
  const squads = Array.from(new Set(filteredClientes.map(cliente => cliente.squad)));
  
  // Create squad summaries
  const clientesPorSquad: SquadSummary[] = squads.map(squad => {
    const squadClientes = filteredClientes.filter(cliente => cliente.squad === squad);
    const totalSquadClients = squadClientes.length;
    
    // Calcular status por squad
    const statusCountMap: Record<string, number> = {};
    squadClientes.forEach(client => {
      let statusKey = client.status;
      statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
    });
    
    // Estatísticas específicas por tipo de status
    const clientesAtivos = squadClientes.filter(cliente => 
      cliente.status.toLowerCase() === 'ativo' || 
      cliente.status.includes('🟢') ||
      cliente.status.includes('Safe')
    ).length;
    
    const clientesInativos = squadClientes.filter(cliente => 
      cliente.status.toLowerCase() === 'inativo' || 
      cliente.status.includes('🔴') ||
      cliente.status.includes('Danger')
    ).length;
    
    const clientesEmPausa = squadClientes.filter(cliente => 
      cliente.status.toLowerCase() === 'em pausa' || 
      cliente.status.includes('🟡') ||
      cliente.status.includes('Care')
    ).length;
    
    return {
      nome: squad,
      totalClientes: totalSquadClients,
      clientesPorStatus: statusCountMap,
      clientesAtivos,
      clientesInativos,
      clientesEmPausa,
      feeTotal: squadClientes.reduce((sum, cliente) => sum + cliente.fee, 0),
      ltMedio: squadClientes.length > 0 
        ? squadClientes.reduce((sum, cliente) => sum + cliente.lt, 0) / squadClientes.length 
        : 0
    };
  });
  
  // Cliente por Status - para o gráfico de pizza
  const statusCounts: Record<string, number> = {};
  filteredClientes.forEach(cliente => {
    const status = cliente.status || 'Desconhecido';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const clientesPorStatus = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Find delayed clients
  const clientesComAtraso = filteredClientes.filter(cliente => {
    return cliente.observacoes && (
      cliente.observacoes.includes("ATRASADO") || 
      cliente.observacoes.includes("PERIODO CRITICO")
    );
  });
  
  return {
    totalClientes,
    totalFee,
    ticketMedio,
    ltMedio,
    clientesPorSquad,
    clientesComAtraso,
    clientesPorStatus
  };
}
