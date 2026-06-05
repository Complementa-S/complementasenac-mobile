import { AppUser } from '../models/User';
import { CreateSubmissionInput } from '../models/Submission';
import { createSubmission, decideSubmission, listAllSubmissions, listStudentSubmissions } from '../services/firebaseRepository';

export async function submitActivity(user: AppUser | null, input: CreateSubmissionInput) {
  if (!user) throw new Error('Faca login novamente para enviar a submissao.');
  if (!input.file) throw new Error('Selecione um arquivo.');
  if (!input.titulo.trim()) throw new Error('Informe o nome da atividade.');
  if (!Number.isFinite(input.horas) || input.horas <= 0) throw new Error('Informe uma quantidade de horas valida.');
  return createSubmission(user, input);
}

export async function getStudentSubmissions(user: AppUser | null) {
  if (!user) return [];
  return listStudentSubmissions(user);
}

export async function getCoordinatorSubmissionsFor(user: AppUser | null) {
  if (!user) return [];
  return listAllSubmissions(user);
}

export async function approveSubmission(user: AppUser | null, id: string, hours: number) {
  if (!user) throw new Error('Faca login novamente para aprovar.');
  return decideSubmission(user, id, true, '', hours);
}

export async function rejectSubmission(user: AppUser | null, id: string, reason: string) {
  if (!user) throw new Error('Faca login novamente para indeferir.');
  if (!reason.trim()) throw new Error('Informe o motivo do indeferimento.');
  return decideSubmission(user, id, false, reason);
}
