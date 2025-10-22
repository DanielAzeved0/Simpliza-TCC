// CriarContaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

    // Função para verificar se o email é de um provedor confiável
    const verificarProvedorEmail = (email) => {
        const provedoresConhecidos = [
            'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com',
            'live.com', 'msn.com', 'uol.com.br', 'bol.com.br', 'terra.com.br',
            'globo.com', 'r7.com', 'ig.com.br', 'zipmail.com.br', 'click21.com.br'
        ];
        
        const dominio = email.split('@')[1]?.toLowerCase();
        return provedoresConhecidos.includes(dominio);
    };

    // API para verificar se email existe realmente
    const verificarEmailExiste = async (email) => {
        try {
            // Usando uma API gratuita para verificação de email
            const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=YOUR_API_KEY`);
            const data = await response.json();
            return data.data?.result === 'deliverable';
        } catch (error) {
            // Se a API falhar, aceita emails de provedores conhecidos
            console.log('API de verificação indisponível, usando validação local');
            return verificarProvedorEmail(email);
        }
    };

    // Função principal de validação de email
    const validarEmail = async (email) => {
        // 1. Verificar formato básico
        if (!validarFormatoEmail(email)) {
            throw new Error('Formato de email inválido');
        }

        // 2. Verificar se não é um email temporário/descartável
        const emailsTemporarios = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
            'mailinator.com', 'yopmail.com', 'temp-mail.org'
        ];
        
        const dominio = email.split('@')[1]?.toLowerCase();
        if (emailsTemporarios.includes(dominio)) {
            throw new Error('Emails temporários não são permitidos');
        }

        // 3. Verificar se é de um provedor confiável
        if (!verificarProvedorEmail(email)) {
            throw new Error('Use um provedor de email conhecido (Gmail, Outlook, etc.)');
        }

        return true;
    };

    const criarConta = async () => {
        // Validações básicas
        if (!nome.trim()) {
            return Alert.alert('Erro', 'Nome é obrigatório');
        }
        if (!email.trim()) {
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
            await validarEmail(email);
        } catch (error) {
            setVerificandoEmail(false);
            return Alert.alert('Email Inválido', error.message);
        }
        setVerificandoEmail(false);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
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
                errorMessage = 'A senha deve ter pelo menos 6 caracteres';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Erro', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crie sua conta</Text>

            <TextInput 
                style={styles.input} 
                placeholder="NOME" 
                onChangeText={setNome} 
                value={nome}
                maxLength={50}
            />
            <TextInput 
                style={[
                    styles.input, 
                    email && !validarFormatoEmail(email) ? styles.inputError : null
                ]} 
                placeholder="E-MAIL" 
                onChangeText={(text) => setEmail(text.toLowerCase().trim())} 
                value={email} 
                keyboardType="email-address" 
                autoCapitalize="none"
                autoComplete="email"
            />
            {email && !validarFormatoEmail(email) && (
                <Text style={styles.errorText}>Formato de email inválido</Text>
            )}

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputSenha}
                    placeholder="SENHA"
                    secureTextEntry={!mostrarSenha}
                    onChangeText={setSenha}
                    value={senha}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputSenha}
                    placeholder="CONFIRME SUA SENHA"
                    secureTextEntry={!mostrarSenha}
                    onChangeText={setConfirmaSenha}
                    value={confirmaSenha}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                </TouchableOpacity>
            </View>


            <TouchableOpacity 
                style={[styles.button, verificandoEmail && styles.buttonDisabled]} 
                onPress={criarConta}
                disabled={verificandoEmail}
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
            >
                <Text style={styles.googleText}>Conectar com o Google</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4ea', justifyContent: 'center', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#2f4f4f', textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15 },
    inputError: { borderColor: '#ff4444', borderWidth: 2 },
    errorText: { color: '#ff4444', fontSize: 12, marginBottom: 10, marginLeft: 5 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
    inputSenha: { flex: 1, padding: 14 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#cccccc' },
    buttonText: { color: 'white', fontSize: 18 },
    googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderColor: '#ccc', borderWidth: 1 },
    googleText: { color: '#000' }
});
