import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const carregarSessao = useAuthStore(state => state.carregarSessao);

  useEffect(() => {
    carregarSessao();
  }, []);

  return <Slot />;
}
