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
    <Text style={styles.categoria}>{item.categoria}</Text> 
    <Text style={styles.descricao}>{item.titulo}</Text> 
    <Text style={styles.valor}>
      {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
    </Text>
    <Text style={styles.data}>{item.data}</Text>
  </View>
);

  return (
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

  }
});
