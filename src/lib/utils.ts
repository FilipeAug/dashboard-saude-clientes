
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateDaysDifference(lastUpdateDate: Date): number {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastUpdateDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDelayed(lastUpdateDate: Date): boolean {
  return calculateDaysDifference(lastUpdateDate) > 7;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'ativo':
      return 'bg-green-500';
    case 'inativo':
      return 'bg-red-500';
    case 'em pausa':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}
