import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useCarrinhoStore } from '../../../store/carrinhoStore';
import { useAuthStore } from '../../../store/authStore';

export default function Historico() {
  const [dadosHistorico, setDadosHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [detalhes, setDetalhes] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  const usuario = useAuthStore(state => state.usuario);

  useEffect(() => {
    if (!usuario?.id) return;

    fetch(`https://mercadoaqui.onrender.com/historico/usuario/${usuario.id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Histórico carregado:', data);
        setDadosHistorico(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao buscar histórico:', err);
        setCarregando(false);
      });
  }, [usuario]);

  const verDetalhes = async (id) => {
    try {
      const res = await fetch(`https://mercadoaqui.onrender.com/historico/${id}`);
      const data = await res.json();
      if (data && data.lista) {
        setDetalhes(data);
        setModalVisivel(true);
      } else {
        alert('Não foi possível carregar os detalhes.');
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      alert('Erro ao buscar detalhes.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.mercado}>{item.nome}</Text>
        <Text style={styles.valor}>Total: R$ {Number(item.total)?.toFixed(2) ?? '--'}</Text>
        <Text style={styles.data}>
          {item.criada_em ? new Date(item.criada_em).toLocaleDateString('pt-BR') : 'Data indisponível'}
        </Text>
      </View>
      <TouchableOpacity style={styles.botaoDetalhes} onPress={() => verDetalhes(item.id)}>
        <Text style={styles.textoBotao}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Comparações</Text>
      {carregando ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : dadosHistorico.length > 0 ? (
        <FlatList
          data={dadosHistorico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>
          Nenhuma comparação encontrada.
        </Text>
      )}

      {modalVisivel && detalhes && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>{detalhes.lista.nome}</Text>
            <Text>Mercado: {detalhes.lista.mercado}</Text>
            <Text>Data: {new Date(detalhes.lista.criada_em).toLocaleDateString('pt-BR')}</Text>
            <Text>Total: R$ {Number(detalhes.lista.total).toFixed(2)}</Text>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Produtos:</Text>
            {detalhes.produtos.map((p, i) => (
              <Text key={i}>- {p.nome}</Text>
            ))}
            <TouchableOpacity
              style={{ backgroundColor: '#17a2b8', marginTop: 10, padding: 10, borderRadius: 6, alignItems: 'center' }}
              onPress={() => {
                const ids = detalhes.produtos.map(p => p.id);
                fetch('https://mercadoaqui.onrender.com/historico/comparar', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    produtos: ids,
                    nome: detalhes.lista.nome || 'Comparação',
                    usuarioId: usuario?.id
                  }),
                })
                  .then(res => res.json())
                  .then(resultado => {
                    if (Array.isArray(resultado)) {
                      useCarrinhoStore.getState().setResultadoComparacao(resultado);
                      alert('Comparação realizada! Vá para a aba de lista.');
                    }
                  });
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Comparar novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={styles.botaoFechar}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#007BFF', marginBottom: 20, textAlign: 'center' },
  card: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 16, marginBottom: 12, backgroundColor: '#f9f9f9',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  mercado: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  valor: { fontSize: 14 },
  data: { fontSize: 12, color: '#666' },
  botaoDetalhes: {
    backgroundColor: '#007BFF', paddingVertical: 6,
    paddingHorizontal: 12, borderRadius: 6
  },
  textoBotao: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%'
  },
  modalTitulo: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 10
  },
  botaoFechar: {
    marginTop: 12, backgroundColor: '#007BFF', padding: 10,
    borderRadius: 6, alignItems: 'center'
  }
});
