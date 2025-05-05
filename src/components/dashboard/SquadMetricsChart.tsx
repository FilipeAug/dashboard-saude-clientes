
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquadSummary } from "@/lib/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface SquadMetricsChartProps {
  data: SquadSummary[];
}

// Cores para os diferentes squads
const COLORS = [
  '#8884d8', // Roxo
  '#83a6ed', // Azul claro
  '#8dd1e1', // Ciano
  '#82ca9d', // Verde
  '#a4de6c', // Verde lima
  '#d0ed57', // Amarelo verde
  '#ffc658'  // Laranja
];

export default function SquadMetricsChart({ data }: SquadMetricsChartProps) {
  const [metricType, setMetricType] = useState<'fee' | 'lt' | 'ticket'>('fee');

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas por Squad</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  const formatMetricName = (metric: string): string => {
    switch(metric) {
      case 'fee': return 'Fee por Squad';
      case 'lt': return 'LT Médio por Squad';
      case 'ticket': return 'Ticket Médio por Squad';
      default: return 'Métricas por Squad';
    }
  };

  // Preparando os dados baseado na métrica selecionada
  const chartData = data.map(squad => ({
    name: squad.nome,
    value: metricType === 'fee' 
      ? squad.feeTotal 
      : metricType === 'lt' 
        ? squad.ltMedio 
        : squad.totalClientes > 0 
          ? squad.feeTotal / squad.totalClientes 
          : 0
  }));

  // Ordenar squads por valor (do maior para o menor)
  const sortedChartData = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <Card className="card-gradient overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md">{formatMetricName(metricType)}</CardTitle>
        <Select
          value={metricType}
          onValueChange={(value) => setMetricType(value as 'fee' | 'lt' | 'ticket')}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Selecionar métrica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fee">Fee Total</SelectItem>
            <SelectItem value="lt">LT Médio</SelectItem>
            <SelectItem value="ticket">Ticket Médio</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${
                    metricType === 'fee' || metricType === 'ticket'
                      ? formatCurrency(sortedChartData.find(item => item.name === name)?.value || 0)
                      : (sortedChartData.find(item => item.name === name)?.value || 0).toFixed(1)
                  }`
                }
              >
                {sortedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  metricType === 'fee' || metricType === 'ticket'
                    ? formatCurrency(Number(value))
                    : `${Number(value).toFixed(1)}`,
                  metricType === 'fee' ? 'Fee Total' : 
                  metricType === 'lt' ? 'LT Médio' : 'Ticket Médio'
                ]} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
