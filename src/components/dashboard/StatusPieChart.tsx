
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusPieChartProps {
  data: { name: string; value: number }[];
  title: string;
}

export default function StatusPieChart({ data, title }: StatusPieChartProps) {
  // Definimos cores específicas para cada status
  const getStatusColor = (status: string) => {
    if (status.includes('🟢') || status.includes('Safe')) return '#10b981'; // Verde
    if (status.includes('🟡') || status.includes('Care')) return '#f59e0b'; // Amarelo
    if (status.includes('🔴') || status.includes('Danger')) return '#ef4444'; // Vermelho
    if (status.includes('Aviso Prévio') || status.includes('⏳')) return '#8b5cf6'; // Roxo
    if (status.includes('Onboarding') || status.includes('🛫')) return '#3b82f6'; // Azul
    if (status.includes('Implementação') || status.includes('⚙️')) return '#6366f1'; // Índigo
    if (status.includes('Cancelado') || status.includes('❌')) return '#dc2626'; // Vermelho escuro
    return '#94a3b8'; // Cinza para outros casos
  };

  // Ordenar os dados para que os status mais importantes apareçam primeiro
  const sortedData = [...data].sort((a, b) => {
    // Definindo a ordem prioritária dos status
    const priorityOrder: Record<string, number> = {
      '🟢 Safe': 1,
      '🟡 Care': 2,
      '🔴 Danger': 3,
      '⏳ Aviso Prévio': 4,
      '🛫 Onboarding': 5,
      '⚙️ Implementação': 6,
      'Implantação': 7,
      '❌ Cancelado': 8,
      'Outros': 9
    };
    
    // Pegar a prioridade de cada status, ou usar um valor alto para "outros"
    const priorityA = Object.keys(priorityOrder).find(key => a.name.includes(key)) 
      ? priorityOrder[Object.keys(priorityOrder).find(key => a.name.includes(key)) as string]
      : 99;
    
    const priorityB = Object.keys(priorityOrder).find(key => b.name.includes(key))
      ? priorityOrder[Object.keys(priorityOrder).find(key => b.name.includes(key)) as string]
      : 99;
    
    return priorityA - priorityB;
  });

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient overflow-hidden">
      <CardHeader>
        <CardTitle className="text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} clientes`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
