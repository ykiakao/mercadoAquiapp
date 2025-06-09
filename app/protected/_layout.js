import { Slot, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
  const { usuario, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!usuario) {
    return <Redirect href="/auth/login" />;
  }

  return <Slot />;
}
