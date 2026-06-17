import { Submission, SubmissionStatus } from '../models/Submission';

const statusMap: Record<string, { label: string; tone: 'approved' | 'pending' | 'rejected' }> = {
  APROVADO: { label: 'Aprovado', tone: 'approved' },
  PENDENTE: { label: 'Pendente', tone: 'pending' },
  REPROVADO: { label: 'Indeferida', tone: 'rejected' },
  INDEFERIDO: { label: 'Indeferida', tone: 'rejected' },
};

export function uiStatus(status: SubmissionStatus | string) {
  const key = String(status || 'PENDENTE').toUpperCase();
  return statusMap[key] || statusMap.PENDENTE;
}

export function formatShortDate(value: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10);
  return parsed.toLocaleDateString('pt-BR');
}

export function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function horasPorCategoria(submissions: Submission[], categoria: string) {
  return submissions
    .filter((item) => item.status === 'APROVADO' && item.categoria === categoria)
    .reduce((acc, item) => acc + (item.horasAprovadas || item.horasInformadas || 0), 0);
}
