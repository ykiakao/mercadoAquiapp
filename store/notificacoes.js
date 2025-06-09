import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // evita duplicar o alerta
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoNotificacoes() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } else {
    alert('Notificações só funcionam em dispositivo físico.');
    return false;
  }
}

export function ouvirNotificacoesRecebidas(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}
