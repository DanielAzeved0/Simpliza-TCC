import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../dataBase/firebaseConfig';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InicioScreen() {
  const navigation = useNavigation();
  const [showConsent, setShowConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Bloquear botão de voltar para sair do app
  useEffect(() => {
    // BackHandler só funciona em Android/iOS, não na web
    if (Platform.OS === 'web') return;
    
    const backAction = () => {
      // Sai do app ao pressionar voltar na tela de início
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário está logado, verificar se deve manter conectado
        const manterConectado = await AsyncStorage.getItem('manterConectado');
        if (manterConectado === 'true') {
          navigation.replace('Grafico');
          return;
        }
      }
      // Verificar consentimento LGPD apenas se não estiver logado
      try {
        const v = await AsyncStorage.getItem('consentimentoLGPD');
        if (v === null) setShowConsent(true);
      } catch (e) {
        setShowConsent(true);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10, color: '#2f4f4f' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Bem-vindo ao Simpliza"
      >
        Bem vindo ao Simpliza!
      </Text>
      <PrivacyConsentModal visible={showConsent} onClose={() => setShowConsent(false)} navigation={navigation} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CriarConta')}
        accessibilityRole="button"
        accessibilityLabel="Criar uma conta"
        accessibilityHint="Ir para tela de cadastro"
        testID="botao-criar-conta"
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Criar uma conta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.replace('Login')}
        accessibilityRole="button"
        accessibilityLabel="Já tenho uma conta"
        accessibilityHint="Ir para tela de login"
        testID="botao-login"
        activeOpacity={0.8}
      >
        <Text style={[styles.secondaryButtonText, { color: '#000000ff' }]}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f4ea' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#2f4f4f' },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, width: '80%', alignItems: 'center', marginBottom: 15 },
  buttonText: { color: 'white', fontSize: 18 },
  secondaryButton: { padding: 15, borderRadius: 12, width: '80%', alignItems: 'center' },
  secondaryButtonText: { color: '#4CAF50', fontSize: 16 }
});
