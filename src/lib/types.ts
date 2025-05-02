
export interface Cliente {
  id: string;
  nome: string;
  squad: string;
  status: string;
  ultimaAtualizacao: Date;
  fee: number;
  lt: number; // Adicionado o campo LT
}

export interface SquadSummary {
  nome: string;
  totalClientes: number;
  clientesAtivos: number;
  clientesInativos: number;
  clientesEmPausa: number;
  feeTotal: number;
  ltMedio: number; // Adicionado o campo LT médio
}

export interface DashboardData {
  totalClientes: number;
  totalFee: number;
  ltMedio: number; // Adicionado o campo LT médio
  ticketMedio: number; // Adicionado o ticket médio
  clientesPorSquad: SquadSummary[];
  clientesComAtraso: Cliente[];
  clientesPorStatus: { name: string; value: number }[]; // Adicionado distribuição por status
}

export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
}
