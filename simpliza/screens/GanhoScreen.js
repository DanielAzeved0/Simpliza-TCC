import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function GanhoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSalvar = () => {
    console.log({
      tipo: 'ganho',
      titulo,
      valor,
      categoria
    });
    setTitulo('');
    setValor('');
    setCategoria('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Ganho</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Ganho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#10b981',
    borderWidth: 1,
  },
  botao: {
    height: 50,
    backgroundColor: '#10b981',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
