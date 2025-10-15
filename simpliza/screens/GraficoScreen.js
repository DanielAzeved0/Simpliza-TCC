import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { getHistorico } from '../dataBase/firebaseService';
import NavBar from '../components/navBar';

const screenWidth = Dimensions.get('window').width;
const cores = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#a29bfe', '#dfe6e9'];

export default function GraficoScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ajudaVisible, setAjudaVisible] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setHistorico(dados);
      } catch (e) {
        setHistorico([]);
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
    name: key === 'mercado' ? 'Comida' : key,
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
    else if (screen === 'DAS') navigation.navigate('DAS');
  };



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 28, color: '#065f46', paddingTop: 60 }}>Gráficos</Text>
          <TouchableOpacity onPress={() => setAjudaVisible(true)}>
            <Ionicons name="help-circle-outline" size={28} color="#065f46" paddingTop="65"/>
          </TouchableOpacity>
        </View>

        <Modal
          visible={ajudaVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAjudaVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Sobre os Gráficos</Text>
              <Text style={{ marginBottom: 20 }}>
                Aqui você visualiza gráficos dos seus ganhos e gastos. Use para acompanhar sua evolução financeira e identificar padrões.
              </Text>
              <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#065f46', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 }} onPress={() => setAjudaVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'center',
    alignSelf: 'center',
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
