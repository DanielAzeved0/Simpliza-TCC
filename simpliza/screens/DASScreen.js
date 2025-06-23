import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function DASScreen() {
  const [receita, setReceita] = useState('');
  const [das, setDas] = useState(null);

  const calcularDAS = () => {
    const receitaNum = parseFloat(receita);
    if (!isNaN(receitaNum)) {
      const valorDAS = receitaNum * 0.06; // Exemplo: 6% sobre receita bruta
      setDas(valorDAS.toFixed(2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cálculo do DAS</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua receita do mês"
        keyboardType="numeric"
        value={receita}
        onChangeText={setReceita}
      />

      <TouchableOpacity style={styles.botao} onPress={calcularDAS}>
        <Text style={styles.botaoTexto}>Calcular</Text>
      </TouchableOpacity>

      {das && (
        <Text style={styles.resultado}>Valor aproximado do DAS: R$ {das}</Text>
      )}

      <TouchableOpacity
        onPress={() => Linking.openURL('https://www.gov.br/empresas-e-negocios/pt-br/empreendedor')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Ir para o site de pagamento do DAS</Text>
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
    color: '#065f46',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderColor: '#10b981',
    borderWidth: 1,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    color: '#047857',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#1e40af',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});


