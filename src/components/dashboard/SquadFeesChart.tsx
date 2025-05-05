
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquadSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface SquadFeesChartProps {
  data: SquadSummary[];
}

export default function SquadFeesChart({ data }: SquadFeesChartProps) {
  const chartData = data.map(squad => ({
    nome: squad.nome,
    fee: squad.feeTotal,
  }));

  // Definindo cores para cada equipe no gráfico
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6'];

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Fee por Squad</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">*Não é afetado pelo filtro de squad</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="nome" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$${value/1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Fee"]}
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="fee" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
