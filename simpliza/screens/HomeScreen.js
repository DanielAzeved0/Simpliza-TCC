import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Botão de Configurações no canto superior direito */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Configuracoes')}
      >
        <Ionicons name="settings-outline" size={28} color="#065f46" />
      </TouchableOpacity>

      <Text style={styles.title}>SIMPLIZA</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Historico')}
        >
          <Feather name="clock" size={32} color="#065f46" />
          <Text style={styles.cardText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Grafico')}
        >
          <FontAwesome5 name="chart-bar" size={32} color="#065f46" />
          <Text style={styles.cardText}>Gráficos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DAS')}
        >
          <MaterialCommunityIcons name="calculator-variant" size={32} color="#065f46" />
          <Text style={styles.cardText}>Cálculo do DAS</Text>
        </TouchableOpacity>
      </View>

      {/* Novo Registro como botão grande */}
      <TouchableOpacity
        style={styles.cardFull}
        onPress={() => navigation.navigate('NovoRegistro')}
      >
        <AntDesign name="pluscircleo" size={32} color="#065f46" />
        <Text style={styles.cardText}>Novo Registro</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'center',
    marginBottom: 40,
  },
  grid: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardFull: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#065f46',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
