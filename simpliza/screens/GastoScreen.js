import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    if (titulo && valor && categoria) {
      adicionarTransacao('gasto', titulo, valor, categoria);
      setTitulo('');
      setValor('');
      setCategoria(null);
      alert('Gasto registrado no Firebase!');
    } else {
      alert('Preencha todos os campos!');
    }
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
  <AnimatedInput label="Valor" value={valor} onChangeText={text => setValor(text.replace(/[^0-9.,]/g, ''))} keyboardType="numeric" />

   

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
  botao: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
