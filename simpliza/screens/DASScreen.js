import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal, useWindowDimensions, Pressable, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getHistorico } from '../dataBase/firebaseService';
import { Ionicons } from '@expo/vector-icons';
import NavBar from '../components/navBar';

export default function DASScreen({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const [tipoEmpresa, setTipoEmpresa] = useState(null);
  const [tipoMEI, setTipoMEI] = useState(null);
  const [faturamento, setFaturamento] = useState(0);
  const [dasValor, setDasValor] = useState(null);
  const [ajudaVisible, setAjudaVisible] = useState(false);

  const opcoesEmpresa = [
    { label: 'Microempreendedor Individual (MEI)', value: 'mei' },
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
    } else {
      setDasValor(null);
    }
  }, [tipoEmpresa, tipoMEI]);

  const handleNavBarPress = (screen) => {
    if (screen === 'Inicio') navigation.navigate('Home');
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'Configuracoes') navigation.navigate('Configuracoes');
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.title}>Cálculo do DAS</Text>
          <Pressable
            onPress={() => setAjudaVisible(true)}
            style={{ position: 'absolute', right: 0, top: 0 }}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajuda sobre o DAS"
            accessibilityHint="Mostra explicação sobre o documento DAS e valores"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
            testID="botao-ajuda-das"
          >
            <Ionicons name="help-circle-outline" size={28} color="#065f46" />
          </Pressable>
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
          accessibilityLabel="Tipo de empresa"
          testID="dropdown-tipo-empresa"
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
            accessibilityLabel="Categoria do MEI"
            testID="dropdown-categoria-mei"
            onChange={item => setTipoMEI(item.value)}
          />
        )}

        {dasValor && (
          <View style={styles.resultadoBox}>
            <Text style={styles.resultadoTexto}>Valor estimado do DAS: {dasValor}</Text>
          </View>
        )}

        <Pressable
          style={styles.linkBotao}
          onPress={async () => {
            const url = 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/pagamento-de-contribuicao-mensal/como-pagar-o-das';
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              Linking.openURL(url);
            } else {
              Alert.alert('Atenção', 'Não foi possível abrir o link no dispositivo.');
            }
          }}
          accessibilityRole="link"
          accessibilityLabel="Abrir instruções de como pagar o DAS"
          accessibilityHint="Abre o site oficial do Governo com as instruções"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}
          testID="link-como-pagar-das"
        >
          <Text style={styles.linkTexto}>Como pagar o seu DAS</Text>
        </Pressable>



        <Modal
          visible={ajudaVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAjudaVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setAjudaVisible(false)}>
            <Pressable
              style={[styles.modalContent, { width: Math.min(windowWidth * 0.9, 480) }]}
              accessibilityLabel="Ajuda sobre o DAS"
              onPress={() => {}}
            >
              <Text style={styles.modalTexto}>
                Você sabe o que é DAS? O Documento de Arrecadação do Simples Nacional é um guia simplificado de tributos que uma empresa optante pelo Simples Nacional deve pagar.
                Para MEs e EPPs, o valor considera notas fiscais emitidas. Para o MEI, o pagamento é fixo por setor:
                {'\n'}Comércio ou Indústria: R$71,60
                {'\n'}Serviço: R$75,60
                {'\n'}Comércio + Serviço: R$76,60
                {'\n'}Para MEI, o pagamento é mensal, independente do faturamento.
              </Text>
              <Pressable
                style={styles.fecharBotao}
                onPress={() => setAjudaVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar ajuda"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
                testID="botao-fechar-ajuda"
              >
                <Text style={styles.fecharTexto}>Fechar</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
      <NavBar onPress={handleNavBarPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    // Removido para centralização do título
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
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
    // largura ajustada dinamicamente via useWindowDimensions
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
