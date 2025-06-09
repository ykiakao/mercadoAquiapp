import {
  View, Text, TextInput, ScrollView,
  StyleSheet, TouchableOpacity, Animated,
  Button, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import ProdutoModal from '../../components/ProdutoModal';
import AdicionarProduto from '../../components/adicionar-produtos';
import { useAuthStore } from '../../../store/authStore';
import { useNotificacoesStore } from '../../../store/notificacoesStore';

// Configura o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAdicionarVisivel, setModalAdicionarVisivel] = useState(false);
  const usuario = useAuthStore(state => state.usuario);
  const adicionarNotificacao = useNotificacoesStore(state => state.adicionar);

  const refs = {
    Mercearia: useRef(null),
    Laticínios: useRef(null),
    Bebidas: useRef(null),
    Higiene: useRef(null),
    Limpeza: useRef(null),
  };

  useEffect(() => {
    fetch('https://mercadoaqui.onrender.com/produtos/com-precos')
      .then(res => res.json())
      .then(data => setProdutos(Array.isArray(data) ? data : []))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  useEffect(() => {
    async function registrarDispositivo() {
      if (!Device.isDevice) {
        alert('Use um dispositivo físico para testar notificações.');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Permissão para notificações foi negada.');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📲 TOKEN:', token);
    }

    registrarDispositivo();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      adicionarNotificacao(title, body);
    });

    // Teste de notificação local ao abrir app
    setTimeout(() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Notificação de teste',
          body: 'Essa é uma notificação local automática!',
          sound: true,
          channelId: 'default',
        },
        trigger: null,
      });
    }, 3000);

    return () => subscription.remove();
  }, []);

  const handleCategoriaClick = (categoria) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();

    refs[categoria].current?.measureLayout(
      scrollViewRef.current,
      (_x, y) => scrollViewRef.current.scrollTo({ y, animated: true })
    );
  };

  const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const produtosPorCategoria = (cat) =>
    produtos.filter(p => normalize(p.categoria) === normalize(cat));
  const ofertas = produtos.slice(0, 8).map(p => ({ ...p, desconto: 10 + Math.floor(Math.random() * 6) }));

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalVisivel(true);
  };

  const renderProdutos = (lista) => lista.map((item, index) => (
    <TouchableOpacity key={index} style={styles.productCard} onPress={() => abrirModal(item)}>
      <Text style={styles.productName}>{item.nome}</Text>
      <Text style={styles.price}>R$ {Number(item.preco)?.toFixed(2) ?? '--'}</Text>
      <Text style={styles.meta}>Tipo: {item.tipo || '-'}</Text>
      <Text style={styles.meta}>Categoria: {item.categoria || '-'}</Text>
      <Text style={styles.meta}>Mercado: {item?.mercado?.nome || 'Não informado'}</Text>
      {item.desconto && <Text style={styles.discount}>-{item.desconto}% OFF</Text>}
    </TouchableOpacity>
  ));

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} ref={scrollViewRef}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.highlight}>Mercado</Text><Text style={styles.bold}>Aqui</Text>
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder="Pesquisar" style={styles.searchInput} />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {Object.keys(refs).map((cat, index) => (
              <TouchableOpacity key={index} onPress={() => handleCategoriaClick(cat)}>
                <Animated.View style={[styles.categoryItem, { opacity: fadeAnim }]}>
                  <Ionicons name="leaf-outline" size={20} color="white" />
                  <Text style={styles.categoryText}>{cat}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Ofertas</Text>
        <View style={styles.offerGrid}>{renderProdutos(ofertas)}</View>

        {Object.keys(refs).map((cat, idx) => (
          <View key={idx} ref={refs[cat]}>
            <Text style={styles.sectionTitle}>{cat}</Text>
            <View style={styles.offerGrid}>{renderProdutos(produtosPorCategoria(cat))}</View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalAdicionarVisivel(true)}>
        <Ionicons name="add-circle" size={56} color="#007BFF" />
      </TouchableOpacity>

      {produtoSelecionado && (
        <ProdutoModal
          visivel={modalVisivel}
          produto={produtoSelecionado}
          onFechar={() => setModalVisivel(false)}
          onAdicionar={() => alert('Ainda não implementado.')}
        />
      )}

      {modalAdicionarVisivel && (
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <ScrollView contentContainerStyle={styles.modalBox}>
              <AdicionarProduto
                onSucesso={(produto) => {
                  setProdutos(prev => [produto, ...prev]);
                  setModalAdicionarVisivel(false);
                }}
              />
              <Button title="Cancelar" onPress={() => setModalAdicionarVisivel(false)} color="#d32f2f" />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16
  },
  logo: { fontSize: 24, fontWeight: 'bold' },
  highlight: { color: '#007BFF', fontWeight: '900' },
  bold: { fontWeight: '900' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f0f0f0', borderRadius: 10,
    paddingHorizontal: 10, marginBottom: 20
  },
  searchInput: { marginLeft: 8, flex: 1, height: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  categoryScroll: { marginBottom: 24 },
  categoryItem: {
    width: 80, height: 60, backgroundColor: '#007BFF',
    borderRadius: 10, padding: 6,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10
  },
  categoryText: { color: 'white', fontSize: 11, marginTop: 4 },
  offerGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  productCard: {
    width: '48%', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 10, padding: 8, marginBottom: 12
  },
  price: { fontWeight: 'bold', fontSize: 16 },
  meta: { fontSize: 12, color: '#444' },
  discount: { color: 'green', fontWeight: 'bold', marginBottom: 4 },
  productName: { fontSize: 12, color: '#333' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10,
    justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 30
  }
});
