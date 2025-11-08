import React, { useEffect, useState, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { getHistorico, updateTransacao, deleteTransacao } from '../dataBase/firebaseService.js';
import NavBar from '../components/navBar';

export default function HistoricoScreen({ navigation }) {
  // Protege botão voltar Android para voltar para tela anterior
  useEffect(() => {
    // BackHandler só funciona em Android/iOS, não na web
    if (Platform.OS === 'web') return;
    
    const backAction = () => {
      if (navigation && navigation.goBack) {
        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
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
    const ordenado = [...resultado].sort((a, b) => {
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
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [valorEdit, setValorEdit] = useState('');
  const [categoriaEdit, setCategoriaEdit] = useState('');
  const [erroTituloEdit, setErroTituloEdit] = useState('');
  const [erroValorEdit, setErroValorEdit] = useState('');
  const tituloEditRef = useRef(null);
  const valorEditRef = useRef(null);

  const abrirModalEdicao = (item) => {
    setRegistroSelecionado(item);
    setTituloEdit(item.titulo);
    setDescricaoEdit(item.descricao || '');
    setValorEdit(item.valor.toString());
    setCategoriaEdit(item.categoria);
    setErroTituloEdit('');
    setErroValorEdit('');
    setModalVisible(true);
    setTimeout(() => {
      if (item.categoria === 'outros' && tituloEditRef.current) {
        tituloEditRef.current.focus();
      } else if (valorEditRef.current) {
        valorEditRef.current.focus();
      }
    }, 300);
  };

  const salvarEdicao = async () => {
    if (!registroSelecionado) return;
    if (categoriaEdit === 'outros' && !tituloEdit.trim()) {
      setErroTituloEdit('Título obrigatório');
      return;
    }
    if (!valorEdit.trim() || isNaN(Number(valorEdit.replace(',', '.')))) {
      setErroValorEdit('Valor inválido');
      return;
    }
    await updateTransacao(registroSelecionado.id, {
      ...registroSelecionado,
      titulo: tituloEdit,
      descricao:
        registroSelecionado?.tipo === 'ganho'
          ? descricaoEdit
          : (registroSelecionado.descricao ?? ''),
      valor: parseFloat(valorEdit.replace(',', '.')),
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
    const categoriaLabel = categorias.find(c => c.value === item.categoria)?.label || item.categoria;
    return (
      <View style={[styles.item, item.tipo === 'ganho' ? styles.ganho : styles.gasto, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => abrirModalEdicao(item)}
          accessibilityRole="button"
          accessibilityLabel={`Editar registro de ${categoriaLabel}`}
          accessibilityHint="Abre o modal para editar este registro"
          testID={`item-editar-${item.id}`}
        >
          <Text style={styles.categoria}>{categoriaLabel}</Text>
          {!(item.tipo === 'gasto' && item.categoria !== 'outros') && (
            <Text style={styles.descricao}>{item.titulo}</Text>
          )}
          <Text style={styles.valor}>
            {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
          </Text>
          <Text style={styles.data}>{dataFormatada}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletePress(item.id)}
          style={{ marginLeft: 10 }}
          accessibilityRole="button"
          accessibilityLabel={`Excluir registro de ${categoriaLabel}`}
          accessibilityHint="Abre o modal de confirmação para excluir este registro"
          testID={`item-excluir-${item.id}`}
        >
          <MaterialIcons
            name="delete"
            size={26}
            color={item.tipo === 'gasto' ? '#dc2626' : '#065f46'}
            accessibilityLabel="Ícone de lixeira"
          />
        </TouchableOpacity>
      </View>
    );
  }

  const excluirRegistroDireto = async (id) => {
    await deleteTransacao(id);
    setConfirmVisible(false);
    setDeleteId(null);
    carregarTransacoes();
  };

  const handleNavBarPress = (screen) => {
    if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'Historico') return; // Já estamos na tela de Histórico
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'DAS') navigation.navigate('DAS');
    else if (screen === 'Configuracoes') navigation.navigate('Configuracoes');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            {/* Ícone de lixeira */}
            <View style={styles.deleteIconContainer}>
              <MaterialIcons name="delete-outline" size={56} color="#dc2626" />
            </View>

            {/* Título */}
            <Text style={styles.deleteModalTitle}>Excluir Registro</Text>

            {/* Mensagem */}
            <Text style={styles.deleteModalMessage}>
              Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </Text>

            {/* Botões */}
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                style={[styles.deleteButton, styles.deleteCancelButton]}
                onPress={() => setConfirmVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancelar exclusão"
              >
                <Text style={styles.deleteCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, styles.deleteConfirmButton]}
                onPress={() => excluirRegistroDireto(deleteId)}
                accessibilityRole="button"
                accessibilityLabel="Confirmar exclusão"
              >
                <Text style={styles.deleteConfirmButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Histórico</Text>
          <TouchableOpacity
            onPress={() => setAjudaVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajuda sobre o histórico"
            accessibilityHint="Mostra explicações sobre como usar o histórico"
            testID="botao-ajuda-historico"
          >
            <Ionicons name="help-circle-outline" size={28} color="#065f46" accessibilityLabel="Ícone de ajuda" />
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
              <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#065f46', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => setAjudaVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.filtros}>
          <TouchableOpacity
            style={[styles.botaoFiltro, filtro === 'todos' && styles.botaoAtivo]}
            onPress={() => setFiltro('todos')}
            accessibilityRole="button"
            accessibilityLabel="Filtrar todos os registros"
            accessibilityState={{ selected: filtro === 'todos' }}
            testID="filtro-todos"
          >
            <Text style={[styles.textoFiltro, filtro === 'todos' && styles.textoAtivo]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoFiltro, filtro === 'ganho' && styles.botaoAtivo]}
            onPress={() => setFiltro('ganho')}
            accessibilityRole="button"
            accessibilityLabel="Filtrar apenas ganhos"
            accessibilityState={{ selected: filtro === 'ganho' }}
            testID="filtro-ganho"
          >
            <Text style={[styles.textoFiltro, filtro === 'ganho' && styles.textoAtivo]}>Ganhos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoFiltro, filtro === 'gasto' && styles.botaoAtivo]}
            onPress={() => setFiltro('gasto')}
            accessibilityRole="button"
            accessibilityLabel="Filtrar apenas gastos"
            accessibilityState={{ selected: filtro === 'gasto' }}
            testID="filtro-gasto"
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

        {/* Modal de edição */}
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

              {categoriaEdit === 'outros' || registroSelecionado?.tipo === 'ganho' ? (
                <>
                  <TextInput
                    ref={tituloEditRef}
                    style={styles.modalInputFull}
                    value={tituloEdit}
                    onChangeText={text => {
                      setTituloEdit(text);
                      setErroTituloEdit(text.trim() ? '' : 'Título obrigatório');
                    }}
                    placeholder="Título"
                    returnKeyType="next"
                    onSubmitEditing={() => valorEditRef.current && valorEditRef.current.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="Campo de título"
                    accessibilityHint="Digite o título do registro"
                    testID="input-titulo-edit"
                  />
                  {!!erroTituloEdit && (
                    <Text style={{ color: 'red', marginBottom: 4 }}>{erroTituloEdit}</Text>
                  )}
                </>
              ) : null}


              <TextInput
                ref={valorEditRef}
                style={styles.modalInputFull}
                value={valorEdit}
                onChangeText={text => {
                  const sanitized = text.replace(/[^0-9,]/g, '');
                  setValorEdit(sanitized);
                  if (!sanitized.trim() || isNaN(Number(sanitized.replace(',', '.')))) {
                    setErroValorEdit('Valor inválido');
                  } else {
                    setErroValorEdit('');
                  }
                }}
                placeholder="Valor"
                inputMode="decimal"
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={salvarEdicao}
                accessibilityLabel="Campo de valor"
                accessibilityHint="Digite o valor do registro, apenas números"
                testID="input-valor-edit"
              />
              {!!erroValorEdit && (
                <Text style={{ color: 'red', marginBottom: 4 }}>{erroValorEdit}</Text>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    registroSelecionado?.tipo === 'gasto' ? styles.cancelButtonRed : styles.cancelButton
                  ]}
                  onPress={() => setModalVisible(false)}
                  accessibilityLabel="Cancelar edição"
                  accessibilityHint="Fecha o modal de edição"
                  testID="botao-cancelar-edicao"
                >
                  <Text style={
                    registroSelecionado?.tipo === 'gasto' ? styles.cancelButtonTextRed : styles.cancelButtonText
                  }>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    registroSelecionado?.tipo === 'gasto' ? styles.saveButtonRed : styles.saveButton,
                    ((categoriaEdit === 'outros' && (!tituloEdit.trim() || !!erroTituloEdit)) || !valorEdit.trim() || !!erroValorEdit) && { opacity: 0.5 }
                  ]}
                  onPress={salvarEdicao}
                  disabled={
                    (categoriaEdit === 'outros' && (!tituloEdit.trim() || !!erroTituloEdit)) ||
                    !valorEdit.trim() || !!erroValorEdit
                  }
                  accessibilityLabel="Salvar edição"
                  accessibilityHint="Salva as alterações do registro"
                  testID="botao-salvar-edicao"
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
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  deleteIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  deleteCancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
  },
  deleteConfirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gastoModalContent: {
    backgroundColor: '#f7f7f7ff',
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
  confirmModalContent: {
    backgroundColor: '#f7f7f7ff',
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
    paddingTop: 60,
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
  },
  botaoFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'transparent',
    marginHorizontal: 4,
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
  }
});