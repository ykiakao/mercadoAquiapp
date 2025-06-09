import {
  View, Text, FlatList, StyleSheet,
  Modal, TouchableOpacity, TextInput
} from 'react-native';
import { useCarrinhoStore } from '../../store/carrinhoStore';
import { useEffect, useState } from 'react';
import { useNotificacoesStore } from '../../store/notificacoesStore';
import * as Notifications from 'expo-notifications';

export default function CompararModal({ visivel, onFechar }) {
  const resultado = useCarrinhoStore(state => state.resultadoComparacao);
  const [nomeLista, setNomeLista] = useState('');
  const adicionarNotificacao = useNotificacoesStore(state => state.adicionar);

  const ordenados = Array.isArray(resultado)
    ? resultado
        .filter(item => typeof item.total === 'number')
        .slice()
        .sort((a, b) => a.total - b.total)
    : [];

  const economia =
    ordenados.length > 1
      ? (ordenados[ordenados.length - 1].total - ordenados[0].total).toFixed(2)
      : null;

  useEffect(() => {
    if (visivel && ordenados.length > 0) {
      // Configura canal de notificação (necessário no Android)
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      const mercadoMaisBarato = ordenados[0]?.mercado;
      const totalMaisBarato = ordenados[0]?.total?.toFixed(2);

      Notifications.scheduleNotificationAsync({
        content: {
          title: '🛒 Comparação finalizada',
          body: `O mercado mais barato foi ${mercadoMaisBarato} com total de R$ ${totalMaisBarato}.`,
          sound: true,
          channelId: 'default',
        },
        trigger: null,
      });

      adicionarNotificacao({
        titulo: 'Comparação finalizada',
        mensagem: `Economia de até R$ ${economia}`,
        data: new Date().toISOString(),
      });
    }
  }, [visivel]);

  if (!visivel || !resultado) return null;

  return (
    <Modal visible={visivel} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titulo}>Comparação de Preços</Text>

          <FlatList
            data={ordenados}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={[styles.card, index === 0 && styles.melhorPreco]}>
                <Text style={styles.nomeMercado}>{item.mercado}</Text>
                <Text style={styles.total}>
                  Total: R$ {Number(item.total || 0).toFixed(2)}
                </Text>
                {item.produtos.map((produto, i) => (
                  <Text key={i} style={styles.produto}>
                    - {produto.nome}: R$ {produto.preco.toFixed(2)}
                  </Text>
                ))}
              </View>
            )}
          />

          {economia && (
            <Text style={styles.economia}>
              Economia máxima: R$ {economia}
            </Text>
          )}

          <TouchableOpacity onPress={onFechar} style={styles.botaoFechar}>
            <Text style={styles.textoBotao}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 10
  },
  modalContainer: {
    backgroundColor: 'white', borderRadius: 10, padding: 16,
    maxHeight: '90%', width: '100%'
  },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  card: {
    padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10,
    borderRadius: 8
  },
  melhorPreco: {
    borderColor: '#28a745', borderWidth: 2,
    backgroundColor: '#eaffea'
  },
  nomeMercado: { fontSize: 16, fontWeight: 'bold' },
  total: { fontSize: 14, color: '#28a745', marginBottom: 4 },
  produto: { fontSize: 13, color: '#333' },
  economia: {
    fontSize: 14, fontWeight: 'bold', color: '#155724',
    backgroundColor: '#d4edda', padding: 10, borderRadius: 6,
    marginTop: 10, textAlign: 'center'
  },
  botaoFechar: {
    backgroundColor: '#007BFF', padding: 12, marginTop: 12,
    borderRadius: 6, alignItems: 'center'
  },
  textoBotao: { color: 'white', fontWeight: 'bold' }
});
