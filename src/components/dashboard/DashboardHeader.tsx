
import React from "react";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  squadFilter: string;
  setSquadFilter: (value: string) => void;
  allSquads: string[];
}

const DashboardHeader = ({ squadFilter, setSquadFilter, allSquads }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard de Clientes</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filtrar por Squad:</span>
        </div>
        <Select
          value={squadFilter}
          onValueChange={(value) => setSquadFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione um Squad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {allSquads.map((squad) => (
              <SelectItem key={squad} value={squad}>{squad}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;
