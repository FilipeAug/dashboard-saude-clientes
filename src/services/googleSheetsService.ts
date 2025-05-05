
import { Cliente, DashboardData, SquadSummary } from "@/lib/types";
import { parseBrazilianCurrency, parseBrazilianNumber, parseDate } from "@/services/dataService";

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
        nome: values[headers.indexOf('Cliente')] || 'Desconhecido',
        squad: values[headers.indexOf('Squad')] || 'Sem Squad',
        gestor: values[headers.indexOf('Gestor projeto')] || 'Não informado',
        gestorTrafego: values[headers.indexOf('Gestor Tráfego')] || 'Não informado',
        status: values[headers.indexOf('Status Atual')] || 'Não informado',
        momentoAtual: values[headers.indexOf('Momento atual')] || 'Não informado',
        ultimaAtualizacao: parseDate(values[headers.indexOf('Ultima atualização')]) || new Date(), 
        prioridade: values[headers.indexOf('Prioridade')] || 'Média',
        lt: parseBrazilianNumber(values[headers.indexOf('LT')]) || 0,
        step: values[headers.indexOf('STEP')] || '',
        fee: parseBrazilianCurrency(values[headers.indexOf('Fee')]) || 0,
        investimento: parseBrazilianCurrency(values[headers.indexOf('Investimento')]) || 0,
        margemBruta: values[headers.indexOf('Margem Bruta')] || '',
        inicioContrato: parseDate(values[headers.indexOf('Inicio do contrato')]),
        resultado: values[headers.indexOf('Resultado')] || '',
        entregas: values[headers.indexOf('Entregas')] || '',
        relacionamento: values[headers.indexOf('Relacionamento')] || '',
        problemaFinanceiro: values[headers.indexOf('Problema financeiro?')] === 'TRUE',
        dataInicioAvisoPrevio: parseDate(values[headers.indexOf('Data inicio aviso prévio')]),
        planoRecuperacao: values[headers.indexOf('Plano para recuperar?')] || '',
        dataUltimoDiaServico: parseDate(values[headers.indexOf('Data ultimo dia de serviço')]),
        observacoes: values[headers.indexOf('OBS')] || ''
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
  const validLTClients = filteredClientes.filter(cliente => cliente.lt > 0);
  const ltMedio = validLTClients.length > 0 
    ? validLTClients.reduce((sum, cliente) => sum + cliente.lt, 0) / validLTClients.length 
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
  const statusCountMap: Record<string, number> = {};
  filteredClientes.forEach(cliente => {
    let statusKey = cliente.status || 'Desconhecido';
    
    if (statusKey.includes('🟢')) statusKey = '🟢 Safe';
    else if (statusKey.includes('🟡')) statusKey = '🟡 Care';
    else if (statusKey.includes('🔴')) statusKey = '🔴 Danger';
    else if (statusKey.includes('Aviso prévio')) statusKey = '⏳ Aviso Prévio';
    else if (statusKey === 'Implantação') statusKey = '⚙️ Implementação';
    else if (cliente.momentoAtual.includes('🛫')) statusKey = '🛫 Onboarding';
    else if (cliente.momentoAtual.includes('⚙️')) statusKey = '⚙️ Implementação';
    
    statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
  });
  
  const clientesPorStatus = Object.entries(statusCountMap).map(([name, value]) => ({
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
