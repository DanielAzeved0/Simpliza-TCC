import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { parse } from 'date-fns'; // usado para interpretar a data no gráfico (dd/MM/yyyy)

// 🔄 Buscar transações (antes estava buscando de 'historico', agora está certo!)
export async function getHistorico() {
  try {
    const snapshot = await getDocs(collection(db, 'transacoes'));
    const lista = [];
    snapshot.forEach(doc => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    return lista;
  } catch (error) {
    console.error('❌ Erro no getHistorico:', error);
    return [];
  }
}

// ➕ Adicionar transação
export const adicionarTransacao = async (tipo, titulo, valor, categoria) => {
  const data = new Date().toLocaleDateString('pt-BR'); // exemplo: "11/07/2025"
  
  try {
    await addDoc(collection(db, 'transacoes'), {
      tipo,
      titulo,
      valor: parseFloat(valor),
      categoria,
      data
    });
    // ✅ sem console.log para não poluir o terminal
  } catch (error) {
    console.error('❌ Erro ao adicionar transação:', error);
  }
};

// 📥 Listar todas as transações (caso precise em outra parte do app)
export const listarTransacoes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'transacoes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error);
    return [];
  }
};

// ✏️ Atualizar transação
export const atualizarTransacao = async (id, dadosAtualizados) => {
  try {
    const docRef = doc(db, 'transacoes', id);
    await updateDoc(docRef, dadosAtualizados);
  } catch (error) {
    console.error('❌ Erro ao atualizar transação:', error);
  }
};

// 🗑️ Excluir transação
export const excluirTransacao = async (id) => {
  try {
    const docRef = doc(db, 'transacoes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('❌ Erro ao excluir transação:', error);
  }
};
