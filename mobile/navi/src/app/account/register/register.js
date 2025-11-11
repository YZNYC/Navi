import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';


//inicialização do db
const db = await SQLite.openDatabaseAsync('navi.db');

function handleSubmit() {
  
}


export const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
  };

  return (
    <View>
      <Text>Nome:</Text>
      <TextInput
        value={formData.nome}
        onChangeText={(value) => handleChange('nome', value)}
        required
      />
      <Text>Email:</Text>
      <TextInput
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        required
      />
      <Text>Senha:</Text>
      <TextInput
        secureTextEntry
        value={formData.senha}
        onChangeText={(value) => handleChange('senha', value)}
        required
      />
      <Text>Telefone:</Text>
      <TextInput
        value={formData.telefone}
        onChangeText={(value) => handleChange('telefone', value)}
        required
      />
      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
};

