import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getHistorico, updateTransacao, deleteTransacao } from '../dataBase/firebaseService.js';
import NavBar from '../components/navBar';

export default function HistoricoScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  const categorias = [
    { label: 'Mercado', value: 'mercado' },
    { label: 'Luz', value: 'luz' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Outros', value: 'outros' },
  ];

  const carregarTransacoes = async () => {
    const resultado = await getHistorico();
    setTransacoes(resultado);
  };

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => abrirModalEdicao(item)}
      style={[styles.item, item.tipo === 'ganho' ? styles.ganho : styles.gasto]}
    >
      <Text style={styles.categoria}>{item.categoria}</Text>
      <Text style={styles.descricao}>{item.titulo}</Text>
      <Text style={styles.valor}>
        {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
      </Text>
      <Text style={styles.data}>{item.data}</Text>
    </TouchableOpacity>
  );

  const handleNavBarPress = (screen) => {
    if (screen === 'Inicio') navigation.navigate('Home');
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'Configuracoes') navigation.navigate('Configuracoes');
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Histórico</Text>

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

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Transação</Text>

              {registroSelecionado?.tipo === 'gasto' && (
                <Dropdown
                  style={styles.modalInput}
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
                style={styles.modalInput}
                value={tituloEdit}
                onChangeText={setTituloEdit}
                placeholder="Título"
              />

              <TextInput
                style={styles.modalInput}
                value={valorEdit}
                onChangeText={setValorEdit}
                placeholder="Valor"
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6b7280" />
                <Button title="Salvar" onPress={salvarEdicao} color="#10b981" />
                <Button title="Excluir" onPress={excluirRegistro} color="#dc2626" />
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
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
