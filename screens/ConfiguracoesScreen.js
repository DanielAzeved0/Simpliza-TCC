// ...existing code...
import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import das funções do serviço Firebase (logout, exportação, exclusão)
// Mantê-las centralizadas em um arquivo evita duplicação e facilita testes.
import { exportUserData, deleteUserDataAndAccount } from '../dataBase/firebaseService';
import NavBar from '../components/navBar';
import { showLogoutConfirmation } from '../components/logoutHelper';

/**
 * ConfiguracoesScreen
 * Tela de configurações do app Simpliza.
 *
 * Boas práticas aplicadas:
 * - Uso de SafeAreaView para respeitar áreas do dispositivo (notch / status bar)
 * - Separação de constantes (cores, FAQ) no topo para facilitar manutenção e internacionalização
 * - Handlers com useCallback para evitar recriações desnecessárias
 * - Tratamento de erros com try/catch e feedback via Alert
 * - Estados de loading individuais para bloquear ações enquanto operações assíncronas ocorrem
 * - Pressable com accessibilityRole/testID para melhorar acessibilidade e permitir testes automatizados
 * - FAQ como array + map para facilitar manutenção do conteúdo
 */

/* ---------- Constantes reutilizáveis (cores, textos, dados estáticos) ---------- */
const COLORS = {
  background: '#e6f4ea',
  primary: '#065f46',
  accent: '#047857',
  card: '#ecfdf5',
  danger: '#e11d48',
  info: '#0284C7',
};

const APP_INFO = {
  version: '1.0.0',
  author: 'Grupo Simpliza — TCC 2025',
};

/* FAQs como array para fácil adição/remoção/edição */
const FAQS = [
  {
    q: 'Como redefinir minha senha?',
    a: 'Acesse a tela de login e clique em "Esqueci minha senha" para receber instruções no seu e-mail.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim, utilizamos autenticação segura e seus dados são protegidos por criptografia.',
  },
  {
    q: 'Como entrar em contato com o suporte?',
    a: 'Envie um e-mail para suporte@simpliza.com ou utilize o formulário de contato no app.',
  },
  {
    q: 'Posso usar o app em mais de um dispositivo?',
    a: 'Sim, basta acessar sua conta em qualquer dispositivo usando seu e-mail e senha cadastrados.',
  },
  {
    q: 'Como editar ou excluir um registro?',
    a: 'Acesse a tela de histórico, selecione o registro desejado e utilize as opções de editar ou excluir.',
  },
  {
    q: 'O app funciona offline?',
    a: 'Algumas funcionalidades básicas funcionam offline, mas para salvar ou sincronizar dados é necessário estar conectado à internet.',
  },
  {
    q: 'Como alterar meu e-mail cadastrado?',
    a: 'Entre em contato com o suporte para solicitar a alteração do e-mail vinculado à sua conta.',
  },
  {
    q: 'O app é gratuito?',
    a: 'Sim, o Simpliza é totalmente gratuito para todos os usuários.',
  },
];

/* ---------- Componente principal da tela de Configurações ---------- */
export default function ConfiguracoesScreen() {
  const navigation = useNavigation();
  // Protege botão voltar Android para voltar para tela anterior
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

  // Estados de loading separados para cada operação assíncrona.
  // Isso permite exibir indicadores individuais e evitar ações concorrentes.
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /**
   * handleLogout
   * Exibe confirmação e faz logout do usuário usando o helper reutilizável.
   * Usa navigation.replace para limpar histórico de navegação após logout.
   */
  const handleLogout = useCallback(() => {
    showLogoutConfirmation(
      navigation,
      () => setLoadingLogout(false), // onSuccess
      () => setLoadingLogout(false)  // onError
    );
  }, [navigation]);

  /**
   * handleExport
   * Gera/obtém dados do usuário para exportação.
   * Exibe feedback e navega para uma tela de privacidade/termos se necessário.
   */
  const handleExport = useCallback(async () => {
    try {
      setLoadingExport(true);
      const data = await exportUserData(); // função do serviço que retorna dados do usuário
      if (!data) {
        Alert.alert('Erro', 'Não foi possível exportar seus dados.');
        return;
      }
      // Em produção: oferecer compartilhamento (Share API) ou download
      if (__DEV__) {
        console.log('Exported user data:', JSON.stringify(data, null, 2));
      }
      Alert.alert('Exportação', 'Seus dados foram preparados para exportação.');
      // Exemplo: navegar para tela onde o usuário pode baixar/visualizar termos
      navigation.navigate('Privacy');
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Erro', 'Falha ao exportar dados. Tente novamente mais tarde.');
    } finally {
      setLoadingExport(false);
    }
  }, [navigation]);

  /**
   * handleDelete
   * Exibe confirmação antes de excluir dados + conta do usuário.
   * Operação destrutiva: usar Alert com botão "destructive" em iOS/Android.
   */
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir todos os seus dados e a conta? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoadingDelete(true);
              const ok = await deleteUserDataAndAccount(); // função do serviço
              if (ok) {
                Alert.alert('Pronto', 'Sua conta e dados foram excluídos.');
                navigation.replace('Inicio');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir sua conta agora.');
              }
            } catch (err) {
              console.error('Delete account error:', err);
              Alert.alert('Erro', 'Falha ao excluir conta. Tente novamente mais tarde.');
            } finally {
              setLoadingDelete(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation]);

  /**
   * handleNavBarPress
   * Gerencia a navegação da barra inferior
   */
  const handleNavBarPress = useCallback((screen) => {
    if (screen === 'Graficos') navigation.navigate('Grafico');
    else if (screen === 'Historico') navigation.navigate('Historico');
    else if (screen === 'NovoRegistro') navigation.navigate('NovoRegistro');
    else if (screen === 'DAS') navigation.navigate('DAS');
    else if (screen === 'Configuracoes') return; // Já estamos na tela de Configurações
  }, [navigation]);

  /* ---------- Render da interface ---------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ScrollView para garantir rolagem em telas pequenas */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Título principal da tela */}
          <Text style={styles.title} accessibilityRole="header">Configurações</Text>

          {/* Card com informações básicas do aplicativo */}
          <View style={styles.card}>
            <View style={styles.itemRow}>
              <Text style={styles.label}>Tema:</Text>
              <Text style={styles.value}>Modo claro (padrão)</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.label}>Versão do app:</Text>
              <Text style={styles.value}>{APP_INFO.version}</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.label}>Desenvolvido por:</Text>
              <Text style={styles.value}>{APP_INFO.author}</Text>
            </View>
          </View>

          {/* Seção FAQ gerada dinamicamente a partir do array FAQS */}
          <View style={styles.saqContainer}>
            <Text style={styles.saqTitle} accessibilityRole="header">Perguntas Frequentes (FAQ)</Text>
            {FAQS.map((item, idx) => (
              <View key={idx} style={styles.saqItem}>
                <Text style={styles.saqQuestion}>• {item.q}</Text>
                <Text style={styles.saqAnswer}>{item.a}</Text>
              </View>
            ))}
          </View>

          {/* Botões de ação principais: Logout, Exportar, Deletar */}
          <View style={styles.actions}>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.primary },
                (loadingLogout || loadingExport || loadingDelete) && styles.actionButtonDisabled,
              ]}
              onPress={handleLogout}
              disabled={loadingLogout || loadingExport || loadingDelete}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              accessibilityHint="Desconecta sua sessão e volta para a tela inicial"
              accessibilityState={{ disabled: !!(loadingLogout || loadingExport || loadingDelete), busy: !!loadingLogout }}
              android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="logoutButton"
            >
              {loadingLogout ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Sair</Text>}
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.info, marginTop: 12 },
                (loadingExport || loadingLogout || loadingDelete) && styles.actionButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={loadingExport || loadingLogout || loadingDelete}
              accessibilityRole="button"
              accessibilityLabel="Ler termos de uso de dados"
              accessibilityHint="Abre a tela com os termos sobre uso e privacidade dos seus dados"
              accessibilityState={{ disabled: !!(loadingExport || loadingLogout || loadingDelete), busy: !!loadingExport }}
              android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="exportButton"
            >
              {loadingExport ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Ler termos de uso de dados</Text>}
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.danger, marginTop: 12 },
                (loadingDelete || loadingLogout || loadingExport) && styles.actionButtonDisabled,
              ]}
              onPress={handleDelete}
              disabled={loadingDelete || loadingLogout || loadingExport}
              accessibilityRole="button"
              accessibilityLabel="Excluir conta"
              accessibilityHint="Apaga sua conta e todos os dados após confirmação"
              accessibilityState={{ disabled: !!(loadingDelete || loadingLogout || loadingExport), busy: !!loadingDelete }}
              android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="deleteButton"
            >
              {loadingDelete ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.actionText}>Excluir conta</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <NavBar onPress={handleNavBarPress} />
    </SafeAreaView>
  );
}

/* ---------- Estilos organizados e comentados ---------- */
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    // Ajuste de padding superior baseado na plataforma para evitar sobreposição com a status bar
    paddingTop: Platform.OS === 'android' ? 20 : 40,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomColor: '#a7f3d0',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.accent,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'right',
    flexShrink: 1, // evita overflow de texto longo
  },
  actions: {
    marginTop: 8,
    marginBottom: 30,
  },
  actionButton: {
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  saqContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
  },
  saqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 12,
    textAlign: 'left',
  },
  saqItem: {
    marginBottom: 14,
  },
  saqQuestion: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 15,
    marginBottom: 2,
  },
  saqAnswer: {
    color: COLORS.accent,
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
});