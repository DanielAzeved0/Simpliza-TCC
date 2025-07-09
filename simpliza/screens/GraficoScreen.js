import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { listarTransacoes } from '../firebase/firebaseService';

const screenWidth = Dimensions.get('window').width;

export default function GraficoScreen() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const cores = [
    '#10b981', '#dc2626', '#f59e0b', '#6366f1', '#14b8a6',
    '#a855f7', '#f43f5e', '#3b82f6', '#eab308', '#84cc16'
  ];

  const carregarDados = async () => {
    const transacoes = await listarTransacoes();

    const resumoPorCategoria = {};

    transacoes.forEach(transacao => {
      const categoria = transacao.categoria || 'Outros';
      const valor = parseFloat(transacao.valor) || 0;

      if (!resumoPorCategoria[categoria]) {
        resumoPorCategoria[categoria] = 0;
      }

      resumoPorCategoria[categoria] += valor;
    });

    const dadosGrafico = Object.keys(resumoPorCategoria).map((categoria, index) => {
      const valor = resumoPorCategoria[categoria];
      return {
        name: categoria.toUpperCase(),
        value: valor,
        color: cores[index % cores.length],
        legendFontColor: '#333',
        legendFontSize: 14,
      };
    }).filter(item => !isNaN(item.value) && item.value > 0);

    setDados(dadosGrafico);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#065f46" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo por Categoria</Text>
      <PieChart
        data={dados}
        width={screenWidth - 32}
        height={240}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        chartConfig={{
          color: () => `#065f46`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#065f46',
  },
});
