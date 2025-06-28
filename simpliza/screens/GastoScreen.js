import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AnimatedInput from '../components/AnimatedInputGasto';
import { adicionarTransacao } from '../firebase/firebaseService';

export default function GastoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    if (titulo && valor) {
      adicionarTransacao('gasto', titulo, valor, 'gasto');
      setTitulo('');
      setValor('');
      alert('Gasto registrado!');
    } else {
      alert('Preencha todos os campos!');
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedInput label="Descrição" value={titulo} onChangeText={setTitulo} />
      <AnimatedInput
  label="Valor"
  value={valor}
  onChangeText={(text) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setValor(numericValue);
  }}
  keyboardType="numeric" 
/>


      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar Ganho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2', alignItems: 'center', paddingTop: 50 },
  botao: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});