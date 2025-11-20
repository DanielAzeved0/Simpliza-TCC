import React, { useEffect, useMemo, useState, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Pressable, useWindowDimensions, Modal, AccessibilityInfo, findNodeHandle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { getHistorico, logoutUser } from '../dataBase/firebaseService';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../dataBase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from '../components/navBar';
import CustomAlert from '../components/CustomAlert';
import { CORES_GRAFICOS } from '../utils/constants';
const cores = CORES_GRAFICOS;

export default function GraficoScreen({ navigation }) {
  const lastBackPress = useRef(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ 
    type: 'info', 
    title: '', 
    message: '', 
    twoButtons: false,
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });
  // Protege botão voltar Android para sair do app (tela inicial)
  useFocusEffect(
    React.useCallback(() => {
      // BackHandler só funciona em Android/iOS, não na web
      if (Platform.OS === 'web') return;
      
      const backAction = () => {
        const now = Date.now();
        if (lastBackPress.current && now - lastBackPress.current < 2000) {
          BackHandler.exitApp();
          return true;
        }
        lastBackPress.current = now;
        if (Platform.OS === 'android') {
          ToastAndroid.show('Pressione novamente para sair', ToastAndroid.SHORT);
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [])
  );
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [ajudaVisible, setAjudaVisible] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const ajudaFecharRef = useRef(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro(false);
      try {
        // Buscar histórico
        const dados = await getHistorico();
        setHistorico(Array.isArray(dados) ? dados : []);
        
        // Buscar nome do usuário
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNomeUsuario(userData.nome || 'Usuário');
          }
        }
      } catch (e) {
        setHistorico([]);
        setErro(true);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Acessibilidade: foco no botão fechar ao abrir modal de ajuda
  useEffect(() => {
    if (ajudaVisible) {
      setTimeout(() => {
        if (ajudaFecharRef.current) {
          const node = findNodeHandle(ajudaFecharRef.current);
          if (node) AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 400);
    }
  }, [ajudaVisible]);

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
        { 
          data: [sG, sGa],
          colors: [
            (opacity = 1) => '#10b981', // Verde escuro para Ganhos
            (opacity = 1) => '#dc2626'  // Vermelho escuro para Gastos
          ]
        }
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
    },
    formatYLabel: (value) => {
      const num = parseFloat(value);
      return Math.round(num / 150) * 150;
    }
  };

  const chartConfigWithColors = {
    ...chartConfig,
    fillShadowGradientFrom: '#10b981',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#10b981',
    fillShadowGradientToOpacity: 1,
    formatTopLabelValue: (value) => formatBRL(value)
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
    if (screen === 'Graficos') return; // Já estamos na tela de Gráficos
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'DAS') navigation.navigate('DAS');
    else if (screen === 'Configuracoes') navigation.navigate('Configuracoes');
  };

  const handleLogout = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Confirmar Saída',
      message: 'Tem certeza que deseja sair da sua conta?',
      twoButtons: true,
      confirmText: 'Sair',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          setAlertVisible(false);
          const success = await logoutUser();
          if (success) {
            navigation.replace('Inicio');
          } else {
            setAlertConfig({
              type: 'error',
              title: 'Erro',
              message: 'Não foi possível sair. Tente novamente.',
              twoButtons: false
            });
            setAlertVisible(true);
          }
        } catch (err) {
          console.error('Logout error:', err);
          setAlertConfig({
            type: 'error',
            title: 'Erro',
            message: 'Falha ao sair. Tente novamente mais tarde.',
            twoButtons: false
          });
          setAlertVisible(true);
        }
      },
      onCancel: () => {
        setAlertVisible(false);
      },
      customColors: {
        color: '#dc2626',
        bgColor: '#fee2e2',
        iconColor: '#dc2626'
      }
    });
    setAlertVisible(true);
  };



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.headerRow}>
          <Text accessibilityRole="header" style={styles.titleText}>
            Bem-vindo, {nomeUsuario || 'Usuário'}
          </Text>
          <View style={styles.headerButtons}>
            <Pressable
              onPress={() => setAjudaVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir ajuda sobre os gráficos"
              accessibilityHint="Mostra explicações sobre como ler os gráficos"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
              testID="botao-ajuda-graficos"
              style={{ marginRight: 12 }}
            >
              <Ionicons name="help-circle-outline" size={28} color="#065f46" accessibilityLabel="Ícone de ajuda" />
            </Pressable>
            <Pressable
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Fazer logout"
              accessibilityHint="Sair da conta atual"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
              testID="botao-logout"
            >
              <Ionicons name="log-out-outline" size={28} color="#dc2626" accessibilityLabel="Ícone de logout" />
            </Pressable>
          </View>
        </View>

        <Modal
          visible={ajudaVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAjudaVisible(false)}
          accessible
          accessibilityViewIsModal
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setAjudaVisible(false)} />
            <View style={[styles.modalCard, { width: Math.min(width * 0.9, 480) }]} accessibilityLabel="Ajuda sobre os gráficos">
              <Text style={styles.modalTitle} accessibilityRole="header">Sobre os Gráficos</Text>
              <Text style={styles.modalBody}>
                Aqui você visualiza gráficos dos seus ganhos e gastos. Use para acompanhar sua evolução financeira e identificar padrões.
              </Text>
              <Pressable
                ref={ajudaFecharRef}
                style={styles.modalButton}
                onPress={() => setAjudaVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar ajuda"
                accessibilityHint="Fecha o modal de ajuda"
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
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={pieData}
                  width={width - 60}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={'population'}
                  backgroundColor={'transparent'}
                  center={[(width - 60) / 4, 0]}
                  absolute
                  hasLegend={false}
                  style={styles.pieChart}
                  accessible
                  accessibilityLabel="Gráfico de pizza dos maiores gastos do mês"
                  strokeWidth={2}
                  strokeColor="#000"
                />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                {pieData.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 }}>
                    <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 4, borderRadius: 2, borderWidth: 1, borderColor: '#222' }} />
                    <Text style={{ fontSize: 13 }}>{item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}: {formatBRL(item.valor)}</Text>
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
              withCustomBarColorFromData={true}
              flatColor={true}
              accessible
              accessibilityLabel="Gráfico de barras comparando ganhos e gastos"
            />
          </ScrollView>
          {(somaGanhos === 0 && somaGastos === 0) && (
            <Text style={styles.emptyText}>Sem dados de ganhos e gastos para comparar.</Text>
          )}
        </View>

        {/* Gráfico de Linhas */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.subtitulo}>Evolução Mensal</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: (new Date().getMonth() * 50) - (width / 3), y: 0 }}
            style={styles.lineChartScrollView}
          >
            <LineChart
              data={lineChartData}
              width={Math.max(width * 1.5, 70 * lineChartData.labels.length)}
              height={240}
              chartConfig={chartConfig}
              bezier
              style={[styles.chart, { minWidth: width * 1.5 }]}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero
              segments={5}
              accessible
              accessibilityLabel="Gráfico de linhas da evolução mensal de ganhos e gastos"
            />
          </ScrollView>
          {(
            ganhosPorMes.every(v => v === 0) && gastosPorMes.every(v => v === 0)
          ) && (
            <Text style={styles.emptyText}>Sem dados mensais para exibir.</Text>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#10b981', marginRight: 4, borderRadius: 2, borderWidth: 1, borderColor: '#222' }} />
              <Text style={{ fontSize: 13 }}>Ganhos</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#dc2626', marginRight: 4, borderRadius: 2, borderWidth: 1, borderColor: '#222' }} />
              <Text style={{ fontSize: 13 }}>Gastos</Text>
            </View>
          </View>
        </View>

        {erro && (
          <Text style={[styles.emptyText, { color: '#e11d48' }]}>Erro ao carregar dados. Tente novamente mais tarde.</Text>
        )}
        {loading && <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#000" accessibilityLabel="Carregando gráficos" />}
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
        twoButtons={alertConfig.twoButtons}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        customColors={alertConfig.customColors}
      />

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
    fontSize: 26,
    color: '#065f46',
    flex: 1,
    marginRight: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  pieChart: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  lineChartScrollView: {
    flex: 1,
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
