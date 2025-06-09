
# 🛒 MercadoAqui – Comparador de Preços de Supermercado

O **MercadoAqui** é um aplicativo mobile desenvolvido em **React Native com Expo**, que permite ao usuário:

- Criar listas de compras
- Comparar preços entre mercados
- Ver ofertas e cestas básicas atualizadas
- Gerenciar seu perfil e histórico de comparações
- Fazer login e manter sessão com autenticação JWT
- Editar perfil, sair e excluir conta

---

## 🚀 Tecnologias utilizadas

- React Native (com Expo)
- Expo Router
- NestJS (para API e autenticação)
- MySQL + TypeORM
- Context API para autenticação
- `@expo/vector-icons` para ícones
- `expo-checkbox` para validação de termos
- `AsyncStorage` para persistência de sessão
- `FlatList`, `Modal`, `ScrollView`, `StyleSheet`, `TouchableOpacity`, `Alert`

---

## 📁 Estrutura do projetoa

```
app/
├── auth/                 # Telas públicas (Login, Cadastro)
├── protected/(tabs)/    # Telas com navegação por aba
│   ├── index.js         # Home
│   ├── cesta.js         # Cesta básica
│   ├── lista.js         # Lista de compras
│   ├── historico.js     # Histórico de comparações
│   └── perfil.js        # Perfil do usuário (com avatar, edição e logout)
├── components/          # Componentes reutilizáveis (Modal de confirmação, etc)
├── context/             # Contexto de autenticação (AuthContext.js)
└── config.js            # (opcional) Centralização da URL da API
```

---

## ⚙️ Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/ykiakao/mercadoAqui.git
cd mercadoAqui
```

### 2. Instalar as dependências

```bash
npm install
# ou
yarn
```

### 3. Instalar pacotes nativos (se ainda não tiver)

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-checkbox expo-router
```

### 4. Iniciar o projeto

```bash
npx expo start
```

Você pode abrir no seu celular com o app **Expo Go**, em um emulador ou navegador (modo web).

---

## 🧪 Backend (API)

- NestJS com JWT
- Banco de dados MySQL
- Endpoint de login: `POST /auth/login`
- Endpoint de cadastro: `POST /auth/register`

Verifique se seu back-end está rodando localmente na porta `3000` e com `enableCors()` ativado para uso no navegador.

---

## 👤 Usuário de Teste

Use o seguinte login de teste:

- Email: admin@mercado.com
- Senha: admin123

---

## ✅ Funcionalidades já implementadas

- [x] Login com autenticação JWT e armazenamento com AsyncStorage
- [x] Registro de novos usuários com validação e termos de uso
- [x] Perfil do usuário com nome, email e edição via modal
- [x] Botão de logout e exclusão de conta com modal de confirmação
- [x] Integração segura com API usando Context + Token
- [x] Listas de compras, comparação de mercados e histórico
- [x] Design moderno, responsivo e com ícones interativos

---

## 📌 Observações

- O app foi testado em modo web e dispositivo físico via Expo Go
- O IP da API pode precisar ser configurado com `config.js`
- Estrutura pronta para autenticação em múltiplas rotas protegidas
- Pode ser integrado com Firebase ou banco SQL real facilmente

---

## 📄 Licença

Projeto de código aberto para fins educacionais.  
Desenvolvido por **Kaiky Oliveira** e colaboradores.
