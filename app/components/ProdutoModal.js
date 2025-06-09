import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import { useCarrinhoStore } from '../../store/carrinhoStore';

export default function ProdutoModal({ visivel, produto, onFechar }) {
  const adicionar = useCarrinhoStore(state => state.adicionar);

  if (!produto) return null;

  const handleAdicionar = () => {
    adicionar({
      id: produto.id,
      nome: produto.nome,
      preco: parseFloat(produto.preco || 0)
    });
    onFechar(); // Fecha o modal após adicionar
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.titulo}>{produto.nome}</Text>
          <Text style={styles.texto}>Preço: R$ {parseFloat(produto.preco || 0).toFixed(2)}</Text>
          <Text style={styles.texto}>Tipo: {produto.tipo || '-'}</Text>
          <Text style={styles.texto}>Categoria: {produto.categoria || '-'}</Text>
          <Text style={styles.texto}>Mercado: {produto.mercado?.nome || '-'}</Text>

          <View style={styles.botoes}>
            <Button title="Adicionar à Lista" onPress={handleAdicionar} color="#007BFF" />
            <View style={{ height: 8 }} />
            <Button title="Fechar" onPress={onFechar} color="#888" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 20
  },
  modalBox: {
    width: '100%', backgroundColor: 'white', borderRadius: 10,
    padding: 20
  },
  titulo: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 10
  },
  texto: {
    fontSize: 14, marginBottom: 4
  },
  botoes: {
    marginTop: 20
  }
});
