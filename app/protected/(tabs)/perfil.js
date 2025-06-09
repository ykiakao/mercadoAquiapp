import { View, Text, Button, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout, atualizarUsuario } = useAuthStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalSairVisible, setModalSairVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (usuario) {
      setEditNome(usuario.nome);
      setEditEmail(usuario.email);
    }
  }, [usuario]);

  const salvarEdicao = async () => {
    if (!editNome.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    try {
      const response = await fetch(`https://mercadoaqui.onrender.com/auth/atualizar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuario.id, nome: editNome })
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Nome atualizado com sucesso.");
        setModalVisible(false);
        await atualizarUsuario({ ...usuario, nome: editNome });
      } else {
        Alert.alert("Erro", data.message || "Erro ao atualizar.");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(usuario?.nome?.charAt(0) || '').toUpperCase()}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{usuario?.nome || '-'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{usuario?.email || '-'}</Text>
      </View>

      <View style={styles.button}>
        <Button title="Editar Perfil" color="#007BFF" onPress={() => setModalVisible(true)} />
      </View>

      <View style={styles.button}>
        <Button title="Sair" color="#d32f2f" onPress={() => setModalSairVisible(true)} />
      </View>

      <View style={styles.button}>
        <Button title="Excluir Conta" color="#555" onPress={() => setModalExcluirVisible(true)} />
      </View>

      {/* Modal Editar Perfil */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={editNome}
              onChangeText={setEditNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              autoCapitalize="none"
              editable={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={salvarEdicao}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Sair */}
      <Modal visible={modalSairVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deseja sair?</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>Você será desconectado da sua conta.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalSairVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setModalSairVisible(false);
                  logout();
                  router.replace('/auth/login');
                }}
              >
                <Text style={styles.saveText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Excluir Conta */}
      <Modal visible={modalExcluirVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Excluir Conta</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
              Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalExcluirVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#d32f2f' }]}
                onPress={async () => {
                  try {
                    const response = await fetch(`https://mercadoaqui.onrender.com/auth/remover/${usuario.id}`, {
                      method: 'DELETE'
                    });

                    const data = await response.json();
                    if (response.ok) {
                      Alert.alert("Conta excluída", data.message);
                      logout();
                      router.replace('/auth/login');
                    } else {
                      Alert.alert("Erro", data.message || "Erro ao excluir.");
                    }
                  } catch (err) {
                    Alert.alert("Erro", "Erro ao conectar com o servidor.");
                  }
                }}
              >
                <Text style={styles.saveText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#007BFF', textAlign: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007BFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 32
  },
  label: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  value: { fontSize: 16, marginBottom: 8 },
  button: { marginBottom: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  cancelText: {
    color: '#888'
  },
  saveBtn: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  saveText: {
    color: 'white',
    fontWeight: '600'
  }
});