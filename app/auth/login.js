import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import ModalConfirmacao from '../components/ModalConfirmacao';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const { login, usuario, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({ email: false, senha: false });
  const [mensagemErro, setMensagemErro] = useState('');
  const [manterConectado, setManterConectado] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);

  // Aguarda Zustand carregar a sessão
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Redireciona se o usuário já estiver logado
    useEffect(() => {
      if (usuario) {
        router.replace('/protected');
      }
    }, [usuario]);

  const handleLogin = async () => {
    const camposInvalidos = {
      email: email.trim() === '',
      senha: senha.trim() === ''
    };
    setErros(camposInvalidos);

    if (camposInvalidos.email || camposInvalidos.senha) {
      setMensagemErro('Preencha todos os campos corretamente.');
      return;
    }

    setMensagemErro('');
    setCarregando(true);

    try {
      const response = await fetch('https://mercadoaqui.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();
      console.log('🔁 RESPOSTA COMPLETA:', data);

      if (response.ok && data.token && data.usuario) {
        await login(data.usuario, data.token, manterConectado);
        console.log('✅ Login bem-sucedido:', data.usuario);
        router.replace('/protected');
      } else {
        setMensagemErro(data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setMensagemErro('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const irParaCadastro = () => {
    router.push('/auth/register');
  };

  const enviarRecuperacao = () => {
    if (!emailRecuperacao.trim()) {
      Alert.alert('Erro', 'Digite seu e-mail para recuperar a senha.');
      return;
    }

    setModalVisivel(false);
    setEmailRecuperacao('');
    setTimeout(() => {
      setModalConfirmacaoVisivel(true);
    }, 300);
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60, backgroundColor: 'white', justifyContent: 'flex-start' }}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{
          width: 240,
          height: 240,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 10
        }}
      />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: erros.email ? '#d32f2f' : '#ccc',
          borderRadius: 8,
          marginBottom: 12,
          padding: 10
        }}
      />

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: erros.senha ? '#d32f2f' : '#ccc',
        borderRadius: 8,
        marginBottom: 4,
        paddingHorizontal: 10
      }}>
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={{ flex: 1, paddingVertical: 10 }}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons
            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setModalVisivel(true)}>
        <Text style={{ color: '#007BFF', textAlign: 'right', marginBottom: 12 }}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => setManterConectado(!manterConectado)}>
          <Ionicons
            name={manterConectado ? 'checkbox' : 'square-outline'}
            size={22}
            color="#007BFF"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 13, marginLeft: 8 }}>Permanecer conectado</Text>
      </View>

      {mensagemErro !== '' && (
        <Text style={{ color: '#d32f2f', textAlign: 'center', marginBottom: 10 }}>
          {mensagemErro}
        </Text>
      )}

      {carregando ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginBottom: 16 }} />
      ) : (
        <Button title="Entrar" color="#007BFF" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={irParaCadastro} style={{ marginTop: 20 }}>
        <Text style={{ color: '#007BFF', textAlign: 'center' }}>
          Ainda não tem conta? Cadastre-se
        </Text>
      </TouchableOpacity>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        mensagem="Verifique seu e-mail!"
        submensagem="Enviamos instruções de recuperação de senha para seu e-mail."
        onFechar={() => setModalConfirmacaoVisivel(false)}
      />
    </View>
  );
}
