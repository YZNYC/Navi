import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native'; // Juntei o StyleSheet no import principal

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        // A sua lógica de recuperação de senha permanece a mesma
        if (email) {
            Alert.alert('Email enviado!', 'Verifique sua caixa de entrada para redefinir sua senha.');
        } else {
            Alert.alert('Erro', 'Por favor, insira um email válido.');
        }
    };

    // AQUI É O ÚNICO E CORRETO 'RETURN' DO COMPONENTE
    // Note que agora ele usa os estilos de 'styles'
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                style={styles.input} // <-- Usando o estilo do StyleSheet
                keyboardType="email-address" // <-- Boa prática para campos de email
                autoCapitalize="none" // <-- Boa prática para campos de email
            />
            <Button title="Recuperar Senha" onPress={handleForgotPassword} /> 
            {/* O componente Button do React Native não aceita a prop 'style'. A cor é passada diretamente. */}
        </View>
    );
};

// O StyleSheet fica fora do componente, como deve ser.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20, // Adicionado para dar um respiro nas laterais
    },
    input: {
        height: 50, // Um pouco mais alto para facilitar o toque
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8, // Bordas arredondadas
        marginBottom: 20,
        paddingLeft: 15,
        width: '100%', // Ocupa toda a largura do container
    },
    // Nota: A prop 'style' no Button padrão do React Native tem suporte limitado.
    // Para estilizar botões, geralmente se usa <TouchableOpacity> ou <Pressable>.
});

