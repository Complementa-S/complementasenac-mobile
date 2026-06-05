export type UserRole = 'ALUNO' | 'COORDENADOR' | 'ADMIN';

export type AppUser = {
  uid: string;
  documentId: string;
  email: string;
  nome: string;
  role: UserRole;
  token: string;
  vinculo?: any;
};
