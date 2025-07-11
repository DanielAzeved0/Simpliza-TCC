import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getHistorico } from '../firebase/firebaseService';
import { format, parse } from 'date-fns';

const screenWidth = Dimensions.get("window").width;
const cores = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#a29bfe', '#dfe6e9'];

export default function GraficoScreen() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('mes');

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

  const filtrarDados = () => {
    const agora = new Date();

    return historico.filter(item => {
      if (!item.data) return false;

      const dataItem = parse(item.data, 'dd/MM/yyyy', new Date());

      if (filtro === 'mes') {
        return (
          dataItem.getMonth() === agora.getMonth() &&
          dataItem.getFullYear() === agora.getFullYear()
        );
      }

      if (filtro === 'semana') {
        const umDia = 24 * 60 * 60 * 1000;
        const diffDias = Math.floor((agora - dataItem) / umDia);
        return diffDias <= 7;
      }

      return true;
    });
  };

  const dadosFiltrados = filtrarDados();
  const ganhos = dadosFiltrados.filter(i => i.tipo === 'ganho');
  const gastos = dadosFiltrados.filter(i => i.tipo === 'gasto');
  const soma = arr => arr.reduce((acc, cur) => acc + Number(cur.valor || 0), 0);

  const barChartData = {
    labels: ['Ganhos', 'Gastos'],
    datasets: [
      {
        data: [soma(ganhos), soma(gastos)],
        colors: [
          (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          (opacity = 1) => `rgba(231, 76, 60, ${opacity})`
        ]
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
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  const maioresDespesas = [...gastos].sort((a, b) => Number(b.valor || 0) - Number(a.valor || 0)).slice(0, 5);
  const mesAtual = format(new Date(), 'MMM/yyyy');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Resumo Financeiro ({mesAtual})</Text>

      <View style={styles.filtros}>
        <TouchableOpacity onPress={() => setFiltro('semana')}>
          <Text style={[styles.filtro, filtro === 'semana' && styles.filtroAtivo]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro('mes')}>
          <Text style={[styles.filtro, filtro === 'mes' && styles.filtroAtivo]}>Mês</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : dadosFiltrados.length === 0 ? (
        <Text style={styles.semDados}>Nenhum dado encontrado neste período.</Text>
      ) : (
        <>
          <Text style={styles.subtitulo}>Comparação: Ganho vs Gasto</Text>
          <BarChart
            data={barChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
          />

          <View style={styles.labelBar}>
            <Text style={[styles.legenda, { color: 'rgba(46, 204, 113, 1)' }]}>● Ganhos</Text>
            <Text style={[styles.legenda, { color: 'rgba(231, 76, 60, 1)' }]}>● Gastos</Text>
          </View>

          <Text style={styles.subtitulo}>Despesas por Categoria</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 50]}
            absolute
            style={styles.pie}
          />

          <View style={styles.legendaContainer}>
            {pieData.map((item, index) => (
              <Text key={index} style={[styles.legenda, { color: item.color }]}>
                ● {item.name} (R$ {item.population.toFixed(2)})
              </Text>
            ))}
          </View>

          <Text style={styles.subtitulo}>Top 5 Maiores Despesas</Text>
          {maioresDespesas.map((item, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTexto}>{item.titulo}</Text>
              <Text style={styles.itemValor}>R$ {Number(item.valor || 0).toFixed(2)}</Text>
            </View>
          ))}
        </>
      )}
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filtro: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#555',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filtroAtivo: {
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pie: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendaContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  legenda: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  semDados: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  labelBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 5,
  },
});
