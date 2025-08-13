import { db, auth } from './firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { parse } from 'date-fns'; // usado para interpretar a data no gráfico (dd/MM/yyyy)

// 🔄 Buscar transações do usuário logado (subcoleção)
export async function getHistorico() {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    const snapshot = await getDocs(transacoesRef);
    const lista = [];
    snapshot.forEach(docSnap => {
      lista.push({ id: docSnap.id, ...docSnap.data() });
    });
    return lista;
  } catch (error) {
    console.error('❌ Erro no getHistorico:', error);
    return [];
  }
}

// ➕ Adicionar transação (subcoleção)
export const adicionarTransacao = async (tipo, titulo, valor, categoria) => {
  const data = new Date().toLocaleDateString('pt-BR');
  const user = auth.currentUser;
  if (!user) {
    console.error("❌ Nenhum usuário logado para adicionar transação.");
    return;
  }
  try {
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    await addDoc(transacoesRef, {
      tipo,
      titulo,
      valor: parseFloat(valor),
      categoria,
      data
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar transação:', error);
  }
};

// 📥 Listar todas as transações do usuário logado (subcoleção)
export const listarTransacoes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    const querySnapshot = await getDocs(transacoesRef);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error);
    return [];
  }
};

// ✏️ Atualizar transação (subcoleção)
export const atualizarTransacao = async (id, dadosAtualizados) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    const docRef = doc(db, 'usuarios', user.uid, 'transacoes', id);
    await updateDoc(docRef, dadosAtualizados);
  } catch (error) {
    console.error('❌ Erro ao atualizar transação:', error);
  }
};

// 🗑️ Excluir transação (subcoleção)
export const excluirTransacao = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    const docRef = doc(db, 'usuarios', user.uid, 'transacoes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('❌ Erro ao excluir transação:', error);
  }
};
