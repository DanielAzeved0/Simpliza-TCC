import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Tema:</Text>
        <Text style={styles.value}>Modo claro (padrão)</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Versão do app:</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Desenvolvido por:</Text>
        <Text style={styles.value}>Grupo Simpliza — TCC 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 30,
    textAlign: 'center',
  },
  item: {
    marginBottom: 20,
    borderBottomColor: '#a7f3d0',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#047857',
  },
  value: {
    fontSize: 16,
    color: '#065f46',
  },
});
export default ConfiguracoesScreen;