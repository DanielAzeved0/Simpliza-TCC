// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from 'firebase/app'; // Inicializa o aplicativo Firebase
import { getFirestore } from 'firebase/firestore'; // Obtém o serviço Firestore para banco de dados
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Obtém o serviço de autenticação do Firebase
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase para conectar o aplicativo ao projeto no Firebase
const extra = (Constants?.expoConfig?.extra) || (Constants?.manifest?.extra) || {};

// Busca variáveis com prioridade: EXPO_PUBLIC_* -> extra -> variáveis antigas
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extra.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extra.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extra.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || extra.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || extra.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extra.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

// Ajuda a depurar chaves ausentes em desenvolvimento
if (__DEV__) {
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('[Firebase] Variáveis ausentes:', missing.join(', '));
  }
}

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