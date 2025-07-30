// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Checkbox, Provider as PaperProvider } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/firebaseConfig';
import useGoogleAuth from '../firebase/googleAuth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [manterConectado, setManterConectado] = useState(false);

    const { promptAsync, request } = useGoogleAuth(navigation);

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            if (manterConectado) {
                await AsyncStorage.setItem('manterConectado', 'true');
            }
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>LOGIN</Text>

                <TextInput style={styles.input} placeholder="E-MAIL" value={email} onChangeText={setEmail} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="SENHA" secureTextEntry value={senha} onChangeText={setSenha} />

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={manterConectado ? 'checked' : 'unchecked'}
                        onPress={() => setManterConectado(!manterConectado)}
                        color="#4CAF50"
                    />
                    <Text style={styles.checkboxLabel}>Manter-se conectado</Text>
                </View>

                <TouchableOpacity style={styles.googleButton}>
                    <Text style={styles.googleText}>Conectar com o Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>Concluir Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Text style={styles.googleText}>Conectar com o Google</Text>
                </TouchableOpacity>

            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4ea', justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#2f4f4f', textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    checkboxLabel: { marginLeft: 8, fontSize: 16 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18 },
    googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderColor: '#ccc', borderWidth: 1 },
    googleText: { color: '#000' }
});
