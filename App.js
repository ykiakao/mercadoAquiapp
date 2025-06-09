import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { useNotificacoesStore } from './store/notificacoesStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const adicionarNotificacao = useNotificacoesStore(state => state.adicionar);

  async function registrarDispositivo() {
    if (Device.isDevice) {
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
      console.log('TOKEN DE NOTIFICAÇÃO:', token);
    } else {
      alert('É necessário usar um dispositivo físico.');
    }
  }

  useEffect(() => {
    registrarDispositivo();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      adicionarNotificacao(title, body);
    });

    // 🔔 Teste de notificação local após 5 segundos
    setTimeout(() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Notificação de teste',
          body: 'Essa é uma notificação local de exemplo!',
          sound: true,
          channelId: 'default',
        },
        trigger: { seconds: 1 }, // Garante que a notificação apareça
      });
    }, 5000);

    return () => subscription.remove();
  }, []);

  <TouchableOpacity
  onPress={() => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Teste Manual',
        body: 'Essa é uma notificação local enviada por botão!',
        sound: true,
        channelId: 'default',
      },
      trigger: { seconds: 2 },
    });
  }}
  style={{
    marginTop: 20, padding: 12, backgroundColor: 'blue', borderRadius: 6
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Testar Notificação</Text>
</TouchableOpacity>


  return (
    <View style={styles.container}>
      <Text>App carregado com notificações push habilitadas.</Text>
      <StatusBar style="auto" />
    </View>
  );
}
