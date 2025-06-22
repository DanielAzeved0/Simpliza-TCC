import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraficoScreen() {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [
      {
        data: [3000, 2500, 2700, 2900, 3200],
        color: () => '#10b981',
        strokeWidth: 2,
      },
      {
        data: [1200, 1700, 1600, 1800, 1500],
        color: () => '#ef4444',
        strokeWidth: 2,
      },
    ],
    legend: ['Ganhos', 'Gastos'],
  };

  const config = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(6, 95, 70, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#065f46',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico Financeiro</Text>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={250}
        chartConfig={config}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#065f46',
  },
});
