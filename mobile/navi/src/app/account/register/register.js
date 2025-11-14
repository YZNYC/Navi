import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
//inicialização do db
export const Register = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    try {
      if (!form.nome || !form.email || !form.senha) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      const db = await SQLite.openDatabaseAsync('navi.db');
      const newUser = await db.runAsync('INSERT INTO usuario (nome, email, senha, telefone, papel) VALUES (?, ?, ?, ?, ?)', form.nome, form.email, form.senha, form.telefone || null, "MOTORISTA");
      if (newUser.changes > 0) {
        Alert.alert('Usuário cadastrado. Seja bem-vindo!');
      }
    } catch (error) {
      console.error("ERRO AO CADASTRAR:", error);
      if (error.message.includes("UNIQUE constraint failed: usuario.email")) {
        Alert.alert("Erro", "Este email já está cadastrado.");
      } else {
        Alert.alert("Erro ao cadastrar", `Não foi possível concluir o cadastro. Por favor, tente novamente. Detalhes: ${error.message}`);
      }
    }
  };
  return (
    <View>
      <Text>Nome:</Text>
      <TextInput
        value={form.nome}
        onChangeText={(value) => handleChange('nome', value)}
        required
      />
      <Text>Email:</Text>
      <TextInput
        value={form.email}
        onChangeText={(value) => handleChange('email', value)}
        required
      />
      <Text>Senha:</Text>
      <TextInput
        secureTextEntry
        value={form.senha}
        onChangeText={(value) => handleChange('senha', value)}
        required
      />
      <Text>Telefone:</Text>
      <TextInput
        value={form.telefone}
        onChangeText={(value) => handleChange('telefone', value)}
        required
      />
      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
};

