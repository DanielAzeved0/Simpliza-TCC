import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { getHistorico } from '../dataBase/firebaseService';
import NavBar from '../components/navBar';

const screenWidth = Dimensions.get('window').width;
const cores = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#a29bfe', '#dfe6e9'];

export default function GraficoScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setHistorico(dados);
      } catch (e) {
        setHistorico([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const ganhos = historico.filter(i => i.tipo === 'ganho');
  const gastos = historico.filter(i => i.tipo === 'gasto');
  const parseValor = v => {
    if (typeof v === 'string') v = v.replace(',', '.');
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };
  const soma = arr => arr.reduce((acc, cur) => acc + parseValor(cur.valor), 0);

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
    categorias[item.categoria] = (categorias[item.categoria] || 0) + parseValor(item.valor);
  });

  const pieData = Object.entries(categorias).map(([key, value], index) => ({
    name: key,
    population: value,
    color: cores[index % cores.length],
    legendFontColor: '#7F7F7F',
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

  // Dados para o gráfico de linhas
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const ganhosPorMes = Array(12).fill(0);
  const gastosPorMes = Array(12).fill(0);
  historico.forEach(item => {
    const data = item.data ? new Date(item.data) : null;
    if (data && data.getMonth) {
      const mes = data.getMonth();
      if (item.tipo === 'ganho') ganhosPorMes[mes] += parseValor(item.valor);
      if (item.tipo === 'gasto') gastosPorMes[mes] += parseValor(item.valor);
    }
  });
  const lineChartData = {
    labels: meses,
    datasets: [
      {
        data: ganhosPorMes,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: gastosPorMes,
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Ganhos', 'Gastos'],
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
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Dashboard Financeiro</Text>

        {/* Gráfico de Pizza */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Maiores Gastos do Mês</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={240}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            absolute
            style={styles.chart}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {pieData.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 }}>
                <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 4, borderRadius: 2 }} />
                <Text style={{ fontSize: 13 }}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gráfico de Barras */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Ganhos x Gastos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barChartData}
              width={Math.max(screenWidth, 80 * barChartData.labels.length)}
              height={240}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              style={[styles.chart, { minWidth: screenWidth - 40 }]}
              fromZero
              segments={5}
            />
          </ScrollView>
        </View>

        {/* Gráfico de Linhas */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Evolução Mensal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineChartData}
              width={Math.max(screenWidth, 60 * lineChartData.labels.length)}
              height={240}
              chartConfig={chartConfig}
              bezier
              style={[styles.chart, { minWidth: screenWidth - 40 }]}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero
              segments={5}
            />
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#10b981', marginRight: 4, borderRadius: 2 }} />
              <Text style={{ fontSize: 13 }}>Ganhos</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#dc2626', marginRight: 4, borderRadius: 2 }} />
              <Text style={{ fontSize: 13 }}>Gastos</Text>
            </View>
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#000" />}
      </ScrollView>
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
});
