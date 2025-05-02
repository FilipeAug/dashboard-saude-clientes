
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from "@/lib/types";
import { Bell } from "lucide-react";

interface AlertsListProps {
  delayedClients: Cliente[];
}

export default function AlertsList({ delayedClients }: AlertsListProps) {
  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Alertas de Atraso</CardTitle>
        <Bell className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        {delayedClients.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem alertas de atraso no momento.</p>
        ) : (
          <div className="space-y-4">
            {delayedClients.map(client => {
              return (
                <div key={client.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md border border-secondary">
                  <div>
                    <h4 className="font-medium">{client.nome}</h4>
                    <p className="text-sm text-muted-foreground">Squad: {client.squad}</p>
                  </div>
                  <div className="alert-badge animate-pulse-gentle">
                    {client.observacoes}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
