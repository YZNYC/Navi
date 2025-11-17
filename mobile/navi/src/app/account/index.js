//useLogin
import { useLogin } from '../../providers/loginProvider';

//importando bibliotecas
import { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';


//inicialização do db
const openDb = async () => {
  return await SQLite.openDatabaseAsync('navi.db');
}


//Criação da tabela usuario
const setupDatabase = async (db) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      telefone VARCHAR(20) NULL,
      url_foto_perfil VARCHAR(255) NULL,
      papel TEXT NOT NULL CHECK(papel IN ('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA')),
      data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ativo BOOLEAN NULL DEFAULT 1,
      resetToken VARCHAR(255) NULL UNIQUE,
      resetTokenExpires DATETIME NULL
    );
  `);

  //Verificar se a tabela usuario esta vazia, se estiver inserre alguns dados iniciais
  const firstUser = await db.getFirstAsync('SELECT * FROM usuario');
  if (!firstUser) {
    console.log('Banco de dados vazio. Inserindo dados iniciais...');
    await db.execAsync(`
      INSERT INTO usuario (nome, email, senha, telefone, url_foto_perfil, papel)
      VALUES
      ('Alice Andrade', 'alice.admin@empresa.com', 'admin123', '(11) 99999-1111', 'https://i.pravatar.cc/150?img=10', 'ADMINISTRADOR'),
      ('Bruno Paiva', 'bruno.proprietario@empresa.com', 'prop456', '(11) 98888-2222', 'https://i.pravatar.cc/150?img=11', 'PROPRIETARIO'),
      ('Carla Souza', 'carla.motorista@empresa.com', 'motor789', '(11) 97777-3333', 'https://i.pravatar.cc/150?img=12', 'MOTORISTA');
    `);
  }
};



export default function Account() {

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Tela da Conta</Text>
      <LoginForm />
    </View>
  );
}

//Formulario de login
export const LoginForm = ({ navigation }) => {
  const { setUser } = useLogin();
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const db = await openDb();
        await setupDatabase(db);
      } catch (error) {
        console.error("Erro fatal ao inicializar o banco de dados:", error);
        Alert.alert("Erro", "Não foi possível inicializar o banco de dados.");
      }
    };

    initializeDb();
  }, []);


  // enviar o formulário
  const handleSubmit = async () => {
    try {
      if (!form.email || !form.senha) {
        throw new Error('Preencha todos os campos!');
      }

      const db = await openDb();
      const user = await db.getFirstAsync(
        'SELECT * FROM usuario WHERE email = ? AND senha = ?',
        [form.email.trim(), form.senha.trim()]
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      setUser(user);

      Alert.alert('Login bem-sucedido!', `Bem-vindo, ${user.nome}!`);
      setForm({
        email: '',
        senha: ''
      });
      console.log("Usuário logado:", user);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro no Login', error.message || 'Ocorreu um erro ao tentar logar.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>Bem-vindo de volta</Text>
        <Text style={{ color: "#6e727a" }}>Faça login para continuar</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Endereço de Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={form.senha}
        onChangeText={(text) => setForm({ ...form, senha: text })}
        secureTextEntry={true}
      />


      {/* Esqueci a senha */}
      <View>
        <TouchableOpacity href="/forgot-password" onPress={() => navigation.navigate('Esqueci a senha')}>
          <Text style={styles.links}>Esqueci a senha</Text>
        </TouchableOpacity>
      </View>

      {/* Botao de login */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>


      {/* cadastrar */}
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastre-se')}>
        <Text style={styles.links}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>




  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  links: {
    color: "#D08700",
    fontWeight: "bold",
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FFDE33",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#4E431B",
  },
});