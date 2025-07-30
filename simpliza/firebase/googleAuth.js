// firebase/googleAuth.js
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth(navigation) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'SEU_EXPO_CLIENT_ID',
    iosClientId: 'SEU_IOS_CLIENT_ID',
    androidClientId: 'SEU_ANDROID_CLIENT_ID',
    webClientId: 'SEU_WEB_CLIENT_ID',
  });

  useEffect(() => {
    async function handleAuth() {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        await setDoc(doc(db, 'usuarios', user.uid), {
          nome: user.displayName,
          email: user.email,
          uid: user.uid,
        }, { merge: true });

        navigation.replace('Home');
      }
    }

    handleAuth();
  }, [response]);

  return { promptAsync, request };
}
