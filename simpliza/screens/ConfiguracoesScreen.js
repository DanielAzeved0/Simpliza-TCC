import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logoutUser } from '../dataBase/logoutService';
import { useNavigation } from '@react-navigation/native';

export default function ConfiguracoesScreen() {
  const navigation = useNavigation();
  const handleLogout = async () => {
    const ok = await logoutUser();
    if (ok) {
  navigation.replace('Inicio');
    } else {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.card}>
        <View style={styles.itemRow}>
          <Text style={styles.label}>Tema:</Text>
          <Text style={styles.value}>Modo claro (padrão)</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>Versão do app:</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>Desenvolvido por:</Text>
          <Text style={styles.value}>Grupo Simpliza — TCC 2025</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomColor: '#a7f3d0',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#047857',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#065f46',
    textAlign: 'right',
    flexShrink: 1,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 30,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#065f46',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
