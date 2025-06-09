# 🛒 MercadoAqui – Comparador de Preços de Supermercado

O **MercadoAqui** é um aplicativo mobile desenvolvido em **React Native com Expo**, que permite ao usuário:

- Criar listas de compras personalizadas
- Comparar preços entre mercados próximos
- Ver ofertas e cestas básicas atualizadas
- Adicionar produtos com foto, nome, preço e categoria
- Receber notificações push de alertas de preços
- Visualizar histórico e nomear listas comparadas
- Editar perfil, sair e excluir conta com confirmação

---

## 🚀 Tecnologias utilizadas

- React Native (com Expo)
- Expo Router
- Zustand (para controle de estado)
- NestJS (para API, autenticação e lógica de cestas)
- MySQL + TypeORM
- `expo-notifications` (notificações push)
- `expo-image-picker` (envio de imagem)
- `@expo/vector-icons`, `Modal`, `FlatList`, etc.

---

## 📁 Estrutura do projeto

```
app/
├── auth/                 # Telas públicas (Login, Cadastro)
├── protected/(tabs)/    # Telas com navegação por abas
│   ├── index.js         # Home (produtos e destaque)
│   ├── cesta.js         # Cesta básica (visualização e painel do funcionário)
│   ├── lista.js         # Lista de compras e comparação
│   ├── historico.js     # Histórico de comparações com nome personalizado
│   └── perfil.js        # Perfil do usuário
├── components/          # Componentes reutilizáveis (Modais, ProdutoCard, etc)
├── store/               # Zustand (auth, carrinho, notificações)
├── utils/               # Funções auxiliares e config.js
└── assets/              # Ícones, logos e imagens
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

### 3. Instalar pacotes nativos

```bash
npx expo install \
@react-native-async-storage/async-storage \
expo-checkbox expo-router \
expo-image-picker expo-notifications
```

### 4. Iniciar o projeto

```bash
npx expo start
```

---

## 🧪 Backend (API)

- NestJS com autenticação JWT
- Banco de dados MySQL
- Endpoints:
  - `POST /auth/login` – login
  - `POST /auth/register` – cadastro
  - `GET /produtos/aprovados` – lista de produtos visíveis
  - `GET /cestas` – visualização das cestas básicas
  - `POST /cestas` – criação de cesta (somente funcionário)
  - `GET /produtos/pendentes` – moderação
  - `PUT /produtos/:id/aprovar` – aprovação

---

## 👤 Usuário de Teste

- **Email:** admin@mercado.com  
- **Senha:** admin123

---

## ✅ Funcionalidades implementadas

- [x] Autenticação JWT com Zustand
- [x] Registro e login com persistência via AsyncStorage
- [x] Perfil com edição e exclusão de conta
- [x] Criação de listas e comparação de preços
- [x] Nomeação personalizada de listas
- [x] Histórico de comparações anteriores
- [x] Cesta básica atualizada diariamente (visualização)
- [x] Painel de funcionário para montar cesta e aprovar produtos
- [x] Upload de produtos com foto pelo usuário
- [x] Sistema de moderação de produtos pendentes
- [x] Notificações push automáticas após comparação

---

## 📌 Observações

- O app funciona via Expo Go (modo web, físico ou emulador)
- Configure o IP da API corretamente em `utils/config.js`
- O sistema distingue usuários normais e funcionários
- A estrutura está preparada para expansão com filtros, gráficos, e Firebase

---

## 📄 Licença

Projeto de código aberto para fins educacionais.  
Desenvolvido por **Kaiky Oliveira** e colaboradores.
