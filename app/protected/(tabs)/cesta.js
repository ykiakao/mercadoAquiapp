
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Alert, TextInput
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cesta() {
  const [cestas, setCestas] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState('');

useEffect(() => {
  fetch('https://mercadoaqui.onrender.com/cestas')
    .then(res => res.json())
    .then(data => {
      const ordenadas = [...data].sort((a, b) => parseFloat(a.preco_total) - parseFloat(b.preco_total));
      setCestas(ordenadas);
    })
    .catch((err) => {
      console.error('❌ Erro ao buscar cestas:', err);
      Alert.alert('Erro', 'Falha ao carregar cestas básicas.');
    });

  AsyncStorage.getItem('usuario')
    .then(json => {
      if (json) {
        const user = JSON.parse(json);
        setTipoUsuario(user.tipo || '');
      }
    });
}, []);


  const calcularTotal = (produtos) =>
    produtos.reduce((soma, item) => soma + (parseFloat(item.preco) || 0), 0);

  const editarPreco = (produto, novaCestaId) => {
    Alert.prompt(
      'Novo Preço',
      `Alterar preço de ${produto.nome}`,
      (texto) => {
        const novoPreco = parseFloat(texto);
        if (!isNaN(novoPreco)) {
          setCestas(prev => prev.map(c => {
            if (c.id === novaCestaId) {
              return {
                ...c,
                produtos: c.produtos.map(p =>
                  p.nome === produto.nome ? { ...p, preco: novoPreco } : p
                )
              };
            }
            return c;
          }));
        }
      },
      'plain-text',
      produto.preco.toString()
    );
  };

  const renderCesta = ({ item }) => {
    const total = calcularTotal(item.produtos);
    const menorTotal = Math.min(...cestas.map(c => calcularTotal(c.produtos)));
    const isMaisBarata = total === menorTotal;

    return (
      <View style={[styles.card, isMaisBarata && styles.cardDestaque]}>
        <View style={styles.headerRow}>
          <Text style={styles.mercado}>{item.mercado?.nome}</Text>
          {isMaisBarata && <Text style={styles.selo}>Mais Barata</Text>}
        </View>

        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

        <View style={styles.produtosBox}>
          {item.produtos.map((produto, index) => (
            <View key={index} style={styles.produtoRow}>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>
                R$ {(parseFloat(produto.preco) || 0).toFixed(2)}
              </Text>

              {tipoUsuario === 'funcionario' && (
                <TouchableOpacity onPress={() => editarPreco(produto, item.id)}>
                  <Text style={styles.editarBotao}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.data}>Atualizado em: {item.data}</Text>

        <View style={styles.botoesBox}>
      <TouchableOpacity style={styles.botao} onPress={() => alert('Serviço de rotas está indisponível')}>
        <Text style={styles.botaoTexto}>Ver Rota</Text>
      </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Comparativo de Cestas Básicas</Text>
      <FlatList
        data={cestas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCesta}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#007BFF', marginBottom: 20, textAlign: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9'
  },
  cardDestaque: {
    borderColor: '#28a745',
    backgroundColor: '#eafff1'
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selo: {
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  mercado: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  total: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#007BFF' },
  produtosBox: { marginBottom: 8 },
  produtoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4
  },
  produtoNome: { fontSize: 14, flex: 1 },
  produtoPreco: { fontSize: 14, fontWeight: '600', marginHorizontal: 10 },
  editarBotao: { color: '#007BFF', fontSize: 12 },
  data: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 8 },
  botoesBox: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  botao: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  botaoTexto: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold'
  }
});
1 