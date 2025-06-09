import { create } from 'zustand';

export const useCarrinhoStore = create((set) => ({
  listas: [],      // múltiplas listas salvas
  itens: [],       // lista em edição
  resultadoComparacao: null, // resultado do /comparar

  adicionar: (item) => set(state => ({
    itens: [...state.itens, item]
  })),

  remover: (id) => set(state => ({
    itens: state.itens.filter(i => i.id !== id)
  })),

  limpar: () => set({ itens: [] }),

  salvarLista: (nomeLista) =>
    set(state => ({
      listas: [
        ...state.listas,
        {
          id: Date.now(),
          nome: nomeLista || `Lista ${state.listas.length + 1}`,
          itens: [...state.itens],
          total: state.itens.reduce((soma, item) => soma + (parseFloat(item.preco) || 0), 0)
        }
      ],
      itens: []
    })),

  setResultadoComparacao: (resultado) => set({ resultadoComparacao: resultado })
}));
