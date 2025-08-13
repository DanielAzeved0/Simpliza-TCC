import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

export async function logoutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Erro ao sair:', error);
    return false;
  }
}
