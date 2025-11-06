// Importa os serviços de autenticação e banco de dados configurados no Firebase
import { db, auth } from './firebaseConfig';

// Importa funções do Firestore para manipulação de coleções e documentos
import {
  collection, // Acessa coleções no Firestore
  addDoc, // Adiciona documentos a uma coleção
  getDocs, // Busca documentos de uma coleção
  doc, // Referencia um documento específico
  updateDoc, // Atualiza um documento existente
  deleteDoc, // Remove um documento
  query, // Cria consultas no Firestore
  where // Adiciona filtros às consultas
} from 'firebase/firestore';

// Importa a função `signOut` para realizar o logout
import { signOut } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { getDoc, deleteField } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa a função `parse` da biblioteca date-fns para manipulação de datas
import { parse } from 'date-fns'; // Interpreta datas no formato dd/MM/yyyy

// Função para buscar o histórico de transações do usuário logado
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
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}

// Função para adicionar uma nova transação à subcoleção do usuário logado
export async function adicionarTransacao(transacao) {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    // Adiciona data/hora atual no momento do registro
    const dataAgora = new Date().toISOString();
    const docRef = await addDoc(transacoesRef, { ...transacao, data: dataAgora });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    return null;
  }
}

// Função para atualizar uma transação existente
export async function updateTransacao(id, novosDados) {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const transacaoDoc = doc(db, 'usuarios', user.uid, 'transacoes', id);
    await updateDoc(transacaoDoc, novosDados);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return false;
  }
}

// Função para deletar uma transação
export async function deleteTransacao(id) {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const transacaoDoc = doc(db, 'usuarios', user.uid, 'transacoes', id);
    await deleteDoc(transacaoDoc);
    return true;
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return false;
  }
}

// Função para buscar transações filtradas por uma condição específica
export async function getTransacoesFiltradas(campo, operador, valor) {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    const consulta = query(transacoesRef, where(campo, operador, valor));
    const snapshot = await getDocs(consulta);
    const lista = [];
    snapshot.forEach(docSnap => {
      lista.push({ id: docSnap.id, ...docSnap.data() });
    });
    return lista;
  } catch (error) {
    console.error('Erro ao buscar transações filtradas:', error);
    return [];
  }
}

// Função para realizar o logout do usuário autenticado
export async function logoutUser() {
  try {
    // Limpar dados de persistência local
    await AsyncStorage.removeItem('manterConectado');
    
    await signOut(auth); // Realiza o logout usando o serviço de autenticação do Firebase
    console.log('Logout realizado com sucesso.');
    return true; // Retorna true se o logout for bem-sucedido
  } catch (error) {
    console.error('Erro ao realizar logout:', error.message); // Exibe o erro no console
    return false; // Retorna false em caso de erro
  }
}

// Exporta todos os dados do usuário como objeto (portabilidade)
export async function exportUserData() {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    const userDocRef = doc(db, 'usuarios', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const data = userSnapshot.exists() ? userSnapshot.data() : {};

    // Buscar transações
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    const snapshot = await getDocs(transacoesRef);
    const transacoes = [];
    snapshot.forEach(docSnap => transacoes.push({ id: docSnap.id, ...docSnap.data() }));

    return { user: { uid: user.uid, ...data }, transacoes };
  } catch (error) {
    console.error('Erro ao exportar dados do usuário:', error);
    return null;
  }
}

// Deleta todos os dados do Firestore do usuário e em seguida exclui a conta Auth
export async function deleteUserDataAndAccount() {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    // Deletar transações
    const transacoesRef = collection(db, 'usuarios', user.uid, 'transacoes');
    const snapshot = await getDocs(transacoesRef);
    const deletes = [];
    snapshot.forEach(docSnap => deletes.push(deleteDoc(doc(db, 'usuarios', user.uid, 'transacoes', docSnap.id))));
    await Promise.all(deletes);

    // Deletar documento do usuário
    await deleteDoc(doc(db, 'usuarios', user.uid));

    // Deletar conta do Auth
    await deleteUser(user);

    return true;
  } catch (error) {
    console.error('Erro ao excluir dados/conta do usuário:', error);
    return false;
  }
}

// Função para atualizar o status de verificação de email do usuário
export async function atualizarStatusVerificacaoEmail() {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Recarregar dados do usuário para obter status atualizado
    await user.reload();
    
    // Atualizar no Firestore
    const userDocRef = doc(db, 'usuarios', user.uid);
    await updateDoc(userDocRef, {
      emailVerificado: user.emailVerified
    });
    
    return user.emailVerified;
  } catch (error) {
    console.error('Erro ao atualizar status de verificação:', error);
    return false;
  }
}

