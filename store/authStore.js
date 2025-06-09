import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
  usuario: null,
  token: null,
  loading: true,

  carregarSessao: async () => {
    try {
      const persistir = await AsyncStorage.getItem('persistir');

      if (persistir !== 'true') {
        await AsyncStorage.multiRemove(['usuario', 'token', 'persistir']);
        set({ loading: false });
        return;
      }

      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('usuario');

      if (t && u) {
        set({ token: t, usuario: JSON.parse(u) });
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (usuario, token, manterConectado = true) => {
    set({ usuario, token });

    if (manterConectado) {
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('persistir', 'true');
    } else {
      await AsyncStorage.removeItem('persistir');
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['usuario', 'token', 'persistir']);
    set({ usuario: null, token: null });
  },

  atualizarUsuario: async (novoUsuario) => {
    set({ usuario: novoUsuario });
    await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
  }
}));
