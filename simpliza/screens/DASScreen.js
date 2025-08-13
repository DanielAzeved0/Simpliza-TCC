import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getHistorico } from '../dataBase/firebaseService';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function DASScreen() {
  const [tipoEmpresa, setTipoEmpresa] = useState(null);
  const [tipoMEI, setTipoMEI] = useState(null);
  const [faturamento, setFaturamento] = useState(0);
  const [dasValor, setDasValor] = useState(null);
  const [ajudaVisible, setAjudaVisible] = useState(false);

  const opcoesEmpresa = [
    { label: 'Microempreendedor Individual (MEI)', value: 'mei' },
    { label: 'MicroEmpresa (ME)', value: 'me' },
    { label: 'Empresa de Pequeno Porte (EPP)', value: 'epp' },
  ];

  const opcoesMEI = [
    { label: 'Comércio ou Indústria', value: 'comercio' },
    { label: 'Serviço', value: 'servico' },
    { label: 'Comércio + Serviço', value: 'comercio_servico' },
  ];

  useEffect(() => {
    async function carregarFaturamento() {
      const historico = await getHistorico();
      const soma = historico.reduce((total, item) => total + Number(item.valor || 0), 0);
      setFaturamento(soma);
    }
    carregarFaturamento();
  }, []);

  useEffect(() => {
    calcularDAS();
  }, [tipoEmpresa, tipoMEI, faturamento]);

  const calcularDAS = () => {
    if (tipoEmpresa === 'mei') {
      switch (tipoMEI) {
        case 'comercio':
          setDasValor('R$ 71,60');
          break;
        case 'servico':
          setDasValor('R$ 75,60');
          break;
        case 'comercio_servico':
          setDasValor('R$ 76,60');
          break;
        default:
          setDasValor(null);
      }
    } else if (tipoEmpresa === 'me') {
      setDasValor(`Aproximadamente R$ ${(faturamento * 0.06).toFixed(2)}`);
    } else if (tipoEmpresa === 'epp') {
      setDasValor(`Aproximadamente R$ ${(faturamento * 0.08).toFixed(2)}`);
    } else {
      setDasValor(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cálculo do DAS</Text>
        <TouchableOpacity onPress={() => setAjudaVisible(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#065f46" />
        </TouchableOpacity>
      </View>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={opcoesEmpresa}
        labelField="label"
        valueField="value"
        placeholder="Selecione o tipo de empresa"
        value={tipoEmpresa}
        onChange={item => {
          setTipoEmpresa(item.value);
          setTipoMEI(null);
        }}
      />

      {tipoEmpresa === 'mei' && (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          data={opcoesMEI}
          labelField="label"
          valueField="value"
          placeholder="Selecione a categoria do MEI"
          value={tipoMEI}
          onChange={item => setTipoMEI(item.value)}
        />
      )}

      {dasValor && (
        <View style={styles.resultadoBox}>
          <Text style={styles.resultadoTexto}>Valor estimado do DAS: {dasValor}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.linkBotao}
        onPress={() => Linking.openURL('https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/pagamento-de-contribuicao-mensal/como-pagar-o-das')}
      >
        <Text style={styles.linkTexto}>Como pagar o seu DAS</Text>
      </TouchableOpacity>

      {(tipoEmpresa === 'me' || tipoEmpresa === 'epp') && (
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.jusbrasil.com.br/artigos/8-dicas-praticas-de-como-reduzir-imposto-do-simples-nacional/1590355552')}
        >
          <Text style={styles.reduzirTexto}>Como reduzir o imposto do Simples Nacional</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={ajudaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAjudaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>
              Você sabe o que é DAS? O Documento de Arrecadação do Simples Nacional é um guia simplificado de tributos que uma empresa optante pelo Simples Nacional deve pagar.
              Para MEs e EPPs, o valor considera notas fiscais emitidas. Para o MEI, o pagamento é fixo por setor:
              {'\n'}Comércio ou Indústria: R$71,60
              {'\n'}Serviço: R$75,60
              {'\n'}Comércio + Serviço: R$76,60
              {'\n'}Para MEI, o pagamento é mensal, independente do faturamento.
            </Text>
            <TouchableOpacity style={styles.fecharBotao} onPress={() => setAjudaVisible(false)}>
              <Text style={styles.fecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  selectedText: {
    color: '#333',
  },
  resultadoBox: {
    backgroundColor: '#10b981',
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: 'center',
  },
  resultadoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkBotao: {
    marginTop: 20,
    backgroundColor: '#065f46',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reduzirTexto: {
    color: '#065f46',
    marginTop: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: screenWidth - 40,
  },
  modalTexto: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  fecharBotao: {
    alignSelf: 'center',
    backgroundColor: '#065f46',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  fecharTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
