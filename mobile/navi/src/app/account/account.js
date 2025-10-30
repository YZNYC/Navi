import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Account() {
  return (
    <View>
      <Text>Tela da Conta</Text>
      <LoginForm />
    </View>
  );
}

//login - estou fazendo
export const LoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  // const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async () => {
    const db = await SQLite.openDatabaseAsync('navi.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
    CREATE TABLE usuario (
    id_usuario INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    url_foto_perfil VARCHAR(255) NULL,
    papel ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA') NOT NULL,
    data_criacao TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ativo BOOLEAN NULL DEFAULT true,
    resetToken VARCHAR(255) NULL,
    resetTokenExpires DATETIME(0) NULL,
    UNIQUE INDEX email(email),
    UNIQUE INDEX resetToken(resetToken),
    PRIMARY KEY (id_usuario);

    INSERT INTO usuario (nome, email, senha, telefone, url_foto_perfil, papel)
    VALUES
    ('Alice Andrade', 'alice.admin@empresa.com', 'admin123', '(11) 99999-1111', 'https://i.pravatar.cc/150?img=10', 'ADMINISTRADOR'),
    ('Bruno Paiva', 'bruno.proprietario@empresa.com', 'prop456', '(11) 98888-2222', 'https://i.pravatar.cc/150?img=11', 'PROPRIETARIO'),
    ('Carla Souza', 'carla.motorista@empresa.com', 'motor789', '(11) 97777-3333', 'https://i.pravatar.cc/150?img=12', 'MOTORISTA');

      `);

    try {
      if (!form.email || !form.senha) {
        throw new Error('Preencha todos os campos!');
      }
      const user = await db.getAsync(
        'SELECT * FROM usuario WHERE email = ? AND senha = ?',
        [form.email, form.senha]
      );
      if (!user[0].length > 0) throw new Error('Credenciais inválidas.');

      Alert.alert('Login bem-sucedido!');
      setForm({
        email: '',
        senha: ''
      })

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Erro ao logar');
    }
  }



  //esqueceu a senha - a fazer


  // export const EsqueceuSenha = async (req, res) => {
  //     try {
  //         const { email } = req.body;

  //           if (!email) {
  //             return res.status(400).json({ message: "O email é obrigatório." });
  //         }

  //         const usuario = await prisma.usuario.findUnique({ where: { email } });

  //         if (usuario) {
  //             const resetToken = crypto.randomBytes(32).toString('hex');
  //             const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  //             const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  //             await prisma.usuario.update({
  //                 where: { email },
  //                 data: { resetToken: hashedToken, resetTokenExpires: tokenExpiry },
  //             });

  //             enviarEmailResetSenha(usuario.email, resetToken)
  //                 .then(() => console.log(`LOG: Processo de envio de email para ${usuario.email} iniciado em segundo plano.`))
  //                 .catch(err => console.error(`ERRO EM SEGUNDO PLANO: Falha ao enviar email para ${usuario.email}:`, err));

  //         }

  //         // A resposta para o usuário é ENVIADA IMEDIATAMENTE, não espera o email.
  //         res.status(200).json({ message: "Email Confirmado, um link de recuperação foi enviado." });

  //     } catch (error) {
  //         console.error("Erro na solicitação de redefinição de senha:", error);
  //         res.status(500).json({ message: "Erro interno no servidor." });
  //     }
  // };


  // O usuário clica no link, envia o token e a nova senha. - a fazer
  // export const ResetarSenha = async (req, res) => {
  //     try {
  //         const { token } = req.params;
  //         const { novaSenha } = req.body;

  //         const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //         const usuario = await prisma.usuario.findFirst({
  //             where: {
  //                 resetToken: hashedToken,
  //                 resetTokenExpires: { gte: new Date() },
  //             },
  //         });

  //         if (!usuario) {
  //             return res.status(400).json({ message: "Token inválido ou expirado." });
  //         }

  //         if (!novaSenha || novaSenha.length < 8) {
  //             return res.status(400).json({ message: "A nova senha precisa ter no mínimo 8 caracteres." });
  //         }

  //         const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

  //         await prisma.usuario.update({
  //             where: { id_usuario: usuario.id_usuario },
  //             data: {
  //                 senha: novaSenhaHash,
  //                 resetToken: null,
  //                 resetTokenExpires: null,
  //             },
  //         });

  //         res.status(200).json({ message: "Senha redefinida com sucesso! Você já pode fazer login." });

  //     } catch (error) {
  //         console.error("Erro ao redefinir a senha:", error);
  //         res.status(500).json({ message: "Erro interno no servidor." });
  //     }
  // };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={form.senha}
        onChangeText={(text) => setForm({ ...form, senha: text })}
      />
      <Button title="Entrar" onPress={handleSubmit} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '40%',
    backgroundColor: "#ffa500",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    borderRadius: 10,
    padding: 10
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#253025",
  },
}
);