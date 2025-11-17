import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useLogin } from '../../../providers/loginProvider';
import * as SQLite from 'expo-sqlite';

//inicialização do db
const openDb = async () => {
    return await SQLite.openDatabaseAsync('navi.db');
}

export const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            if (!email) {
                Alert.alert("Por-favor digite um e-mail válido!");
            }
            const db = await openDb();
            const user = await db.getFirstAsync(
                'SELECT * FROM usuario WHERE email = ?',
                [email.trim()]
            );
            if (user) {
                navigation.navigate('UpdatePassword', { userEmail: email.trim() });
            } else {
                Alert.alert("Erro", "E-mail não encontrado");
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Ocorreu um erro ao tentar criar a senha');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Recuperar Senha" onPress={handleForgotPassword} />
        </View>
    );
};

export const UpdatePassword = ({ navigation }) => {
    const route = useRoute(); 
    const { userEmail } = route.params; 
    const [newPassword, setNewPassword] = useState('');

    const handleUpdatePassword = async () => {
        try {
            if (!newPassword) {
                Alert.alert("Coloque uma senha válida!");
            }
            const db = await openDb();
            const password = await db.runAsync('UPDATE usuario SET senha = ? WHERE email = ?', [newPassword, userEmail]);;
            if (password) {
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Ocorreu um erro ao tentar criar a senha');
        }
    };

    return (
        <View>
            <Text>Usuário: {userEmail}</Text>
            <TextInput
                placeholder="Digite a nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
            />
            <Button title="Salvar Nova Senha" onPress={() => { /* ... */ }} />
        </View>
    );
}

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

