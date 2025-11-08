import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView, Pressable, useWindowDimensions, ActivityIndicator, AccessibilityInfo, findNodeHandle, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedInput from '../components/AnimatedInputGanho.js';
import { adicionarTransacao } from '../dataBase/firebaseService.js';
import CustomAlert from '../components/CustomAlert';

export default function GanhoScreen({ navigation }) {
  // Garante que o botão de voltar do Android só volta para a tela anterior
  useEffect(() => {
    // BackHandler só funciona em Android/iOS, não na web
    if (Platform.OS === 'web') return;
    
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
  const [salvando, setSalvando] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: 'info', title: '', message: '' });
  const valorRef = useRef(null);
  const ajudaFecharRef = useRef(null);
  const ajudaTituloRef = useRef(null);
  const { height } = useWindowDimensions();
  const offsetFactor = height < 700 ? 0.10 : 0.12;
  const formTopOffset = Math.max(16, Math.min(height * offsetFactor, 150));

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

  const sanitizarParaNumero = (str) => {
    // Remove pontos de milhar e troca vírgula por ponto
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  };

  const valorNumerico = sanitizarParaNumero(valor);
  const valorInvalido = !(valor && !isNaN(valorNumerico) && valorNumerico > 0);

  const handleSalvar = async () => {
    if (!titulo || valorInvalido) {
      setAlertConfig({
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha a descrição e um valor válido.'
      });
      setAlertVisible(true);
      return;
    }
    try {
      setSalvando(true);
      await adicionarTransacao({ tipo: 'ganho', titulo, valor: valorNumerico, categoria: 'ganho' });
      setTitulo('');
      setValor('');
      setAlertConfig({
        type: 'success',
        title: 'Pronto!',
        message: 'Ganho registrado com sucesso!'
      });
      setAlertVisible(true);
    } catch (e) {
      console.error('Erro ao salvar ganho:', e);
      setAlertConfig({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar o ganho. Tente novamente.'
      });
      setAlertVisible(true);
    } finally {
      setSalvando(false);
    }
  };

  // Foco automático: ao finalizar título, ir para valor
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.title}>Registrar Ganho</Text>
          <Pressable
            onPress={() => setAjudaVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajuda sobre registro de ganhos"
            accessibilityHint="Mostra explicações sobre como registrar ganhos"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
            testID="botao-ajuda-ganho"
          >
            <Ionicons name="help-circle-outline" size={28} color="#065f46" />
          </Pressable>
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
              ref={ajudaTituloRef}
              style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}
              accessibilityRole="header"
              accessibilityLabel="Sobre o Registro de Ganho"
            >Sobre o Registro de Ganho</Text>
            <Text style={{ marginBottom: 20 }}>
              Aqui você pode registrar entradas de dinheiro, como vendas, serviços ou outros ganhos. Preencha a descrição e o valor recebido para manter seu controle financeiro atualizado.
            </Text>
            <TouchableOpacity
              ref={ajudaFecharRef}
              style={{ alignSelf: 'center', backgroundColor: '#065f46', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 }}
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
          <AnimatedInput
            label="Descrição"
            value={titulo}
            onChangeText={setTitulo}
            returnKeyType="next"
            onSubmitEditing={handleTituloSubmit}
            blurOnSubmit={false}
            accessibilityLabel="Descrição do ganho"
            testID="input-descricao-ganho"
          />

          {/* Campo de valor com cifrão preto */}
          <View style={styles.valorContainer}>
            <Text style={styles.cifrao}>R$</Text>
            <TextInput
              ref={valorRef}
              style={styles.valorInput}
              value={valor}
              onChangeText={text => setValor(formatarValor(text))}
              keyboardType="numeric"
              inputMode="numeric"
              returnKeyType="done"
              placeholder="0,00"
              placeholderTextColor="#888"
              maxLength={10}
              accessibilityLabel="Valor do ganho"
              testID="input-valor-ganho"
              accessible
            />
          </View>
          {valorInvalido && (
            <Text style={styles.errorText}>Digite um valor válido.</Text>
          )}

          <Pressable
            style={[styles.botao, (salvando || valorInvalido || !titulo) && styles.botaoDisabled]}
            onPress={handleSalvar}
            disabled={salvando || valorInvalido || !titulo}
            accessibilityRole="button"
            accessibilityLabel="Salvar ganho"
            accessibilityHint="Registra a entrada de dinheiro informada"
            accessibilityState={{ disabled: !!(salvando || valorInvalido || !titulo), busy: !!salvando }}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="botao-salvar-ganho"
          >
            {salvando ? (
              <ActivityIndicator color="#fff" accessibilityLabel="Salvando ganho" />
            ) : (
              <Text style={styles.botaoTexto}>Salvar Ganho</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f4ea' },
  content: { flexGrow: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 28, color: '#065f46' },
  formContainer: { width: '100%' },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#10b981',
    width: '100%',
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
  errorText: { color: '#e11d48', marginTop: -24, marginBottom: 24 },
  botao: { 
    backgroundColor: '#10b981', 
    height: 50,
    borderRadius: 10, 
    marginTop: 20, 
    width: '90%', 
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 0,
  },
  botaoDisabled: { backgroundColor: '#8bd7be' },
  botaoTexto: { 
    color: '#fff', 
    fontWeight: 'bold'
  },
});

