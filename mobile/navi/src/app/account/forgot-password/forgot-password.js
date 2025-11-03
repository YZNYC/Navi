import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { StyleSheet } from 'react-native';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        // Aqui você pode adicionar a lógica para enviar um email de recuperação
        if (email) {
            Alert.alert('Email enviado!', 'Verifique sua caixa de entrada para redefinir sua senha.');
        } else {
            Alert.alert('Erro', 'Por favor, insira um email válido.');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 }}
            />
            <Button title="Recuperar Senha" onPress={handleForgotPassword} />
        </View>
    );
};

export default ForgotPassword;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        width: '80%',
    },
    button: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
    },
});

return (
    <View style={styles.container}>
        <TextInput
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
        />
        <Button title="Recuperar Senha" onPress={handleForgotPassword} color="#007BFF" />
    </View>
);