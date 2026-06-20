import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as FileSystem from 'expo-file-system';

import { auth } from './firebase';
import { apiRequest } from './api';
import { AppUser, UserRole } from '../models/User';
import { CreateSubmissionInput, Submission } from '../models/Submission';

type BackendPerfil = {
  uid: string;
  email: string;
  nome: string;
  perfil: 'aluno' | 'coordenador' | 'admin';
};

const text = (value: unknown) => (value == null ? '' : String(value));

const numberValue = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : 0;
};

const normalizeRole = (perfil: string): UserRole => {
  const normalized = text(perfil).trim().toUpperCase();
  if (normalized === 'ALUNO' || normalized === 'COORDENADOR' || normalized === 'ADMIN') return normalized;
  throw new Error('Usuario sem role valida no banco.');
};

const normalizeStatus = (value: unknown): Submission['status'] => {
  const s = text(value).trim().toUpperCase();
  if (s === 'APROVADO')   return 'APROVADO';
  if (s === 'REPROVADO')  return 'REPROVADO';
  if (s === 'INDEFERIDO') return 'INDEFERIDO';
  if (s === 'PENDENTE')   return 'PENDENTE';
  return 'PENDENTE';
};

const submissionFromApi = (data: any, fallbackAluno = 'Aluno'): Submission => ({
  id: text(data.id || data.id_solicitacao),
  uidAluno: text(data.uid_aluno || data.uidAluno),
  aluno: text(data.aluno || fallbackAluno),
  titulo: text(data.titulo || data.titulo_atividade || 'Atividade complementar'),
  categoria: text(data.categoria || data.tipo || 'Extensao'),
  horasInformadas: numberValue(data.horas || data.horas_informadas),
  horasAprovadas: numberValue(data.horasAprovadas || data.horas_aprovadas),
  status: normalizeStatus(data.status),
  urlCertificado: text(data.comprovanteUrl || data.url_certificado),
  dataEnvio: text(data.data || data.data_envio || data.data_evento),
  justificativaCoordenador: text(data.justificativaCoordenador || data.justificativa_coordenador),
});

async function fileToDataUrl(input: CreateSubmissionInput) {
  const base64 = await FileSystem.readAsStringAsync(input.file.uri, {
    encoding: 'base64',
  });
  const mimeType = input.file.mimeType || 'application/octet-stream';
  return `data:${mimeType};base64,${base64}`;
}

export async function loginWithFirebase(email: string, password: string): Promise<AppUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  const token = await credential.user.getIdToken();
  const perfil = await apiRequest<BackendPerfil>('/api/auth/me', { token });
  const role = normalizeRole(perfil.perfil);

  return {
    uid: credential.user.uid,
    documentId: perfil.uid,
    email: text(perfil.email || credential.user.email),
    nome: text(perfil.nome || credential.user.displayName || 'Usuario'),
    role,
    token,
  };
}

export async function logoutFirebase() {
  await signOut(auth);
}

export async function createSubmission(user: AppUser, input: CreateSubmissionInput): Promise<Submission> {
  const comprovanteUrl = await fileToDataUrl(input);
  const created = await apiRequest<any>('/api/aluno/atividades', {
    token: user.token,
    method: 'POST',
    body: {
      titulo: input.titulo.trim(),
      tipo: input.categoria,
      categoria: input.categoria,
      horas: input.horas,
      comprovanteUrl,
    },
  });

  return submissionFromApi(created, user.nome);
}

export async function listStudentSubmissions(user: AppUser): Promise<Submission[]> {
  const items = await apiRequest<any[]>('/api/aluno/atividades', { token: user.token });
  return items.map((item) => submissionFromApi(item, user.nome));
}

export async function listAllSubmissions(user: AppUser): Promise<Submission[]> {
  const items = await apiRequest<any[]>('/api/coordenador/atividades/todas', { token: user.token });
  return items.map((item) => submissionFromApi(item));
}

export async function decideSubmission(user: AppUser, id: string, approved: boolean, reason = '', approvedHours = 0) {
  await apiRequest(`/api/coordenador/atividades/${id}/decisao`, {
    token: user.token,
    method: 'POST',
    body: {
      status: approved ? 'APROVADO' : 'REPROVADO',
      horasAprovadas: approved ? approvedHours : 0,
      justificativa: approved ? '' : reason.trim(),
    },
  });
}