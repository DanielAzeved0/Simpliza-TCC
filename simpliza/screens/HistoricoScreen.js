import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { getHistorico, updateTransacao, deleteTransacao } from '../dataBase/firebaseService.js';
import NavBar from '../components/navBar';

export default function HistoricoScreen({ navigation }) {
  const [ajudaVisible, setAjudaVisible] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const categorias = [
    { label: 'Comida', value: 'mercado' },
    { label: 'Luz', value: 'luz' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Outros', value: 'outros' },
  ];

  const carregarTransacoes = async () => {
    const resultado = await getHistorico();
    // Ordena por data/hora decrescente (mais recente primeiro)
    const ordenado = [...resultado].sort((a, b) => {
      // Se data for string, converte para Date
      const dataA = a.data ? new Date(a.data) : new Date(0);
      const dataB = b.data ? new Date(b.data) : new Date(0);
      return dataB - dataA;
    });
    setTransacoes(ordenado);
  }

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [tituloEdit, setTituloEdit] = useState('');
  const [valorEdit, setValorEdit] = useState('');
  const [categoriaEdit, setCategoriaEdit] = useState('');

  const abrirModalEdicao = (item) => {
    setRegistroSelecionado(item);
    setTituloEdit(item.titulo);
    setValorEdit(item.valor.toString());
    setCategoriaEdit(item.categoria);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!registroSelecionado) return;

    await updateTransacao(registroSelecionado.id, {
      ...registroSelecionado,
      titulo: tituloEdit,
      valor: parseFloat(valorEdit),
      categoria: categoriaEdit
    });

    setModalVisible(false);
    carregarTransacoes();
  };

  const excluirRegistro = async () => {
    if (!registroSelecionado) return;

    await deleteTransacao(registroSelecionado.id);
    setModalVisible(false);
    carregarTransacoes();
  };

  const filtrarTransacoes = () => {
    if (filtro === 'todos') return transacoes;
    return transacoes.filter(item => item.tipo === filtro);
  };

  const renderItem = ({ item }) => {
    // Formatar data/hora para exibição
    let dataFormatada = '';
    if (item.data) {
      const d = new Date(item.data);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const ano = d.getFullYear();
      const hora = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      dataFormatada = `${dia}/${mes}/${ano} ${hora}:${min}`;
    }
    const handleDeletePress = (id) => {
      setDeleteId(id);
      setConfirmVisible(true);
    };
    // Buscar o label da categoria
    const categoriaLabel = categorias.find(c => c.value === item.categoria)?.label || item.categoria;
    return (
      <View style={[styles.item, item.tipo === 'ganho' ? styles.ganho : styles.gasto, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
        <TouchableOpacity style={{ flex: 1 }} onPress={() => abrirModalEdicao(item)}>
          <Text style={styles.categoria}>{categoriaLabel}</Text>
          {/* Mostrar descrição apenas se não for gasto ou se for gasto com categoria 'outros' */}
          {!(item.tipo === 'gasto' && item.categoria !== 'outros') && (
            <Text style={styles.descricao}>{item.titulo}</Text>
          )}
          <Text style={styles.valor}>
            {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
          </Text>
          <Text style={styles.data}>{dataFormatada}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 10 }}>
          <MaterialIcons name="delete" size={26} color="#065f46" />
        </TouchableOpacity>
      </View>
    );
  } // fechamento correto da função renderItem

  // Excluir direto sem abrir modal de edição
  const excluirRegistroDireto = async (id) => {
    await deleteTransacao(id);
    setConfirmVisible(false);
    setDeleteId(null);
    carregarTransacoes();
  };

  const handleNavBarPress = (screen) => {
    if (screen === 'Inicio') navigation.navigate('Home');
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'Configuracoes') navigation.navigate('Configuracoes');
  };
  return (
    <View style={{ flex: 1 }}>
      {/* Modal de confirmação minimalista */}
        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmVisible(false)}
        >
          <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalContent}>
              <MaterialIcons name="delete" size={38} color="#065f46" style={{ marginBottom: 10 }} />
              <Text style={{ fontSize: 16, color: '#065f46', fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>Deseja realmente excluir este registro?</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={() => setConfirmVisible(false)} style={{ backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, borderWidth: 1, borderColor: '#065f46' }}>
                  <Text style={{ color: '#065f46', fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirRegistroDireto(deleteId)} style={{ backgroundColor: '#065f46', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>Histórico</Text>
            <TouchableOpacity onPress={() => setAjudaVisible(true)}>
              <Ionicons name="help-circle-outline" size={28} color="#065f46" />
            </TouchableOpacity>
          </View>
          <Modal
            visible={ajudaVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setAjudaVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sobre o Histórico</Text>
                <Text style={{ marginBottom: 20 }}>
                  Aqui você visualiza todos os seus registros de ganhos e gastos, pode editar ou excluir cada transação e filtrar por tipo. Toque em um item para editar ou excluir.
                </Text>
                <Button title="Fechar" onPress={() => setAjudaVisible(false)} color="#065f46" />
              </View>
            </View>
          </Modal>

          <View style={styles.filtros}>
            <TouchableOpacity
              style={[styles.botaoFiltro, filtro === 'todos' && styles.botaoAtivo]}
              onPress={() => setFiltro('todos')}
            >
              <Text style={[styles.textoFiltro, filtro === 'todos' && styles.textoAtivo]}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoFiltro, filtro === 'ganho' && styles.botaoAtivo]}
              onPress={() => setFiltro('ganho')}
            >
              <Text style={[styles.textoFiltro, filtro === 'ganho' && styles.textoAtivo]}>Ganhos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoFiltro, filtro === 'gasto' && styles.botaoAtivo]}
              onPress={() => setFiltro('gasto')}
            >
              <Text style={[styles.textoFiltro, filtro === 'gasto' && styles.textoAtivo]}>Gastos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filtrarTransacoes()}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* Modal de edição (verde claro, igual ao de confirmação) */}
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.confirmModalOverlay}>
              <View style={
                registroSelecionado?.tipo === 'gasto'
                  ? styles.gastoModalContent
                  : styles.confirmModalContent
              }>
                <Text style={styles.modalTitle}>Editar Transação</Text>

                {registroSelecionado?.tipo === 'gasto' && (
                  <Dropdown
                    style={styles.modalInputFull}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={categorias}
                    labelField="label"
                    valueField="value"
                    placeholder="Categoria"
                    value={categoriaEdit}
                    onChange={item => setCategoriaEdit(item.value)}
                  />
                )}

                <TextInput
                  style={styles.modalInputFull}
                  value={tituloEdit}
                  onChangeText={setTituloEdit}
                  placeholder="Título"
                />

                <TextInput
                  style={styles.modalInputFull}
                  value={valorEdit}
                  onChangeText={setValorEdit}
                  placeholder="Valor"
                  keyboardType="numeric"
                />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      registroSelecionado?.tipo === 'gasto' ? styles.cancelButtonRed : styles.cancelButton
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={
                      registroSelecionado?.tipo === 'gasto' ? styles.cancelButtonTextRed : styles.cancelButtonText
                    }>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      registroSelecionado?.tipo === 'gasto' ? styles.saveButtonRed : styles.saveButton
                    ]}
                    onPress={salvarEdicao}
                  >
                    <Text style={
                      registroSelecionado?.tipo === 'gasto' ? styles.saveButtonTextRed : styles.saveButtonText
                    }>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </Modal>
        </View>
      <NavBar onPress={handleNavBarPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  gastoModalContent: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    shadowOffset: { width: 0, height: 2 },
  },
  cancelButtonRed: {
    backgroundColor: '#dc2626',
    marginRight: 8,
  },
  saveButtonRed: {
    backgroundColor: '#f87171',
    marginLeft: 8,
  },
  cancelButtonTextRed: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonTextRed: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#d1fae5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#065f46',
    shadowColor: '#065f46',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'center',
    marginBottom: 20,
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  botaoFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  botaoAtivo: {
    backgroundColor: '#333',
  },
  textoFiltro: {
    color: '#333',
    fontWeight: 'bold',
  },
  textoAtivo: {
    color: '#fff',
  },
  item: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ganho: {
    backgroundColor: '#d1fae5',
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
  },
  gasto: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 5,
    borderLeftColor: '#dc2626',
  },
  descricao: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  valor: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  categoria: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalInputFull: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    width: '100%',
    gap: 0,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#065f46',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
});
// Fim do bloco de estilos
