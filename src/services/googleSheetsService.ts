
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
        status: values[headers.indexOf('Ativa')] === 'S' ? 'Ativo' : 'Inativo',
        ultimaAtualizacao: new Date(), // Usando data atual como placeholder
        fee: Math.floor(Math.random() * 10000) + 1000, // Valor aleatório para fee
        lt: Math.random() * 10 // Valor aleatório para LT
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
    const squadLtTotal = squadClientes.reduce((sum, cliente) => sum + cliente.lt, 0);
    
    return {
      nome: squad,
      totalClientes: squadClientes.length,
      clientesAtivos: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'ativo').length,
      clientesInativos: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'inativo').length,
      clientesEmPausa: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'em pausa').length,
      feeTotal: squadClientes.reduce((sum, cliente) => sum + cliente.fee, 0),
      ltMedio: squadClientes.length > 0 ? squadLtTotal / squadClientes.length : 0
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
    const today = new Date();
    const lastUpdate = new Date(cliente.ultimaAtualizacao);
    const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 7;
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
