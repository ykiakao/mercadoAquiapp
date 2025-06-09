import { Modal, View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ModalConfirmacao({ visivel, mensagem, submensagem, onFechar }) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          alignItems: 'center'
        }}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#28a745" style={{ marginBottom: 12 }} />

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            {mensagem}
          </Text>

          {submensagem && (
            <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
              {submensagem}
            </Text>
          )}

          <Button title="OK" onPress={onFechar} color="#007BFF" />
        </View>
      </View>
    </Modal>
  );
}
