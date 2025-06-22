import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function NovoRegistroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Registro</Text>

      <TouchableOpacity
        style={styles.ganhoBtn}
        onPress={() => navigation.navigate('Ganho')}
      >
        <Text style={styles.ganhoText}>+ Registrar Ganho</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gastoBtn}
        onPress={() => navigation.navigate('Gasto')}
      >
        <Text style={styles.gastoText}>- Registrar Gasto</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 40,
  },
  ganhoBtn: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    borderWidth: 2,
    padding: 16,
    width: '90%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  gastoBtn: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 2,
    padding: 16,
    width: '90%',
    borderRadius: 12,
    alignItems: 'center',
  },
  ganhoText: {
    color: '#065f46',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gastoText: {
    color: '#991b1b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default NovoRegistroScreen; 