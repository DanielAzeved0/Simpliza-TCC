// CriarContaScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../dataBase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import useGoogleAuth from '../dataBase/googleAuth';


export default function CriarContaScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const { promptAsync, request } = useGoogleAuth(navigation);

    const criarConta = async () => {
        if (senha.length < 8) {
            return Alert.alert('Erro', 'Sua senha deve conter ao menos 8 dígitos');
        }
        if (senha !== confirmaSenha) {
            return Alert.alert('Erro', 'As senhas não coincidem');
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            await setDoc(doc(db, 'usuarios', user.uid), {
                nome,
                email,
                uid: user.uid
            });

            Alert.alert('Sucesso', 'Conta criada com sucesso');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crie sua conta</Text>

            <TextInput style={styles.input} placeholder="NOME" onChangeText={setNome} value={nome} />
            <TextInput style={styles.input} placeholder="E-MAIL" onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" />

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


            <TouchableOpacity style={styles.button} onPress={criarConta}>
                <Text style={styles.buttonText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={() => promptAsync()}
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
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
    inputSenha: { flex: 1, padding: 14 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontSize: 18 },
    googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderColor: '#ccc', borderWidth: 1 },
    googleText: { color: '#000' }
});
