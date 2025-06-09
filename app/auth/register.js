import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ModalConfirmacao from '../components/ModalConfirmacao';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const router = useRouter();
  const { loading, usuario } = useAuthStore();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erros, setErros] = useState({ nome: false, email: false, senha: false, confirmar: false });
  const [mensagemErro, setMensagemErro] = useState('');
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [emailDisponivel, setEmailDisponivel] = useState(null);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (usuario) {
    router.replace('/protected');
    return null;
  }

  const verificarEmail = async (valorEmail) => {
    setEmail(valorEmail);
    setEmailDisponivel(null);
    setErros((e) => ({ ...e, email: false }));

    if (valorEmail.trim() === '') return;

    try {
      const response = await fetch(`https://mercadoaqui.onrender.com/auth/verificar-email?email=${encodeURIComponent(valorEmail)}`);
      const data = await response.json();
      if (data.existe) {
        setEmailDisponivel(false);
        setErros((e) => ({ ...e, email: true }));
        setMensagemErro('Este e-mail já está cadastrado.');
      } else {
        setEmailDisponivel(true);
        setMensagemErro('');
      }
    } catch (err) {
      console.log('Erro ao verificar e-mail:', err);
    }
  };

  const validarCadastro = async () => {
    const camposInvalidos = {
      nome: nome.trim() === '',
      email: email.trim() === '',
      senha: senha.trim() === '',
      confirmar: confirmarSenha.trim() === ''
    };

    setErros(camposInvalidos);

    if (Object.values(camposInvalidos).some(Boolean)) {
      setMensagemErro('Preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      setMensagemErro('A senha deve ter pelo menos 6 caracteres.');
      setErros((e) => ({ ...e, senha: true }));
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagemErro('As senhas não coincidem.');
      setErros((e) => ({ ...e, senha: true, confirmar: true }));
      return;
    }

    if (!aceitouTermos) {
      setMensagemErro('Você precisa aceitar os termos de uso.');
      return;
    }

    setMensagemErro('');

    try {
      const response = await fetch('https://mercadoaqui.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, tipo: 'CLIENTE' })
      });

      if (response.ok) {
        setModalConfirmacao(true);
      } else {
        const erro = await response.json();
        if (erro.message?.includes('E-mail') || erro.message?.includes('email')) {
          setErros((e) => ({ ...e, email: true }));
          setMensagemErro('Este e-mail já está em uso.');
        } else {
          setMensagemErro(erro.message || 'Erro no cadastro.');
        }
      }
    } catch (err) {
      setMensagemErro('Erro ao conectar com o servidor.');
    }
  };

  const irParaLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, padding: 20, paddingTop: 60, backgroundColor: 'white' }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 180,
            height: 180,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10
          }}
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Cadastro</Text>

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={{
            borderWidth: 1,
            borderColor: erros.nome ? '#d32f2f' : '#ccc',
            borderRadius: 8,
            marginBottom: 12,
            padding: 10
          }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={verificarEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: erros.email ? '#d32f2f' : emailDisponivel === true ? '#4caf50' : '#ccc',
            borderRadius: 8,
            marginBottom: 12,
            padding: 10
          }}
        />

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            style={{
              borderWidth: 1,
              borderColor: erros.senha ? '#d32f2f' : '#ccc',
              borderRadius: 8,
              marginBottom: 12,
              padding: 10,
              paddingRight: 40
            }}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={{ position: 'absolute', right: 10, top: 10 }}
          >
            <Ionicons
              name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!mostrarConfirmarSenha}
            style={{
              borderWidth: 1,
              borderColor: erros.confirmar ? '#d32f2f' : '#ccc',
              borderRadius: 8,
              marginBottom: 20,
              padding: 10,
              paddingRight: 40
            }}
          />
          <TouchableOpacity
            onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            style={{ position: 'absolute', right: 10, top: 10 }}
          >
            <Ionicons
              name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Checkbox
            value={aceitouTermos}
            onValueChange={setAceitouTermos}
            color="#007BFF"
          />
          <Text style={{ fontSize: 13, marginLeft: 8 }}>
            Li e aceito os <Text style={{ color: '#007BFF' }}>termos de uso</Text>
          </Text>
        </View>

        {mensagemErro !== '' && (
          <Text style={{ color: '#d32f2f', textAlign: 'center', marginBottom: 12 }}>
            {mensagemErro}
          </Text>
        )}

        <Button title="Cadastrar" color="#007BFF" onPress={validarCadastro} />

        <TouchableOpacity onPress={irParaLogin} style={{ marginTop: 20 }}>
          <Text style={{ color: '#007BFF', textAlign: 'center' }}>
            Já tem conta? Fazer login
          </Text>
        </TouchableOpacity>

        <ModalConfirmacao
          visivel={modalConfirmacao}
          mensagem="Cadastro realizado com sucesso!"
          submensagem="Você será redirecionado para o login."
          onFechar={() => {
            setModalConfirmacao(false);
            router.replace('/auth/login');
          }}
        />
      </View>
    </ScrollView>
  );
}
