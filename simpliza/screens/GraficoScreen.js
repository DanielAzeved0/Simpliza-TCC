import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Pressable, useWindowDimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { getHistorico } from '../dataBase/firebaseService';
import NavBar from '../components/navBar';
const cores = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#a29bfe', '#dfe6e9'];

export default function GraficoScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ajudaVisible, setAjudaVisible] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const dados = await getHistorico();
        setHistorico(Array.isArray(dados) ? dados : []);
      } catch (e) {
        setHistorico([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const parseValor = (v) => {
    if (typeof v === 'string') v = v.replace(',', '.');
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  const formatBRL = (n) => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;

  const { ganhos, gastos, somaGanhos, somaGastos, barChartData, pieData, ganhosPorMes, gastosPorMes } = useMemo(() => {
    const g = historico.filter(i => i.tipo === 'ganho');
    const ga = historico.filter(i => i.tipo === 'gasto');
    const somaArr = (arr) => arr.reduce((acc, cur) => acc + parseValor(cur.valor), 0);
    const sG = somaArr(g);
    const sGa = somaArr(ga);

    const categorias = {};
    ga.forEach(item => {
      const key = item.categoria;
      categorias[key] = (categorias[key] || 0) + parseValor(item.valor);
    });
    const pData = Object.entries(categorias).map(([key, value], index) => ({
      name: key === 'mercado' ? 'comida' : key,
      population: value,
      color: cores[index % cores.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
      categoria: key === 'mercado' ? 'comida' : key,
      valor: value
    }));

    const gm = Array(12).fill(0);
    const gtm = Array(12).fill(0);
    historico.forEach(item => {
      const data = item.data ? new Date(item.data) : null;
      if (data && data.getMonth) {
        const mes = data.getMonth();
        if (item.tipo === 'ganho') gm[mes] += parseValor(item.valor);
        if (item.tipo === 'gasto') gtm[mes] += parseValor(item.valor);
      }
    });

    const bData = {
      labels: ['Ganhos', 'Gastos'],
      datasets: [
        { data: [sG, sGa] }
      ]
    };

    return { ganhos: g, gastos: ga, somaGanhos: sG, somaGastos: sGa, barChartData: bData, pieData: pData, ganhosPorMes: gm, gastosPorMes: gtm };
  }, [historico]);

  const chartConfig = {
    backgroundColor: '#e6f4ea',
    backgroundGradientFrom: '#e6f4ea',
    backgroundGradientTo: '#e6f4ea',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
    }
  };

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const lineChartData = useMemo(() => ({
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
  }), [ganhosPorMes, gastosPorMes]);

  const handleNavBarPress = (screen) => {
    if (screen === 'Inicio') navigation.navigate('Home');
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'DAS') navigation.navigate('DAS');
  };



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.headerRow}>
          <Text accessibilityRole="header" style={styles.titleText}>Gráficos</Text>
          <Pressable
            onPress={() => setAjudaVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajuda sobre os gráficos"
            accessibilityHint="Mostra explicações sobre como ler os gráficos"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
            testID="botao-ajuda-graficos"
          >
            <Ionicons name="help-circle-outline" size={28} color="#065f46" />
          </Pressable>
        </View>

        <Modal
          visible={ajudaVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAjudaVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setAjudaVisible(false)} />
            <View style={[styles.modalCard, { width: Math.min(width * 0.9, 480) }]} accessibilityLabel="Ajuda sobre os gráficos">
              <Text style={styles.modalTitle}>Sobre os Gráficos</Text>
              <Text style={styles.modalBody}>
                Aqui você visualiza gráficos dos seus ganhos e gastos. Use para acompanhar sua evolução financeira e identificar padrões.
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setAjudaVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar ajuda"
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Gráfico de Pizza */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Maiores Gastos do Mês</Text>
          {pieData.length > 0 ? (
            <>
              <PieChart
                data={pieData}
                width={width - 40}
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
                    <Text style={{ fontSize: 13 }}>{item.categoria}: {formatBRL(item.valor)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Sem dados de gastos por categoria.</Text>
          )}
        </View>

        {/* Gráfico de Barras */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Ganhos x Gastos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barChartData}
              width={Math.max(width, 80 * barChartData.labels.length)}
              height={240}
              chartConfig={{
                ...chartConfig,
                formatTopLabelValue: (value) => formatBRL(value)
              }}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              style={[styles.chart, { minWidth: width - 40 }]}
              fromZero
              segments={5}
            />
          </ScrollView>
          {(somaGanhos === 0 && somaGastos === 0) && (
            <Text style={styles.emptyText}>Sem dados de ganhos e gastos para comparar.</Text>
          )}
        </View>

        {/* Gráfico de Linhas */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Evolução Mensal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineChartData}
              width={Math.max(width, 60 * lineChartData.labels.length)}
              height={240}
              chartConfig={chartConfig}
              bezier
              style={[styles.chart, { minWidth: width - 40 }]}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero
              segments={5}
            />
          </ScrollView>
          {(
            ganhosPorMes.every(v => v === 0) && gastosPorMes.every(v => v === 0)
          ) && (
            <Text style={styles.emptyText}>Sem dados mensais para exibir.</Text>
          )}
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

        {loading && <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#000" />}
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
  content: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingTop: 60,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#065f46',
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
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  modalBody: { marginBottom: 20 },
  modalButton: { alignSelf: 'center', backgroundColor: '#065f46', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
