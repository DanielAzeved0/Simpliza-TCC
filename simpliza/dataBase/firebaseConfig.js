// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from 'firebase/app'; // Inicializa o aplicativo Firebase
import { getFirestore } from 'firebase/firestore'; // Obtém o serviço Firestore para banco de dados
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Obtém o serviço de autenticação do Firebase
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase para conectar o aplicativo ao projeto no Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, // Domínio de autenticação do Firebase
  projectId: process.env.FIREBASE_PROJECT_ID, // ID do projeto no Firebase
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // URL do bucket de armazenamento do Firebase
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID, // ID do remetente para mensagens do Firebase
  appId: process.env.FIREBASE_APP_ID // ID exclusivo do aplicativo Firebase
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