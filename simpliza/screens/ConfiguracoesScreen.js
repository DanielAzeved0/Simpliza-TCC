import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { logoutUser } from '../dataBase/firebaseService';
import { exportUserData, deleteUserDataAndAccount } from '../dataBase/firebaseService';
import { useNavigation } from '@react-navigation/native';

export default function ConfiguracoesScreen() {
  const navigation = useNavigation();
  const handleLogout = async () => {
    const ok = await logoutUser();
    if (ok) {
  navigation.replace('Inicio');
    } else {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const handleExport = async () => {
    const data = await exportUserData();
    if (!data) return Alert.alert('Erro', 'Não foi possível exportar seus dados.');
    // Exibe JSON simples para o usuário — em app real, oferecer download ou envio por e-mail.
    navigation.navigate('Privacy');
    Alert.alert('Exportação', 'Seus dados foram coletados para exportação. (Ver saída no console)');
    console.log('Exported user data:', JSON.stringify(data, null, 2));
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir todos os seus dados e a conta? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteUserDataAndAccount();
            if (ok) {
              Alert.alert('Pronto', 'Sua conta e dados foram excluídos.');
              navigation.replace('Inicio');
            } else {
              Alert.alert('Erro', 'Não foi possível excluir sua conta agora.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.card}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Tema:</Text>
            <Text style={styles.value}>Modo claro (padrão)</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Versão do app:</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Desenvolvido por:</Text>
            <Text style={styles.value}>Grupo Simpliza — TCC 2025</Text>
          </View>
        </View>

        {/* SAQ - Seção de Ajuda e Questões Frequentes */}
        <View style={styles.saqContainer}>
          <Text style={styles.saqTitle}>Perguntas Frequentes (FAQ)</Text>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Como redefinir minha senha?</Text>
            <Text style={styles.saqAnswer}>Acesse a tela de login e clique em "Esqueci minha senha" para receber instruções no seu e-mail.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Meus dados estão seguros?</Text>
            <Text style={styles.saqAnswer}>Sim, utilizamos autenticação segura e seus dados são protegidos por criptografia.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Como entrar em contato com o suporte?</Text>
            <Text style={styles.saqAnswer}>Envie um e-mail para suporte@simpliza.com ou utilize o formulário de contato no app.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Posso usar o app em mais de um dispositivo?</Text>
            <Text style={styles.saqAnswer}>Sim, basta acessar sua conta em qualquer dispositivo usando seu e-mail e senha cadastrados.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Como editar ou excluir um registro?</Text>
            <Text style={styles.saqAnswer}>Acesse a tela de histórico, selecione o registro desejado e utilize as opções de editar ou excluir.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• O app funciona offline?</Text>
            <Text style={styles.saqAnswer}>Algumas funcionalidades básicas funcionam offline, mas para salvar ou sincronizar dados é necessário estar conectado à internet.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• Como alterar meu e-mail cadastrado?</Text>
            <Text style={styles.saqAnswer}>Entre em contato com o suporte para solicitar a alteração do e-mail vinculado à sua conta.</Text>
          </View>
          <View style={styles.saqItem}>
            <Text style={styles.saqQuestion}>• O app é gratuito?</Text>
            <Text style={styles.saqAnswer}>Sim, o Simpliza é totalmente gratuito para todos os usuários.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#3ab12ff3', marginTop: 12 }]} onPress={handleExport} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Ler termos de uso de dados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#e11d48', marginTop: 12 }]} onPress={handleDelete} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Solicitar exclusão de dados e conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#e6f4ea',
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
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
    color: '#047857',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#065f46',
    textAlign: 'right',
    flexShrink: 1,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 30,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#065f46',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  saqContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
  },
  saqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 12,
    textAlign: 'left',
  },
  saqItem: {
    marginBottom: 14,
  },
  saqQuestion: {
    fontWeight: 'bold',
    color: '#065f46',
    fontSize: 15,
    marginBottom: 2,
  },
  saqAnswer: {
    color: '#047857',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
});
