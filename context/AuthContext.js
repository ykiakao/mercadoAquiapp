import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const persistir = await AsyncStorage.getItem('persistir');

        // se o usuário optou por não permanecer conectado, nem tenta carregar
        if (persistir !== 'true') {
          await AsyncStorage.multiRemove(['usuario', 'token', 'persistir']);
          setLoading(false);
          return;
        }

        const t = await AsyncStorage.getItem('token');
        const u = await AsyncStorage.getItem('usuario');

        if (t && u) {
          setToken(t);
          setUsuario(JSON.parse(u));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const login = async (usuario, token, persistir = true) => {
    setUsuario(usuario);
    setToken(token);

    if (persistir) {
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('persistir', 'true');
    } else {
      await AsyncStorage.removeItem('persistir'); // sinaliza que não deve carregar depois
    }
  };

  const logout = async () => {
    setUsuario(null);
    setToken(null);
    await AsyncStorage.multiRemove(['usuario', 'token', 'persistir']);
  };

  const atualizarUsuario = async (novoUsuario) => {
    setUsuario(novoUsuario);
    await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, atualizarUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
