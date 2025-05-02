
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
        nome: values[headers.indexOf('Nome do Cliente')] || 'Desconhecido',
        squad: values[headers.indexOf('Squad')] || 'Sem Squad',
        status: values[headers.indexOf('Status')] || 'Desconhecido',
        ultimaAtualizacao: values[headers.indexOf('Última Atualização')] 
          ? new Date(values[headers.indexOf('Última Atualização')]) 
          : new Date(),
        fee: parseFloat(values[headers.indexOf('Fee')]) || 0
      };
    });
    
    return clientes;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
}

export function processDashboardData(clientes: Cliente[]): DashboardData {
  // Calculate total clients
  const totalClientes = clientes.length;
  
  // Calculate total fee
  const totalFee = clientes.reduce((sum, cliente) => sum + cliente.fee, 0);
  
  // Group by squad
  const squads = Array.from(new Set(clientes.map(cliente => cliente.squad)));
  
  // Create squad summaries
  const clientesPorSquad: SquadSummary[] = squads.map(squad => {
    const squadClientes = clientes.filter(cliente => cliente.squad === squad);
    
    return {
      nome: squad,
      totalClientes: squadClientes.length,
      clientesAtivos: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'ativo').length,
      clientesInativos: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'inativo').length,
      clientesEmPausa: squadClientes.filter(cliente => cliente.status.toLowerCase() === 'em pausa').length,
      feeTotal: squadClientes.reduce((sum, cliente) => sum + cliente.fee, 0)
    };
  });
  
  // Find delayed clients
  const clientesComAtraso = clientes.filter(cliente => {
    const today = new Date();
    const lastUpdate = new Date(cliente.ultimaAtualizacao);
    const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 7;
  });
  
  return {
    totalClientes,
    totalFee,
    clientesPorSquad,
    clientesComAtraso
  };
}
