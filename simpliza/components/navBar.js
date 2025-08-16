
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const NavBar = ({ onPress }) => {
  return (
    <View style={styles.container}>
      {/* Início */}
      <TouchableOpacity style={styles.iconButton} onPress={() => onPress && onPress('Inicio')}>
        <Ionicons name="home-outline" size={32} color="#065f46" />
        <Text style={styles.label}>Início</Text>
      </TouchableOpacity>

      {/* Histórico */}
      <TouchableOpacity style={styles.iconButton} onPress={() => onPress && onPress('Historico')}>
        <MaterialCommunityIcons name="file-document-edit-outline" size={30} color="#065f46" />
        <Text style={styles.label}>Histórico</Text>
      </TouchableOpacity>

      {/* Botão central: Novo Registro */}
      <TouchableOpacity style={styles.centralButton} onPress={() => onPress && onPress('NovoRegistro')}>
        <Ionicons name="add-circle-outline" size={60} color="#065f46" />
      </TouchableOpacity>

      {/* Gráficos */}
      <TouchableOpacity style={styles.iconButton} onPress={() => onPress && onPress('Graficos')}>
        <Ionicons name="stats-chart-outline" size={28} color="#065f46" />
        <Text style={styles.label}>Gráficos</Text>
      </TouchableOpacity>

      {/* Configurações */}
      <TouchableOpacity style={styles.iconButton} onPress={() => onPress && onPress('Configuracoes')}>
        <Ionicons name="settings-outline" size={28} color="#065f46" />
        <Text style={styles.label}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderColor: '#d1fae5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  marginBottom: 38, // Sobe ainda mais a barra
  },
  iconButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  centralButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    top: -18,
    backgroundColor: '#fff',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  label: {
    fontSize: 12,
    color: '#065f46',
    marginTop: 2,
    fontWeight: 'bold',
  },
});

export default NavBar;
