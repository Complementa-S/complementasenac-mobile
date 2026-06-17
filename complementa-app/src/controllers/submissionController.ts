import { AppUser } from '../models/User';
import { CreateSubmissionInput } from '../models/Submission';
import { validarHorasAtividade } from '../constants/hoursLimits';
import { createSubmission, listStudentSubmissions } from '../services/firebaseRepository';

export async function submitActivity(user: AppUser | null, input: CreateSubmissionInput) {
  if (!user) throw new Error('Faca login novamente para enviar a submissao.');
  if (!input.file) throw new Error('Selecione um arquivo.');
  if (!input.titulo.trim()) throw new Error('Informe o nome da atividade.');
  if (!Number.isFinite(input.horas) || input.horas <= 0) throw new Error('Informe uma quantidade de horas valida.');
  const validacao = validarHorasAtividade(input.horas);
  if (!validacao.valido) throw new Error(validacao.mensagem);
  return createSubmission(user, { ...input, horas: validacao.horas });
}

export async function getStudentSubmissions(user: AppUser | null) {
  if (!user) return [];
  return listStudentSubmissions(user);
}
