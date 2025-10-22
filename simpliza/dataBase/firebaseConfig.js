// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from 'firebase/app'; // Inicializa o aplicativo Firebase
import { getFirestore } from 'firebase/firestore'; // Obtém o serviço Firestore para banco de dados
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Obtém o serviço de autenticação do Firebase
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase para conectar o aplicativo ao projeto no Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMkvjx7_QnjobX_GfnCdf6wa1n0JFaD8Y", // Chave de API para autenticação com o Firebase
  authDomain: "simpliza-33e9a.firebaseapp.com", // Domínio de autenticação do Firebase
  projectId: "simpliza-33e9a", // ID do projeto no Firebase
  storageBucket: "simpliza-33e9a.firebasestorage.app", // URL do bucket de armazenamento do Firebase
  messagingSenderId: "564167923878", // ID do remetente para mensagens do Firebase
  appId: "1:564167923878:web:49886b1b97d5cb89e5fc67" // ID exclusivo do aplicativo Firebase
};

// Inicializa o aplicativo Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Inicializa o serviço de autenticação do Firebase com persistência AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa o serviço Firestore para operações no banco de dados
const db = getFirestore(app);

// Exporta os serviços de autenticação e banco de dados para uso em outras partes do aplicativo
export { auth, db };