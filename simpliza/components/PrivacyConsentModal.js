import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacyConsentModal({ visible, onClose, navigation }) {
  const accept = async () => {
    await AsyncStorage.setItem('consentimentoLGPD', 'true');
    onClose && onClose(true);
  };

  const decline = async () => {
    await AsyncStorage.setItem('consentimentoLGPD', 'false');
    onClose && onClose(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Política de Privacidade</Text>
          <Text style={styles.text} numberOfLines={6}>
            Para usar o Simpliza precisamos do seu consentimento para coletar e armazenar seus dados de conta e transações.
            Você pode ler a política completa e aceitar ou recusar. Se recusar, alguns recursos (login via Google, analytics) serão desativados.
          </Text>

          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Privacy') }>
            <Text style={styles.linkText}>Ler política completa</Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.buttonDecline} onPress={decline}>
              <Text style={styles.buttonDeclineText}>Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAccept} onPress={accept}>
              <Text style={styles.buttonAcceptText}>Aceitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 14, color: '#333', marginBottom: 12 },
  link: { marginBottom: 12 },
  linkText: { color: '#0a84ff' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonDecline: { backgroundColor: '#eee', padding: 12, borderRadius: 10, flex: 1, marginRight: 8, alignItems: 'center' },
  buttonAccept: { backgroundColor: '#065f46', padding: 12, borderRadius: 10, flex: 1, marginLeft: 8, alignItems: 'center' },
  buttonDeclineText: { color: '#333', fontWeight: 'bold' },
  buttonAcceptText: { color: '#fff', fontWeight: 'bold' }
});
