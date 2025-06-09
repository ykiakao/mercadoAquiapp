import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Pequeno delay garante que o roteador esteja montado no web
    const timeout = setTimeout(() => {
      router.replace('/auth/login'); // 👈 redireciona com segurança
    }, 100); // pode ajustar para 200ms se necessário

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
