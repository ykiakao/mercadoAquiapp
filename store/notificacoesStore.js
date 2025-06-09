import { create } from 'zustand';

export const useNotificacoesStore = create(set => ({
  notificacoes: [],
  adicionar: (titulo, mensagem) =>
    set(state => ({
      notificacoes: [
        ...state.notificacoes,
        { titulo, mensagem, data: new Date().toISOString() }
      ]
    })),
  limpar: () => set({ notificacoes: [] }),
}));
