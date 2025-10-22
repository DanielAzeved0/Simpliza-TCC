import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../dataBase/firebaseConfig';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InicioScreen() {
  const navigation = useNavigation();
  const [showConsent, setShowConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário está logado, verificar se deve manter conectado
        const manterConectado = await AsyncStorage.getItem('manterConectado');
        if (manterConectado === 'true') {
          // Verificar se o email foi verificado
          await user.reload(); // Recarregar dados do usuário
          if (user.emailVerified) {
            navigation.replace('Home');
            return;
          } else {
            // Email não verificado, fazer logout e mostrar tela de login
            await auth.signOut();
            await AsyncStorage.removeItem('manterConectado');
          }
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
      <Text style={styles.title}>Bem vindo ao Simpliza!</Text>
      <PrivacyConsentModal visible={showConsent} onClose={() => setShowConsent(false)} navigation={navigation} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CriarConta')}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>
  <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
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
