// CriarContaScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../dataBase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import useGoogleAuth from '../dataBase/googleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CriarContaScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [verificandoEmail, setVerificandoEmail] = useState(false);
    
    // Refs para navegação entre campos via teclado
    const nomeRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const confirmaSenhaRef = useRef(null);

    const { promptAsync, request } = useGoogleAuth(navigation);
        const [consentido, setConsentido] = useState(false);

        useEffect(() => {
            (async () => {
                const v = await AsyncStorage.getItem('consentimentoLGPD');
                setConsentido(v === 'true');
            })();
        }, []);

    // Função para validar formato do email
    const validarFormatoEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função principal de validação de email (local apenas)
    const validarEmail = async (email) => {
        // 1. Verificar formato básico
        if (!validarFormatoEmail(email)) {
            throw new Error('Formato de email inválido');
        }

        return true;
    };

    const criarConta = async () => {
        // Normalizar entradas no submit
        const nomeTrim = nome.trim();
        const emailNorm = email.trim().toLowerCase();

        // Validações básicas
        if (!nomeTrim) {
            return Alert.alert('Erro', 'Nome é obrigatório');
        }
        if (!emailNorm) {
            return Alert.alert('Erro', 'Email é obrigatório');
        }
        if (senha.length < 8) {
            return Alert.alert('Erro', 'Sua senha deve conter ao menos 8 dígitos');
        }
        if (senha !== confirmaSenha) {
            return Alert.alert('Erro', 'As senhas não coincidem');
        }

        // Validar email antes de criar conta
        setVerificandoEmail(true);
        try {
            await validarEmail(emailNorm);
        } catch (error) {
            setVerificandoEmail(false);
            return Alert.alert('Email Inválido', error.message);
        }
        setVerificandoEmail(false);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailNorm, senha);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                nome: nomeTrim,
                email: emailNorm,
                uid: user.uid,
                dataCriacao: new Date().toISOString()
            });

            Alert.alert(
                'Conta criada!',
                'Sua conta foi criada com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );
        } catch (error) {
            let errorMessage = 'Erro ao criar conta';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email já está sendo usado por outra conta';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'A senha deve ter pelo menos 8 caracteres';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Erro', errorMessage);
        }
    };

    // Erros derivados para feedback inline
    const emailFormatoInvalido = email.length > 0 && !validarFormatoEmail(email);
    const senhaFraca = senha.length > 0 && senha.length < 8;
    const senhasDiferentes = confirmaSenha.length > 0 && senha !== confirmaSenha;
    const camposVazios = !nome.trim() || !email.trim() || !senha || !confirmaSenha;
    const formularioInvalido = emailFormatoInvalido || senhaFraca || senhasDiferentes || camposVazios;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Crie sua conta</Text>

                <TextInput 
                    ref={nomeRef}
                    style={styles.input} 
                    placeholder="Nome" 
                    onChangeText={setNome} 
                    value={nome}
                    maxLength={50}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    autoComplete="name"
                    returnKeyType="next"
                    enablesReturnKeyAutomatically
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                    testID="input-nome"
                />

                <TextInput 
                    ref={emailRef}
                    style={[
                        styles.input, 
                        emailFormatoInvalido ? styles.inputError : null
                    ]} 
                    placeholder="E-mail" 
                    onChangeText={setEmail}
                    onBlur={() => setEmail((prev) => prev.trim().toLowerCase())}
                    value={email} 
                    keyboardType="email-address" 
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="next"
                    enablesReturnKeyAutomatically
                    onSubmitEditing={() => senhaRef.current?.focus()}
                    blurOnSubmit={false}
                    testID="input-email"
                />
                {emailFormatoInvalido && (
                    <Text style={styles.errorText}>Formato de email inválido</Text>
                )}

                <View style={[
                    styles.passwordContainer,
                    senhaFraca ? styles.inputError : null
                ]}>
                    <TextInput
                        ref={senhaRef}
                        style={styles.inputSenha}
                        placeholder="Senha"
                        secureTextEntry={!mostrarSenha}
                        onChangeText={setSenha}
                        value={senha}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="newPassword"
                        autoComplete="password-new"
                        returnKeyType="next"
                        enablesReturnKeyAutomatically
                        onSubmitEditing={() => confirmaSenhaRef.current?.focus()}
                        blurOnSubmit={false}
                        testID="input-senha"
                    />
                    <TouchableOpacity
                        onPress={() => setMostrarSenha(!mostrarSenha)}
                        accessibilityRole="button"
                        accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        testID="toggle-senha"
                    >
                        <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                {senhaFraca && (
                    <Text style={styles.errorText}>A senha deve ter pelo menos 8 caracteres</Text>
                )}

                <View style={[
                    styles.passwordContainer,
                    senhasDiferentes ? styles.inputError : null
                ]}>
                    <TextInput
                        ref={confirmaSenhaRef}
                        style={styles.inputSenha}
                        placeholder="Confirme sua senha"
                        secureTextEntry={!mostrarSenha}
                        onChangeText={setConfirmaSenha}
                        value={confirmaSenha}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="newPassword"
                        autoComplete="password-new"
                        returnKeyType="go"
                        enablesReturnKeyAutomatically
                        onSubmitEditing={criarConta}
                        testID="input-confirma-senha"
                    />
                    <TouchableOpacity
                        onPress={() => setMostrarSenha(!mostrarSenha)}
                        accessibilityRole="button"
                        accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        testID="toggle-confirma-senha"
                    >
                        <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                {senhasDiferentes && (
                    <Text style={styles.errorText}>As senhas não coincidem</Text>
                )}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.button, (verificandoEmail || formularioInvalido) && styles.buttonDisabled]} 
                        onPress={criarConta}
                        disabled={verificandoEmail || formularioInvalido}
                        accessibilityRole="button"
                        accessibilityLabel="Criar conta"
                        testID="botao-criar-conta"
                    >
                        <Text style={styles.buttonText}>
                            {verificandoEmail ? 'Verificando email...' : 'Criar conta'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={async () => {
                            if (!consentido) return Alert.alert('Consentimento', 'Você precisa aceitar a política de privacidade antes de usar login via Google.');
                            promptAsync();
                        }}
                        disabled={!request}
                        accessibilityRole="button"
                        accessibilityLabel="Conectar com o Google"
                        testID="botao-google"
                    >
                        <Text style={styles.googleText}>Conectar com o Google</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4ea' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'stretch', padding: 20, paddingBottom: 40 },
    title: { fontSize: 30, fontWeight: 'bold', marginTop: 0, marginBottom: 24, color: '#2f4f4f', textAlign: 'center', alignSelf: 'stretch', transform: [{ translateY: -50 }] },
    input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15, alignSelf: 'stretch', width: '100%' },
    inputError: { borderColor: '#ff4444', borderWidth: 2 },
    errorText: { color: '#ff4444', fontSize: 12, marginBottom: 10, marginLeft: 5, alignSelf: 'stretch', width: '100%', textAlign: 'left' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, alignSelf: 'stretch', width: '100%' },
    inputSenha: { flex: 1, padding: 14 },
    buttonsContainer: { alignItems: 'center', marginTop: 10, width: '100%', alignSelf: 'center' },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, alignSelf: 'stretch', width: '100%' },
    buttonDisabled: { backgroundColor: '#cccccc' },
    buttonText: { color: 'white', fontSize: 18 },
    googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 14, marginBottom: 10, borderColor: '#ccc', borderWidth: 1, alignSelf: 'stretch', width: '100%' },
    googleText: { color: '#000' }
});
