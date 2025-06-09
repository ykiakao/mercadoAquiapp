import {
  View, Text, TextInput, Button,
  StyleSheet, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useAuthStore } from '../../store/authStore';


export default function AdicionarProduto({ onSucesso }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [mercadoSelecionado, setMercadoSelecionado] = useState('');
  const [mercados, setMercados] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch('https://mercadoaqui.onrender.com/mercados')
      .then(res => res.json())
      .then(data => {
        console.log('Mercados carregados:', data);
        if (Array.isArray(data)) setMercados(data);
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os mercados.'));
  }, []);

  const enviarProduto = async () => {
    if (!nome || !preco || !categoria || !tipo || !mercadoSelecionado) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione um mercado.');
      return;
    }

    setEnviando(true);
    const token = useAuthStore.getState().token;
    const body = {
      nome,
      preco: parseFloat(preco),
      categoria,
      tipo,
      mercado_id: mercadoSelecionado
    };

    try {
      const res = await fetch('https://mercadoaqui.onrender.com/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const produtoCriado = await res.json();
        Alert.alert('Sucesso', 'Produto enviado!.');
        setNome('');
        setPreco('');
        setCategoria('');
        setTipo('');
        setMercadoSelecionado('');
        if (onSucesso) onSucesso(produtoCriado);
      } else {
        const errorText = await res.text();
        Alert.alert('Erro', `Falha ao enviar produto:\n${errorText}`);
      }
    } catch (e) {
      Alert.alert('Erro', 'Problema na conexão com o servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Produto</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={categoria}
          onValueChange={(value) => setCategoria(value)}
        >
          <Picker.Item label="Selecione a categoria" value="" />
          <Picker.Item label="Mercearia" value="Mercearia" />
          <Picker.Item label="Laticínios" value="Laticínios" />
          <Picker.Item label="Bebidas" value="Bebidas" />
          <Picker.Item label="Higiene" value="Higiene" />
          <Picker.Item label="Limpeza" value="Limpeza" />
        </Picker>
      </View>

      <TextInput
        placeholder="Tipo (ex: Refrigerante, Sabonete, etc)"
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={mercadoSelecionado}
          onValueChange={(value) => setMercadoSelecionado(value)}
        >
          <Picker.Item label="Selecione o mercado" value="" />
          {mercados.map((m) => (
            <Picker.Item key={m.id} label={m.nome} value={m.id} />
          ))}
        </Picker>
      </View>

      {enviando ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 10 }} />
      ) : (
        <Button title="Enviar Produto" onPress={enviarProduto} color="#007BFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flex: 1 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12
  },
  pickerBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginBottom: 12
  },
  linha: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12
  }
});
