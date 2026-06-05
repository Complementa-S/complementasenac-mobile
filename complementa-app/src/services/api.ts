const API_BASE = (
  (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_BASE || 'http://localhost:8080'
).replace(/\/+$/, '');

export function apiUrl(path: string) {
  return `${API_BASE}/${String(path).replace(/^\/+/, '')}`;
}

export async function apiRequest<T>(path: string, options: { token?: string; method?: string; body?: any } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw new Error(`Nao foi possivel conectar ao backend em ${API_BASE}. Verifique a API ou EXPO_PUBLIC_API_BASE.`);
  }

  if (!response.ok) {
    let message = 'Erro na requisicao.';
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      // Mantem a mensagem padrao.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export { API_BASE };

