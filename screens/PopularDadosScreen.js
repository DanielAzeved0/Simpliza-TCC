import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { popularBancoDados, limparTransacoes } from '../utils/popularBancoDados';
import { auth } from '../dataBase/firebaseConfig';

export default function PopularDadosScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handlePopularDados = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para popular os dados.');
      return;
    }

    Alert.alert(
      'Confirmar Ação',
      'Isso adicionará cerca de 100-150 transações dos últimos 5 meses. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setLoading(true);
            setResultado(null);
            setMensagem('Populando banco de dados...');
            
            try {
              const resultado = await popularBancoDados();
              setResultado(resultado);
              setMensagem('');
              Alert.alert(
                'Sucesso!',
                `${resultado.sucessos} transações foram adicionadas com sucesso!`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Ocorreu um erro ao popular os dados.');
              setMensagem('');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLimparDados = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para limpar os dados.');
      return;
    }

    Alert.alert(
      'Confirmar Ação',
      'ATENÇÃO: Isso deletará TODAS as suas transações. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar Tudo',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            setResultado(null);
            setMensagem('Limpando transações...');
            
            try {
              const qtd = await limparTransacoes();
              setResultado({ deletadas: qtd });
              setMensagem('');
              Alert.alert(
                'Sucesso!',
                `${qtd} transações foram deletadas.`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Ocorreu um erro ao limpar os dados.');
              setMensagem('');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar para a tela anterior"
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Popular Dados</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="document-text" size={48} color="#4CAF50" style={styles.icon} />
          <Text style={styles.title}>Ferramentas de Desenvolvimento</Text>
          <Text style={styles.description}>
            Use estas ferramentas para testar o aplicativo com dados de exemplo.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Popular Banco de Dados</Text>
          <Text style={styles.cardText}>
            Adiciona automaticamente transações de ganhos e gastos dos últimos 5 meses
            (aproximadamente 100-150 registros).
          </Text>
          <Text style={styles.cardInfo}>
            • Salários mensais{'\n'}
            • Ganhos variados (freelance, bônus, etc){'\n'}
            • Gastos em diversas categorias{'\n'}
            • Datas distribuídas aleatoriamente
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.buttonPopular]}
            onPress={handlePopularDados}
            disabled={loading}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.buttonText}>Popular Dados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Limpar Transações</Text>
          <Text style={styles.cardText}>
            Remove TODAS as transações do banco de dados. Use com cuidado!
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.buttonLimpar]}
            onPress={handleLimparDados}
            disabled={loading}
          >
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.buttonText}>Limpar Tudo</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            {mensagem ? <Text style={styles.loadingText}>{mensagem}</Text> : null}
          </View>
        )}

        {resultado && !loading && (
          <View style={styles.resultCard}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.resultTitle}>Operação Concluída!</Text>
            {resultado.sucessos !== undefined && (
              <>
                <Text style={styles.resultText}>Sucessos: {resultado.sucessos}</Text>
                <Text style={styles.resultText}>Erros: {resultado.erros}</Text>
                <Text style={styles.resultText}>Total: {resultado.total}</Text>
              </>
            )}
            {resultado.deletadas !== undefined && (
              <Text style={styles.resultText}>Deletadas: {resultado.deletadas}</Text>
            )}
          </View>
        )}

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={32} color="#FF9800" />
          <Text style={styles.warningText}>
            Estas ferramentas são apenas para testes. Use em um ambiente de desenvolvimento.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  cardInfo: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  buttonPopular: {
    backgroundColor: '#4CAF50',
  },
  buttonLimpar: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 10,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 16,
    color: '#1B5E20',
    marginVertical: 5,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
  },
});
