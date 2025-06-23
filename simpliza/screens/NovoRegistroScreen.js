import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function NovoRegistroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Registro</Text>

      <TouchableOpacity
        style={[styles.option, styles.ganho]}
        onPress={() => navigation.navigate('Ganho')}
      >
        <AntDesign name="arrowup" size={24} color="#065f46" />
        <Text style={styles.optionText}>Ganho</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, styles.gasto]}
        onPress={() => navigation.navigate('Gasto')}
      >
        <AntDesign name="arrowdown" size={24} color="#ffffff" />
        <Text style={[styles.optionText, { color: '#ffffff' }]}>Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
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
  option: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  ganho: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#065f46',
  },
  gasto: {
    backgroundColor: '#065f46',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
  },
});

