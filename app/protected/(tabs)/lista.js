import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert
} from 'react-native';
import { useCarrinhoStore } from '../../../store/carrinhoStore';
import { useRouter } from 'expo-router';
import CompararModal from '../../components/comparar';
import { useAuthStore } from '../../../store/authStore';

export default function Lista() {
  const router = useRouter();
  const usuario = useAuthStore(state => state.usuario);
  const {
    adicionar, itens, remover, limpar,
    salvarLista, setResultadoComparacao,
    resultadoComparacao
  } = useCarrinhoStore();

  const [produtos, setProdutos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeLista, setNomeLista] = useState('');
  const [modalComparar, setModalComparar] = useState(false);

  useEffect(() => {
    fetch('https://mercadoaqui.onrender.com/produtos/aprovados')
      .then(res => res.json())
      .then(setProdutos)
      .catch(() => Alert.alert('Erro', 'Falha ao carregar produtos.'));
  }, []);

  useEffect(() => {
    if (resultadoComparacao?.length > 0) {
      setModalComparar(true);
      Alert.alert('Comparação carregada', 'Você foi redirecionado do histórico. Veja os resultados!');
    }
  }, [resultadoComparacao]);

  const handleAdicionar = (produto) => {
    if (itens.some(i => i.id === produto.id)) {
      Alert.alert('Aviso', 'Produto já está na lista.');
      return;
    }
    adicionar({ id: produto.id, nome: produto.nome });
  };

  const compararPrecos = () => {
    if (itens.length === 0) {
      Alert.alert('Aviso', 'Adicione produtos antes de comparar.');
      return;
    }
    setModalVisible(true);
  };

  const confirmarSalvar = async () => {
    const nomeFinal = nomeLista.trim();

    if (!nomeFinal) {
      Alert.alert('Erro', 'Digite um nome válido.');
      return;
    }

    const produtoIds = itens.map(item => item.id);
    if (produtoIds.length === 0) {
      Alert.alert('Lista vazia', 'Adicione itens antes de comparar.');
      return;
    }

    try {
      const response = await fetch('https://mercadoaqui.onrender.com/historico/comparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: produtoIds, usuarioId: usuario?.id, nome: nomeFinal }),
      });
      const resultado = await response.json();
      console.log('Comparação recebida:', resultado);

      if (Array.isArray(resultado)) {
        setResultadoComparacao(resultado);
        setModalComparar(true);
        setNomeLista('');
        setModalVisible(false);
      } else {
        Alert.alert('Erro', 'Resposta inesperada do servidor.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Falha ao comparar preços.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Monte sua Lista</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <TouchableOpacity
              style={styles.botaoAdicionar}
              onPress={() => handleAdicionar(item)}
            >
              <Text style={styles.botaoTexto}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {itens.length > 0 && (
        <>
          <FlatList
            data={itens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemSecundario}>
                <Text style={styles.nome}>{item.nome}</Text>
                <TouchableOpacity onPress={() => remover(item.id)}>
                  <Text style={styles.remover}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.botaoComparar} onPress={compararPrecos}>
            <Text style={styles.botaoTexto}>Comparar Preços</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLimpar} onPress={limpar}>
            <Text style={styles.botaoTexto}>Limpar Lista</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Nome da Lista</Text>
            <TextInput
              placeholder="Ex: Lista da Semana"
              style={styles.input}
              value={nomeLista}
              onChangeText={setNomeLista}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botaoCancelar}>
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarSalvar} style={styles.botaoConfirmar}>
                <Text style={styles.botaoTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CompararModal visivel={modalComparar} onFechar={() => setModalComparar(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  item: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee'
  },
  itemSecundario: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ccc'
  },
  nome: { fontSize: 16 },
  remover: { color: '#d32f2f', fontSize: 13 },
  botaoAdicionar: {
    backgroundColor: '#28a745', padding: 10, borderRadius: 6
  },
  botaoComparar: {
    marginTop: 10, backgroundColor: '#28a745', padding: 12,
    borderRadius: 8, alignItems: 'center'
  },
  botaoLimpar: {
    marginTop: 10, backgroundColor: '#6c757d', padding: 12,
    borderRadius: 8, alignItems: 'center'
  },
  botaoTexto: {
    color: 'white', fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '90%', backgroundColor: 'white', padding: 20,
    borderRadius: 10
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    borderRadius: 6, marginBottom: 10
  },
  modalBotoes: {
    flexDirection: 'row', justifyContent: 'space-between'
  },
  botaoCancelar: {
    backgroundColor: '#aaa', padding: 10, borderRadius: 6
  },
  botaoConfirmar: {
    backgroundColor: '#28a745', padding: 10, borderRadius: 6
  }
});
