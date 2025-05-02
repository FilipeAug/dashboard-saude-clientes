
export interface Cliente {
  id: string;
  nome: string;
  squad: string;
  status: string;
  ultimaAtualizacao: Date;
  fee: number;
}

export interface SquadSummary {
  nome: string;
  totalClientes: number;
  clientesAtivos: number;
  clientesInativos: number;
  clientesEmPausa: number;
  feeTotal: number;
}

export interface DashboardData {
  totalClientes: number;
  totalFee: number;
  clientesPorSquad: SquadSummary[];
  clientesComAtraso: Cliente[];
}

export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
}
