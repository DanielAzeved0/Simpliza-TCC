// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox, Provider as PaperProvider } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../dataBase/firebaseConfig';
import useGoogleAuth from '../dataBase/googleAuth';
import CustomAlert from '../components/CustomAlert';

export default function LoginScreen({ navigation }) {
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
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [manterConectado, setManterConectado] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ type: 'info', title: '', message: '' });
    const emailRef = React.useRef(null);
    const senhaRef = React.useRef(null);

    const { promptAsync, request } = useGoogleAuth(navigation);
        const [consentido, setConsentido] = useState(false);

        useEffect(() => {
            (async () => {
                const v = await AsyncStorage.getItem('consentimentoLGPD');
                setConsentido(v === 'true');
            })();
        }, []);

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            // ...existing code...
            if (manterConectado) {
                await AsyncStorage.setItem('manterConectado', 'true');
            }
            navigation.replace('Grafico');
        } catch (error) {
            let errorMessage = 'Erro ao fazer login';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Senha incorreta';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            }
            
            setAlertConfig({ type: 'error', title: 'Erro', message: errorMessage });
            setAlertVisible(true);
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* Título acessível para leitores de tela */}
                <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Tela de login">LOGIN</Text>

                <Text style={styles.label}>E-MAIL</Text>
                <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#000000ff"
                    keyboardType="email-address"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => senhaRef.current && senhaRef.current.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="Campo de e-mail"
                    accessibilityHint="Digite seu e-mail"
                    testID="input-email"
                />
                <Text style={styles.label}>SENHA</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        ref={senhaRef}
                        style={styles.inputSenha}
                        placeholder="Digite sua senha"
                        secureTextEntry={!mostrarSenha}
                        value={senha}
                        onChangeText={setSenha}
                        placeholderTextColor="#000000ff"
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={login}
                        accessibilityLabel="Campo de senha"
                        accessibilityHint="Digite sua senha"
                        testID="input-senha"
                    />
                    <TouchableOpacity
                        onPress={() => setMostrarSenha(!mostrarSenha)}
                        activeOpacity={0.6}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        accessibilityHint="Alterna a visibilidade da senha"
                        testID="botao-olho-senha"
                    >
                        <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={manterConectado ? 'checked' : 'unchecked'}
                        onPress={() => setManterConectado(!manterConectado)}
                        color="#4CAF50"
                        accessibilityLabel="Manter-se conectado"
                        accessibilityHint="Mantenha-se conectado ao app"
                        testID="checkbox-manter-conectado"
                    />
                    <Text style={styles.checkboxLabel}>Manter-se conectado</Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, (!email.trim() || !senha) && styles.buttonDisabled]}
                    onPress={login}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Concluir Login"
                    accessibilityHint="Fazer login com e-mail e senha"
                    testID="botao-login"
                    disabled={!email.trim() || !senha}
                >
                    <Text style={styles.buttonText}>Concluir Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={async () => {
                        if (!consentido) {
                            setAlertConfig({
                                type: 'warning',
                                title: 'Consentimento',
                                message: 'Você precisa aceitar a política de privacidade antes de usar login via Google.',
                            });
                            setAlertVisible(true);
                            return;
                        }
                        promptAsync();
                    }}
                    disabled={!request}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Conectar com o Google"
                    accessibilityHint="Fazer login usando sua conta Google"
                    testID="botao-google"
                >
                    <Text style={styles.googleText}>Conectar com o Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cadastroButton}
                    onPress={() => navigation.navigate('CriarConta')}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Ir para cadastro"
                    accessibilityHint="Ir para tela de criar conta"
                    testID="botao-cadastro"
                >
                    <Text style={styles.cadastroText}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>

            </View>
            <CustomAlert
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertVisible(false)}
            />
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4ea', justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#2f4f4f', textAlign: 'center' },
    input: { 
        backgroundColor: '#fff', 
        padding: 14, 
        borderRadius: 10, 
        marginBottom: 15,
        fontSize: 16,
        color: '#333333'
    },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    checkboxLabel: { marginLeft: 8, fontSize: 16, color: '#333333' },
    passwordContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        paddingHorizontal: 10, 
        marginBottom: 15 
    },
    inputSenha: { 
        flex: 1, 
        padding: 14,
        fontSize: 16,
        color: '#333333'
    },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
    buttonDisabled: { backgroundColor: '#cccccc' },
    buttonText: { color: 'white', fontSize: 18 },
    googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderColor: '#ccc', borderWidth: 1 },
    googleText: { color: '#000' },
    cadastroButton: { marginTop: 10, alignItems: 'center' },
    cadastroText: { color: '#065f46', fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' },
    label: { fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 4, marginLeft: 2 },
});
