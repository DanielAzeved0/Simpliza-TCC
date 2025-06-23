import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { inserirTransacao } from '../database/DatabaseService';

const handleSalvar = () => {
  inserirTransacao('gasto', titulo, parseFloat(valor), categoria);
  setTitulo('');
  setValor('');
  setCategoria('');
  alert('Gasto registrado!');
};

export default function GastoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSalvar = () => {
    console.log({ tipo: 'gasto', titulo, valor, categoria });
    setTitulo('');
    setValor('');
    setCategoria('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Gasto</Text>

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
        <Text style={styles.textoBotao}>Salvar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  botao: {
    height: 50,
    backgroundColor: '#dc2626',
    borderRadius: 12,
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
