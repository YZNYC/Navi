import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

//login - estou fazendo
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = env.process.NEXT_PUBLIC_API_URL;
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