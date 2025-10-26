import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Modal, useWindowDimensions, Alert, ActivityIndicator, AccessibilityInfo, findNodeHandle, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import AnimatedInput from '../components/AnimatedInputGasto';
import { adicionarTransacao } from '../dataBase/firebaseService';

export default function GastoScreen({ navigation }) {
  // Garante que o botão de voltar do Android só volta para a tela anterior
  useEffect(() => {
    const backAction = () => {
      if (navigation && navigation.goBack) {
        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  const [ajudaVisible, setAjudaVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const valorRef = useRef(null);
  const ajudaFecharRef = useRef(null);
  const { height } = useWindowDimensions();
  const offsetFactor = height < 700 ? 0.10 : 0.12;
  const formTopOffset = Math.max(16, Math.min(height * offsetFactor, 150));

  // Função para formatar valor como moeda brasileira
  const formatarValor = (text) => {
    let v = text.replace(/\D/g, '');
    if (!v) return '';
    while (v.length < 3) v = '0' + v;
    v = v.replace(/(\d+)(\d{2})$/, '$1,$2');
    v = v.replace(/^0+(\d)/, '$1');
    return v;
  };

  const categorias = [
    { label: 'Comida', value: 'mercado' },
    { label: 'Luz', value: 'luz' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Outros', value: 'outros' },
  ];

  // Deriva valor numérico e estado de invalidez para feedback inline
  const valorNumerico = parseFloat((valor || '').replace(/\./g, '').replace(',', '.'));
  const valorInvalido = !(valor && !isNaN(valorNumerico) && valorNumerico > 0);

  const handleSalvar = async () => {
    if (!valor || !categoria || (categoria === 'outros' && !titulo)) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Digite um valor válido!');
      return;
    }
    try {
      setSalvando(true);
      const tituloFinal = categoria === 'outros' ? titulo : categorias.find(c => c.value === categoria)?.label || '';
      await adicionarTransacao({ tipo: 'gasto', titulo: tituloFinal, valor: valorNumerico, categoria });
      setTitulo('');
      setValor('');
      setCategoria(null);
      Alert.alert('Pronto', 'Gasto registrado com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o gasto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Foco automático: ao finalizar descrição, ir para valor
  const handleTituloSubmit = () => {
    if (valorRef.current) {
      valorRef.current.focus();
    }
  };

  // Acessibilidade: foco no botão fechar ao abrir modal de ajuda
  React.useEffect(() => {
    if (ajudaVisible) {
      setTimeout(() => {
        if (ajudaFecharRef.current) {
          const node = findNodeHandle(ajudaFecharRef.current);
          if (node) AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 400);
    }
  }, [ajudaVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle} accessibilityRole="header">Registrar Gasto</Text>
        <TouchableOpacity
          onPress={() => setAjudaVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir ajuda sobre registro de gastos"
          accessibilityHint="Mostra explicações sobre como registrar gastos"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID="botao-ajuda-gasto"
        >
          <Ionicons name="help-circle-outline" size={28} color="#dc2626" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={ajudaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAjudaVisible(false)}
        accessible
        accessibilityViewIsModal
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}
              accessibilityRole="header"
              accessibilityLabel="Sobre o Registro de Gasto"
            >Sobre o Registro de Gasto</Text>
            <Text style={{ marginBottom: 20 }}>
              Aqui você pode registrar despesas, como contas, compras ou outros gastos. Preencha a categoria, descrição (se necessário) e valor para manter seu controle financeiro atualizado.
            </Text>
            <TouchableOpacity
              ref={ajudaFecharRef}
              style={{ alignSelf: 'center', backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 }}
              onPress={() => setAjudaVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Fechar ajuda"
              accessibilityHint="Fecha o modal de ajuda"
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.formContainer, { marginTop: formTopOffset }]}> 
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
          accessibilityLabel="Categoria do gasto"
          testID="dropdown-categoria-gasto"
        />

        {/* Campo de descrição só aparece se categoria for 'outros' */}
        {categoria === 'outros' && (
          <AnimatedInput
            label="Descrição"
            value={titulo}
            onChangeText={setTitulo}
            returnKeyType="next"
            onSubmitEditing={handleTituloSubmit}
            blurOnSubmit={false}
            accessibilityLabel="Descrição do gasto"
            testID="input-descricao-gasto"
          />
        )}

        {/* Campo de valor com cifrão fixo */}
        <View style={styles.valorContainer}>
          <Text style={styles.cifrao}>R$</Text>
          <TextInput
            ref={valorRef}
            style={styles.valorInput}
            value={valor}
            onChangeText={text => setValor(formatarValor(text))}
            keyboardType="numeric"
            placeholder="0,00"
            maxLength={10}
            accessibilityLabel="Valor do gasto"
            testID="input-valor-gasto"
            accessible
          />
        </View>
        {valorInvalido && (
          <Text style={styles.errorText}>Digite um valor válido.</Text>
        )}

        <TouchableOpacity
          style={[styles.botao, (salvando || valorInvalido || !categoria || (categoria === 'outros' && !titulo)) && styles.botaoDisabled]}
          onPress={handleSalvar}
          disabled={salvando || valorInvalido || !categoria || (categoria === 'outros' && !titulo)}
          accessibilityRole="button"
          accessibilityLabel="Salvar gasto"
          accessibilityHint="Registra a despesa informada"
          accessibilityState={{ disabled: !!(salvando || valorInvalido || !categoria || (categoria === 'outros' && !titulo)), busy: !!salvando }}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID="botao-salvar-gasto"
        >
          {salvando ? (
            <ActivityIndicator color="#fff" accessibilityLabel="Salvando gasto" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar Gasto</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef2f2', alignItems: 'center', paddingTop: 50 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#dc2626',
    alignSelf: 'flex-start',
  },
  formContainer: { width: '100%', alignItems: 'center' },
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
  errorText: {
    color: '#e11d48',
    marginTop: -24,
    marginBottom: 24,
    width: '90%',
    alignSelf: 'center',
    textAlign: 'left',
  },
  botao: { backgroundColor: '#ef4444', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoDisabled: { backgroundColor: '#fca5a5' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
