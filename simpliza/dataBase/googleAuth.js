
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth(navigation) {
  const extra = (Constants?.expoConfig?.extra) || (Constants?.manifest?.extra) || {};
  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || extra.GOOGLE_EXPO_CLIENT_ID || extra.GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || extra.GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || extra.GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || extra.GOOGLE_WEB_CLIENT_ID;

  if (__DEV__) {
    const missing = [];
    if (!expoClientId) missing.push('EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID/WEB_CLIENT_ID');
    if (Platform.OS === 'ios' && !iosClientId) missing.push('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID');
    if (Platform.OS === 'android' && !androidClientId) missing.push('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID');
    if (!webClientId) missing.push('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
    if (missing.length) console.warn('[GoogleAuth] IDs ausentes:', missing.join(', '));
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId,
    iosClientId,
    androidClientId,
    webClientId,
    selectAccount: true,
  });

  useEffect(() => {
    async function handleAuth() {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          await setDoc(doc(db, 'usuarios', user.uid), {
            nome: user.displayName,
            email: user.email,
            uid: user.uid,
          }, { merge: true });
        } catch (err) {
          console.error('Erro ao autenticar com Google:', err);
          Alert.alert('Erro', 'Não foi possível entrar com Google. Tente novamente.');
          return;
        }

        // Salvar preferência para manter conectado (padrão para login Google)
        await AsyncStorage.setItem('manterConectado', 'true');

        navigation.replace('Home');
      }
    }

    handleAuth();
  }, [response]);

  return { promptAsync, request };
}
