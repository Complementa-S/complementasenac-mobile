/**
 * Limite maximo de horas por atividade.
 * Sincronize com backend/.env -> MAX_HORAS_POR_ATIVIDADE=40
 */
export const MAX_HORAS_POR_ATIVIDADE = 40;

export function validarHorasAtividade(horas: number | string) {
  const horasInt = typeof horas === 'number' ? horas : parseInt(String(horas), 10);
  if (!Number.isFinite(horasInt) || horasInt <= 0) {
    return { valido: false as const, horas: 0, mensagem: 'Informe uma quantidade valida de horas.' };
  }
  if (horasInt > MAX_HORAS_POR_ATIVIDADE) {
    return {
      valido: false as const,
      horas: horasInt,
      mensagem: `O limite maximo e de ${MAX_HORAS_POR_ATIVIDADE}h por atividade.`,
    };
  }
  return { valido: true as const, horas: horasInt, mensagem: '' };
}
