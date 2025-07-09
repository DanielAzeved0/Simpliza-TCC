import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const adicionarTransacao = async (tipo, titulo, valor, categoria) => {
  const data = new Date().toLocaleDateString();
  
  try {
    await addDoc(collection(db, 'transacoes'), {
      tipo,
      titulo,
      valor: parseFloat(valor),
      categoria,
      data
    });
    console.log('Transação adicionada no Firebase.');
  } catch (error) {
    console.error('Erro ao adicionar transação: ', error);
  }
};

export const listarTransacoes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'transacoes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar transações: ', error);
    return [];
  }
};

export const atualizarTransacao = async (id, dadosAtualizados) => {
  const docRef = doc(db, 'transacoes', id);
  await updateDoc(docRef, dadosAtualizados);
};

export const excluirTransacao = async (id) => {
  const docRef = doc(db, 'transacoes', id);
  await deleteDoc(docRef);
};