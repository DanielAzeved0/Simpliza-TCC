import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedInput from '../components/AnimatedInputGanho.js';
import { adicionarTransacao } from '../dataBase/firebaseService.js';

export default function GanhoScreen() {
  const [ajudaVisible, setAjudaVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');

  // Função para formatar valor como moeda brasileira
  const formatarValor = (text) => {
    // Remove tudo que não for número
    let v = text.replace(/\D/g, '');
    if (!v) return '';
    // Adiciona zeros à esquerda se necessário
    while (v.length < 3) v = '0' + v;
    // Insere vírgula antes dos dois últimos dígitos
    v = v.replace(/(\d+)(\d{2})$/, '$1,$2');
    // Remove zeros à esquerda desnecessários
    v = v.replace(/^0+(\d)/, '$1');
    return v;
  };

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
    alert('Ganho registrado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginBottom: 10, padding: 40}}>
        <Text style={{ fontWeight: 'bold', fontSize: 28, color: '#065f46' }}>Registrar Ganho</Text>
        <TouchableOpacity onPress={() => setAjudaVisible(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#065f46" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={ajudaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAjudaVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Sobre o Registro de Ganho</Text>
            <Text style={{ marginBottom: 20 }}>
              Aqui você pode registrar entradas de dinheiro, como vendas, serviços ou outros ganhos. Preencha a descrição e o valor recebido para manter seu controle financeiro atualizado.
            </Text>
            <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#065f46', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 }} onPress={() => setAjudaVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AnimatedInput label="Descrição" value={titulo} onChangeText={setTitulo} />

      {/* Campo de valor com cifrão preto */}
      <View style={styles.valorContainer}>
        <Text style={styles.cifrao}>R$</Text>
        <TextInput
          style={styles.valorInput}
          value={valor}
          onChangeText={text => setValor(formatarValor(text))}
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
  container: { flex: 1, backgroundColor: '#e6f4ea', alignItems: 'center', paddingTop: 60 },
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
  botao: { 
    backgroundColor: '#10b981', 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20, 
    width: '90%', 
    alignItems: 'center' 
  },
  botaoTexto: { 
    color: '#fff', 
    fontWeight: 'bold'
  },
});

