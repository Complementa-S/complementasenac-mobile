export type SubmissionStatus = 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'INDEFERIDO';

export type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

export type Submission = {
  id: string;
  uidAluno: string;
  aluno: string;
  titulo: string;
  categoria: string;
  horasInformadas: number;
  horasAprovadas: number;
  status: SubmissionStatus;
  urlCertificado: string;
  dataEnvio: string;
  justificativaCoordenador: string;
};

export type CreateSubmissionInput = {
  titulo: string;
  categoria: string;
  horas: number;
  file: PickedFile;
};

