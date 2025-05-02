
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquadSummary } from "@/lib/types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

interface ClientsBySquadChartProps {
  data: SquadSummary[];
}

export default function ClientsBySquadChart({ data }: ClientsBySquadChartProps) {
  const chartData = data.map(squad => ({
    nome: squad.nome,
    total: squad.totalClientes,
    ativos: squad.clientesAtivos,
    inativos: squad.clientesInativos,
    emPausa: squad.clientesEmPausa,
  }));

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Clientes por Squad</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
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
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8884d8" 
                strokeWidth={2}
                activeDot={{ r: 8, className: "chart-dot" }}
                dot={{ r: 4, className: "chart-dot" }}
              />
              <Line 
                type="monotone" 
                dataKey="ativos" 
                stroke="#4ade80" 
                strokeWidth={2}
                activeDot={{ r: 8, className: "chart-dot" }}
                dot={{ r: 4, className: "chart-dot" }}
              />
              <Line 
                type="monotone" 
                dataKey="inativos" 
                stroke="#ef4444" 
                strokeWidth={2}
                activeDot={{ r: 8, className: "chart-dot" }}
                dot={{ r: 4, className: "chart-dot" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
