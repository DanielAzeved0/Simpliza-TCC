// CriarContaScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, BackHandler } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../dataBase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';


export default function CriarContaScreen({ navigation }) {
    useEffect(() => {
        // BackHandler só funciona em Android/iOS, não na web
        if (Platform.OS === 'web') return;
        
        const backAction = () => {
            navigation.replace('Inicio');
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [navigation]);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [senhaEmFoco, setSenhaEmFoco] = useState(false);
    const [confirmaSenhaEmFoco, setConfirmaSenhaEmFoco] = useState(false);
    const [verificandoEmail, setVerificandoEmail] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ type: 'info', title: '', message: '' });

    // Refs para navegação entre campos via teclado
    const nomeRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const confirmaSenhaRef = useRef(null);

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
            setAlertConfig({ type: 'error', title: 'Erro', message: 'Nome é obrigatório' });
            setAlertVisible(true);
            return;
        }
        if (!emailNorm) {
            setAlertConfig({ type: 'error', title: 'Erro', message: 'Email é obrigatório' });
            setAlertVisible(true);
            return;
        }
        if (senha.length < 8) {
            setAlertConfig({ type: 'error', title: 'Erro', message: 'Sua senha deve conter ao menos 8 dígitos' });
            setAlertVisible(true);
            return;
        }
        if (senha !== confirmaSenha) {
            setAlertConfig({ type: 'error', title: 'Erro', message: 'As senhas não coincidem' });
            setAlertVisible(true);
            return;
        }

        // Validar email antes de criar conta
        setVerificandoEmail(true);
        try {
            await validarEmail(emailNorm);
        } catch (error) {
            setVerificandoEmail(false);
            setAlertConfig({ type: 'error', title: 'Email Inválido', message: error.message });
            setAlertVisible(true);
            return;
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

            setAlertConfig({
                type: 'success',
                title: 'Conta criada!',
                message: 'Sua conta foi criada com sucesso.',
            });
            setAlertVisible(true);
            setTimeout(() => navigation.navigate('Login'), 2000);
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

            setAlertConfig({ type: 'error', title: 'Erro', message: errorMessage });
            setAlertVisible(true);
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
                <Text style={styles.title}> Crie sua conta</Text>

                <TextInput
                    ref={nomeRef}
                    style={styles.input}
                    placeholder="Nome"
                    onChangeText={setNome}
                    value={nome}
                    placeholderTextColor="#000000ff"
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
                    placeholderTextColor="#000000ff"
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
                        placeholderTextColor="#000000ff"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="newPassword"
                        autoComplete="password-new"
                        returnKeyType="next"
                        enablesReturnKeyAutomatically
                        onSubmitEditing={() => confirmaSenhaRef.current?.focus()}
                        blurOnSubmit={false}
                        testID="input-senha"
                        onFocus={() => setSenhaEmFoco(true)}
                        onBlur={() => setSenhaEmFoco(false)}
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
                        placeholderTextColor="#000000ff"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="newPassword"
                        autoComplete="password-new"
                        returnKeyType="go"
                        enablesReturnKeyAutomatically
                        onSubmitEditing={criarConta}
                        testID="input-confirma-senha"
                        onFocus={() => setConfirmaSenhaEmFoco(true)}
                        onBlur={() => setConfirmaSenhaEmFoco(false)}
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
                </View>
            </ScrollView>
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
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'stretch', padding: 20, paddingBottom: 40 },
    title: { fontSize: 30, fontWeight: 'bold', marginTop: 0, marginBottom: 24, color: '#2f4f4f', textAlign: 'center', alignSelf: 'stretch', transform: [{ translateY: -50 }] },
    input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15, alignSelf: 'stretch', width: '100%' },
    inputError: { borderColor: '#ff4444', borderWidth: 2 },
    errorText: { color: '#ff4444', fontSize: 12, marginBottom: 10, marginLeft: 5, alignSelf: 'stretch', width: '100%', textAlign: 'left' },
    passwordContainer: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15, alignSelf: 'stretch', width: '100%', flexDirection: 'row', alignItems: 'center', borderWidth: 0 },
    inputSenha: { flex: 1, padding: 0, color: '#000', fontSize: 16 },
    buttonsContainer: { alignItems: 'center', marginTop: 10, width: '100%', alignSelf: 'center' },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, alignSelf: 'stretch', width: '100%' },
    buttonDisabled: { backgroundColor: '#cccccc' },
    buttonText: { color: 'white', fontSize: 18 }
});
