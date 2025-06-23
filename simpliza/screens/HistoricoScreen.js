import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const mockTransacoes = [
  { id: '1', tipo: 'ganho', descricao: 'Venda de produto', valor: 250 },
  { id: '2', tipo: 'gasto', descricao: 'Compra de materiais', valor: 90 },
  { id: '3', tipo: 'gasto', descricao: 'Transporte', valor: 35 },
];

export default function HistoricoScreen() {
  const renderItem = ({ item }) => (
    <View style={[styles.item, item.tipo === 'ganho' ? styles.ganho : styles.gasto]}>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text style={styles.valor}>
        {item.tipo === 'ganho' ? '+' : '-'} R$ {item.valor}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList
        data={mockTransacoes}
        keyExtractor={(item) => item.id}
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

