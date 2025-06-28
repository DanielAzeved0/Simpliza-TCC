import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AnimatedInput from '../components/AnimatedInputGanho.js';
import { adicionarTransacao } from '../firebase/firebaseService.js';

export default function GanhoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    if (titulo && valor) {
      adicionarTransacao('ganho', titulo, valor, 'ganho');
      setTitulo('');
      setValor('');
      alert('Ganho registrado no Firebase!');
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
  container: { flex: 1, backgroundColor: '#e6f4ea', alignItems: 'center', paddingTop: 50 },
  botao: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});

