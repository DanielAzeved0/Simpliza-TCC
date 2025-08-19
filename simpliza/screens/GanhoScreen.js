import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import AnimatedInput from '../components/AnimatedInputGanho.js';
import { adicionarTransacao } from '../dataBase/firebaseService.js';

export default function GanhoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    if (!titulo || !valor) {
      alert('Preencha todos os campos!');
      return;
    }
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Digite um valor válido!');
      return;
    }
    adicionarTransacao({ tipo: 'ganho', titulo, valor: valorNumerico, categoria: 'ganho' });
    setTitulo('');
    setValor('');
    alert('Ganho registrado no Firebase!');
  };

  return (
    <View style={styles.container}>

      <AnimatedInput label="Descrição" value={titulo} onChangeText={setTitulo} />

      {/* Campo de valor com cifrão preto */}
      <View style={styles.valorContainer}>
        <Text style={styles.cifrao}>R$</Text>
        <TextInput
          style={styles.valorInput}
          value={valor}
          onChangeText={text => setValor(text.replace(/[^0-9,]/g, ''))}
          keyboardType="numeric"
          placeholder="0,00"
          placeholderTextColor="#888"
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar Ganho</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f4ea', alignItems: 'center', paddingTop: 50 },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.7)',
    width: '90%',
    height: 50,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  cifrao: {
    fontSize: 16,
    color: '#444',
    marginRight: 8,
    fontWeight: 'bold',
  },
  valorInput: {
    flex: 1,
    fontSize: 16, 
    color: '#222',
    fontWeight: 'bold',
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
  },
  botao: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});

