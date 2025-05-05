
export interface Cliente {
  id?: string;
  nome: string;
  gestor: string;
  gestorTrafego: string;
  squad: string;
  inicioContrato?: Date;
  ultimaAtualizacao?: Date;
  momentoAtual: string;
  prioridade?: string;
  lt: number;
  step?: string;
  fee: number;
  investimento?: number;
  margemBruta?: string;
  status: string;
  resultado?: string;
  entregas?: string;
  relacionamento?: string;
  problemaFinanceiro: boolean;
  dataInicioAvisoPrevio?: Date;
  planoRecuperacao?: string;
  dataUltimoDiaServico?: Date;
  observacoes?: string;
}

export interface SquadSummary {
  nome: string;
  totalClientes: number;
  clientesPorStatus: { [key: string]: number };
  feeTotal: number;
  ltMedio: number;
  // Adicionando propriedades para compatibilidade com ClientsBySquadChart
  clientesAtivos?: number;
  clientesInativos?: number;
  clientesEmPausa?: number;
}

export interface DashboardData {
  totalClientes: number;
  totalFee: number;
  ltMedio: number;
  ticketMedio: number;
  clientesPorSquad: SquadSummary[];
  clientesComAtraso: Cliente[];
  clientesPorStatus: { name: string; value: number }[];
}

export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
}
