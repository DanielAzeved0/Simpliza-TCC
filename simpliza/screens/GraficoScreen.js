import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { getHistorico } from '../dataBase/firebaseService';
import { format, parse } from 'date-fns';

const screenWidth = Dimensions.get("window").width;
const cores = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#a29bfe', '#dfe6e9'];

export default function GraficoScreen() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoGrafico, setTipoGrafico] = useState('pizza'); // pizza, barra, linha

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setHistorico(dados);
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
        setHistorico([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const ganhos = historico.filter(i => i.tipo === 'ganho');
  const gastos = historico.filter(i => i.tipo === 'gasto');
  const soma = arr => arr.reduce((acc, cur) => acc + Number(cur.valor || 0), 0);

  const barChartData = {
    labels: ['Ganhos', 'Gastos'],
    datasets: [
      {
        data: [soma(ganhos), soma(gastos)]
      }
    ]
  };

  const categorias = {};
  gastos.forEach(item => {
    categorias[item.categoria] = (categorias[item.categoria] || 0) + Number(item.valor || 0);
  });

  const pieData = Object.entries(categorias).map(([key, value], index) => ({
    name: key,
    population: value,
    color: cores[index % cores.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }));

  const chartConfig = {
    backgroundColor: '#e6f4ea',
    backgroundGradientFrom: '#e6f4ea',
    backgroundGradientTo: '#e6f4ea',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Dashboard Financeiro</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, tipoGrafico === 'pizza' && styles.switchButtonActive]}
          onPress={() => setTipoGrafico('pizza')}
        >
          <Text style={[styles.switchText, tipoGrafico === 'pizza' && styles.switchTextActive]}>Pizza</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, tipoGrafico === 'barra' && styles.switchButtonActive]}
          onPress={() => setTipoGrafico('barra')}
        >
          <Text style={[styles.switchText, tipoGrafico === 'barra' && styles.switchTextActive]}>Colunas</Text>
        </TouchableOpacity>
  {/* Removido botão de linha */}
      </View>

      {tipoGrafico === 'pizza' && (
        <>
          <Text style={styles.subtitulo}>Maiores Gastos do Mês</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            absolute
            style={styles.chart}
          />
        </>
      )}

      {tipoGrafico === 'barra' && (
        <>
          <Text style={styles.subtitulo}>Ganhos x Gastos</Text>
          <BarChart
            data={barChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            style={styles.chart}
          />
        </>
      )}

  {/* Removido gráfico de linha */}

      {loading && <ActivityIndicator size="large" color="#000" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginBottom: 20,
    borderRadius: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  switchButton: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  switchButtonActive: {
    backgroundColor: '#065f46',
    borderColor: '#065f46',
  },
  switchText: {
    color: '#065f46',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchTextActive: {
    color: '#fff',
  },
});
