import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function InteligenciaScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>IA Financeira</Text>

      <View style={styles.box}>
        <Text style={styles.label}>📈 Análise:</Text>
        <Text style={styles.text}>
          Seu lucro líquido em Maio foi de R$ 1.200,00, com uma média de 15% de
          aumento em relação ao mês anterior.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>💡 Dica da IA:</Text>
        <Text style={styles.text}>
          Considere diminuir seus gastos fixos com transporte e renegociar valores com fornecedores.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f4ea',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftColor: '#10b981',
    borderLeftWidth: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#047857',
  },
  text: {
    fontSize: 16,
    color: '#064e3b',
  },
});
