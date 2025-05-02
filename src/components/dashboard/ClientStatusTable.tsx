
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from "@/lib/types";
import { calculateDaysDifference, getStatusColor } from "@/lib/utils";

interface ClientStatusTableProps {
  clients: Cliente[];
}

export default function ClientStatusTable({ clients }: ClientStatusTableProps) {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg">Status dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50">
              <tr>
                <th scope="col" className="px-6 py-3">Nome</th>
                <th scope="col" className="px-6 py-3">Squad</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Última Atualização</th>
                <th scope="col" className="px-6 py-3">Fee</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const daysSinceUpdate = calculateDaysDifference(client.ultimaAtualizacao);
                const isDelayed = daysSinceUpdate > 7;
                
                return (
                  <tr key={client.id} className="border-b border-secondary/30">
                    <td className="px-6 py-4">{client.nome}</td>
                    <td className="px-6 py-4">{client.squad}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`}></span>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {client.ultimaAtualizacao.toLocaleDateString('pt-BR')}
                        {isDelayed && (
                          <span className="alert-badge animate-pulse-gentle">
                            {daysSinceUpdate} dias
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
