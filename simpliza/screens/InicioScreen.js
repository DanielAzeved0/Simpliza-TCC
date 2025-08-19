import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InicioScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao Simpliza!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CriarConta')}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>
  <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f4ea' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#2f4f4f' },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, width: '80%', alignItems: 'center', marginBottom: 15 },
  buttonText: { color: 'white', fontSize: 18 },
  secondaryButton: { padding: 15, borderRadius: 12, width: '80%', alignItems: 'center' },
  secondaryButtonText: { color: '#4CAF50', fontSize: 16 }
});
