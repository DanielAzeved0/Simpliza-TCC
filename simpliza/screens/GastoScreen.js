import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AnimatedInput from '../components/AnimatedInputGasto';
import { adicionarTransacao } from '../dataBase/firebaseService';

export default function GastoScreen() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(null);

  const categorias = [
    { label: 'Mercado', value: 'mercado' },
    { label: 'Luz', value: 'luz' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Outros', value: 'outros' },
  ];

  const handleSalvar = () => {
    if (!titulo || !valor || !categoria) {
      alert('Preencha todos os campos!');
      return;
    }
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Digite um valor válido!');
      return;
    }
    adicionarTransacao({ tipo: 'gasto', titulo, valor: valorNumerico, categoria: "gasto" });
    setTitulo('');
    setValor('');
    setCategoria(null);
    alert('Gasto registrado no Firebase!');
  };

  return (
    <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={categorias}
          labelField="label"
          valueField="value"
          placeholder="Categorias"
          value={categoria}
          onChange={item => setCategoria(item.value)}    
        />

      <AnimatedInput label="Descrição" value={titulo} onChangeText={setTitulo} />

      {/* Campo de valor com cifrão fixo */}
      <View style={styles.valorContainer}>
        <Text style={styles.cifrao}>R$</Text>
        <TextInput
          style={styles.valorInput}
          value={valor}
          onChangeText={text => setValor(text.replace(/[^0-9,]/g, ''))}
          keyboardType="numeric"
          placeholder="0,00"
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2', alignItems: 'center', paddingTop: 50 },
  dropdown: {
    width: '90%',
    height: 50,
    borderColor: 'rgba(223, 77, 77, 0.7)',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 35,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(223, 77, 77, 0.7)',
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
  botao: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
