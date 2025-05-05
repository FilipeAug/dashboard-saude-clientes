
import { Cliente, DashboardData, SquadSummary } from "@/lib/types";

// Função para processar os dados do dashboard
export function processDashboardData(clients: Cliente[]): DashboardData {
  // Calcular o total de clientes
  const totalClientes = clients.length;
  
  // Para o gráfico de "Fee por Squad", usamos todos os clientes
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
    
    // Calcular fee total por squad
    const feeTotal = squadClients.reduce((sum, client) => sum + (client.fee || 0), 0);
    
    // Calcular LT médio por squad
    const validLTClients = squadClients.filter(client => client.lt > 0);
    const ltMedio = validLTClients.length > 0 
      ? validLTClients.reduce((sum, client) => sum + client.lt, 0) / validLTClients.length 
      : 0;
    
    // Estatísticas por status para compatibilidade com ClientsBySquadChart
    const clientesAtivos = squadClients.filter(client => 
      client.status.includes('Safe') || 
      client.status.includes('🟢')
    ).length;
    
    const clientesInativos = squadClients.filter(client => 
      client.status.includes('Danger') || 
      client.status.includes('🔴') || 
      client.status.includes('Aviso') || 
      client.status.includes('Cancelado')
    ).length;
    
    const clientesEmPausa = squadClients.filter(client => 
      client.status.includes('Care') || 
      client.status.includes('🟡')
    ).length;
    
    clientesPorSquad.push({
      nome: squad,
      totalClientes: totalSquadClients,
      clientesPorStatus: statusCountMap,
      feeTotal,
      ltMedio,
      clientesAtivos,
      clientesInativos,
      clientesEmPausa
    });
  });
  
  // Calcular fee total de todos os clientes
  const totalFee = clients.reduce((sum, client) => sum + (client.fee || 0), 0);
  
  // Calcular LT médio
  const validLTClients = clients.filter(client => client.lt > 0);
  const ltMedio = validLTClients.length > 0 
    ? validLTClients.reduce((sum, client) => sum + client.lt, 0) / validLTClients.length 
    : 0;
  
  // Calcular ticket médio
  const ticketMedio = clients.length > 0 ? totalFee / clients.length : 0;
  
  // Clientes por status para o gráfico de pizza
  const statusCountMap: Record<string, number> = {};
  clients.forEach(client => {
    let statusKey = client.status;
    if (statusKey.includes('🟢')) statusKey = '🟢 Safe';
    else if (statusKey.includes('🟡')) statusKey = '🟡 Care';
    else if (statusKey.includes('🔴')) statusKey = '🔴 Danger';
    else if (statusKey.includes('Aviso prévio')) statusKey = '⏳ Aviso Prévio';
    else if (client.momentoAtual.includes('🛫')) statusKey = '🛫 Onboarding';
    else if (client.momentoAtual.includes('⚙️')) statusKey = '⚙️ Implementação';
    else if (statusKey === 'Implantação') statusKey = '⚙️ Implementação';
    else statusKey = 'Outros';
    
    statusCountMap[statusKey] = (statusCountMap[statusKey] || 0) + 1;
  });
  
  const clientesPorStatus = Object.entries(statusCountMap).map(([name, value]) => ({ name, value }));
  
  // Clientes com atraso (usando observações como critério)
  const clientesComAtraso = clients.filter(client => {
    return client.observacoes && (
      client.observacoes.includes("ATRASADO") || 
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
export function parseBrazilianCurrency(currencyString: string): number {
  if (!currencyString) return 0;
  return Number(currencyString.replace('R$', '').replace('.', '').replace(',', '.').trim());
}

// Converter data no formato DD/MM/YYYY para objeto Date
export function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return undefined;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Mês em JS começa de 0
  const year = parseInt(parts[2]);
  
  return new Date(year, month, day);
}

// Converter string de número BR para número
export function parseBrazilianNumber(numberString: string): number {
  if (!numberString) return 0;
  return Number(numberString.replace(',', '.').trim());
}

// Função para processar dados CSV
export function processCSVData(csvData: string): Cliente[] {
  // Dividir o CSV em linhas
  const lines = csvData.trim().split('\n');
  
  // Remover aspas e dividir por vírgulas
  const headers = lines[0].split(',').map(header => header.replace(/"/g, ''));
  
  // Processar cada linha (exceto o cabeçalho)
  return lines.slice(1).map((line, index) => {
    // Dividir a linha em campos considerando campos com aspas
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField); // Adiciona o último campo
    
    // Remover aspas extras de cada campo
    const cleanFields = fields.map(field => field.replace(/^"|"$/g, ''));
    
    // Mapear os campos para os índices corretos
    const cliente: Cliente = {
      id: (index + 1).toString(),
      nome: cleanFields[headers.indexOf("Cliente")] || '',
      gestor: cleanFields[headers.indexOf("Gestor projeto")] || '',
      gestorTrafego: cleanFields[headers.indexOf("Gestor Tráfego")] || '',
      squad: cleanFields[headers.indexOf("Squad")] || '',
      inicioContrato: parseDate(cleanFields[headers.indexOf("Inicio do contrato")]),
      ultimaAtualizacao: parseDate(cleanFields[headers.indexOf("Ultima atualização")]),
      momentoAtual: cleanFields[headers.indexOf("Momento atual")] || '',
      prioridade: cleanFields[headers.indexOf("Prioridade")] || '',
      lt: parseBrazilianNumber(cleanFields[headers.indexOf("LT")]),
      step: cleanFields[headers.indexOf("STEP")] || '',
      fee: parseBrazilianCurrency(cleanFields[headers.indexOf("Fee")]),
      investimento: parseBrazilianCurrency(cleanFields[headers.indexOf("Investimento")]),
      margemBruta: cleanFields[headers.indexOf("Margem Bruta")] || '',
      status: cleanFields[headers.indexOf("Status Atual")] || '',
      resultado: cleanFields[headers.indexOf("Resultado")] || '',
      entregas: cleanFields[headers.indexOf("Entregas")] || '',
      relacionamento: cleanFields[headers.indexOf("Relacionamento")] || '',
      problemaFinanceiro: cleanFields[headers.indexOf("Problema financeiro?")] === "TRUE",
      dataInicioAvisoPrevio: parseDate(cleanFields[headers.indexOf("Data inicio aviso prévio")]),
      planoRecuperacao: cleanFields[headers.indexOf("Plano para recuperar?")] || '',
      dataUltimoDiaServico: parseDate(cleanFields[headers.indexOf("Data ultimo dia de serviço")]),
      observacoes: cleanFields[headers.indexOf("OBS")] || ''
    };
    
    return cliente;
  });
}

// Função para processar os dados JSON recebidos em objetos Cliente
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
