import { apiRequest } from './api';

export type AlunoResumo = {
  curso: string;
  horasConcluidas: number;
  horasNecessarias: number;
  percentualConcluido: number;
  aprovadas: number;
  pendentes: number;
  indeferidas: number;
  totalAtividades: number;
};

export type AlunoPerfil = {
  uid: string;
  nome: string;
  email: string;
  telefone: string;
  curso: string;
  matricula: string;
  departamento: string;
  ingresso: string;
};

export function fetchResumoAluno(token: string) {
  return apiRequest<AlunoResumo>('/api/aluno/resumo', { token });
}

export function fetchPerfilAluno(token: string) {
  return apiRequest<AlunoPerfil>('/api/aluno/perfil', { token });
}

export function fetchLimitesHoras() {
  return apiRequest<{ maxHorasPorAtividade: number }>('/api/config/limites');
}
