import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIVACY_TEXT = `PRIVACY POLICY - Simpliza

Última atualização: 11/10/2025

Esta Política de Privacidade descreve como o aplicativo Simpliza coleta, usa, armazena e compartilha seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) do Brasil.

1. Controlador
O Simpliza (Grupo Simpliza — TCC 2025) é o controlador dos dados coletados pelo aplicativo. Para questões sobre privacidade, entre em contato: suporte@simpliza.com

2. Dados coletados
- Dados de autenticação: e-mail, uid.
- Dados de perfil: nome, e-mail (se fornecido pelo usuário ou provedores de login).
- Dados de uso/funcionais: registro de transações financeiras cadastradas pelo usuário (categoria, valor, data, descrição).

3. Finalidades
- Autenticação e manutenção de conta.
- Armazenamento e recuperação de registros do usuário.
- Estatísticas internas (opcional, e somente se houver consentimento explícito do usuário).

4. Base legal
- Execução de contrato e consentimento do titular quando aplicável.

5. Compartilhamento
- Não compartilhamos dados com terceiros para fins comerciais sem consentimento explícito. Podemos usar serviços terceiros (Firebase) para armazenamento e autenticação; consulte a documentação desses serviços para detalhes.

6. Retenção e exclusão
- Os dados do usuário permanecem enquanto a conta existir. O usuário pode solicitar a exclusão completa dos seus dados pelo aplicativo (Configurações → Solicitar exclusão de dados). Excluiremos os dados dentro de um prazo razoável e informaremos o solicitante.

7. Direitos do titular
- Acesso, correção, portabilidade, eliminação, revogação de consentimento e informação sobre compartilhamento — disponível via Configurações do aplicativo ou contato por e-mail.

8. Segurança
- Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados. Tokens e credenciais sensíveis devem ser armazenados em locais seguros; recomenda-se uso de armazenamento seguro (EncryptedStorage) em produção.

9. Alterações
- Podemos atualizar esta política; mudanças serão comunicadas no app quando necessárias.

10. Contato
suporte@simpliza.com`;

export default function PrivacyScreen() {
  const navigation = useNavigation();

  const accept = async () => {
    await AsyncStorage.setItem('consentimentoLGPD', 'true');
    navigation.goBack();
  };

  const decline = async () => {
    await AsyncStorage.setItem('consentimentoLGPD', 'false');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Política de Privacidade</Text>
        <Text style={styles.text}>{PRIVACY_TEXT}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonDecline} onPress={decline}>
            <Text style={styles.buttonDeclineText}>Recusar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonAccept} onPress={accept}>
            <Text style={styles.buttonAcceptText}>Aceitar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f4ea' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#065f46', marginBottom: 12 },
  text: { fontSize: 14, color: '#333' },
  actions: { flexDirection: 'row', marginTop: 20 },
  buttonDecline: { backgroundColor: '#eee', padding: 12, borderRadius: 10, flex: 1, marginRight: 8, alignItems: 'center' },
  buttonAccept: { backgroundColor: '#065f46', padding: 12, borderRadius: 10, flex: 1, marginLeft: 8, alignItems: 'center' },
  buttonDeclineText: { color: '#333', fontWeight: 'bold' },
  buttonAcceptText: { color: '#fff', fontWeight: 'bold' }
});
