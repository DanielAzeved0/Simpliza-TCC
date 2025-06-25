import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { listarTransacoes } from '../firebase/firebaseService.js';

export default function HistoricoScreen() {
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  const carregarTransacoes = async () => {
    const resultado = await listarTransacoes();
    setTransacoes(resultado);
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const filtrarTransacoes = () => {
    if (filtro === 'todos') return transacoes;
    return transacoes.filter(item => item.tipo === filtro);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.tipo === 'ganho' ? styles.ganho : styles.gasto]}>
      <Text style={styles.descricao}>{item.titulo}</Text>
      <Text style={styles.valor}>
        {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
      </Text>
      <Text style={styles.categoria}>Categoria: {item.categoria}</Text>
      <Text style={styles.data}>{item.data}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>

      <View style={styles.filtros}>
        <TouchableOpacity style={styles.botaoFiltro} onPress={() => setFiltro('todos')}>
          <Text style={styles.textoFiltro}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoFiltro} onPress={() => setFiltro('ganho')}>
          <Text style={styles.textoFiltro}>Ganhos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoFiltro} onPress={() => setFiltro('gasto')}>
          <Text style={styles.textoFiltro}>Gastos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtrarTransacoes()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  valor: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
});