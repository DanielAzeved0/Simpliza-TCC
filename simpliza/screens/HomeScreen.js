import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIMPLIZA</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NovoRegistro')}
      >
        <Text style={styles.buttonText}>Novo Registro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Historico')}
      >
        <Text style={styles.buttonText}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Grafico')}
      >
        <Text style={styles.buttonText}>Gráficos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Inteligencia')}
      >
        <Text style={styles.buttonText}>IA Financeira</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DAS')}
      >
        <Text style={styles.buttonText}>Cálculo do DAS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Configuracoes')}
      >
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 40,
  },
  button: {
    width: '90%',
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
