import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  role: 'ALUMNO' | 'MODERADOR' | null;
  setToken: (token: string) => void;
  setTokenTest: (token: string, forcedRole: 'ALUMNO' | 'MODERADOR') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null, role: null,
  setToken: (token) => {
    try {
      const decoded = jwtDecode<{ role: 'ALUMNO' | 'MODERADOR' }>(token);
      set({ token, role: decoded.role });
    } catch { set({ token: null, role: null }); }
  },
  setTokenTest: (token, forcedRole) => set({ token, role: forcedRole }),
  logout: () => set({ token: null, role: null }),
}));