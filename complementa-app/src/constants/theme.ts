/** Paleta alinhada ao PWA (Login.css / site Complementa+) */
export const theme = {
  colors: {
    background: '#f7f4ef',
    primary: '#3d7cff',
    primaryDark: '#2458c6',
    text: '#14325c',
    textMuted: 'rgba(20, 50, 92, 0.68)',
    card: '#FFFFFF',
    border: 'rgba(61, 124, 255, 0.15)',
    headerGradient: '#2458c6',
    accentSoft: '#EFF6FF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    pillPending: '#FEF9C3',
    pillApproved: '#D1FAE5',
    pillRejected: '#FEE2E2',
  },
  radius: {
    card: 16,
    button: 12,
    header: 30,
  },
};

export const categoryColors: Record<string, string> = {
  Ensino: '#3d7cff',
  Extensao: '#10B981',
  Extensão: '#10B981',
  Pesquisa: '#F59E0B',
};

export const categoryIcons: Record<string, string> = {
  Ensino: 'school-outline',
  Extensao: 'people-outline',
  Extensão: 'people-outline',
  Pesquisa: 'briefcase-outline',
};
