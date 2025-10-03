import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Encontra o usuário pelo email
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        // 2. Verifica se o usuário existe E se está ativo
        if (!usuario || !usuario.ativo) {
           
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // 3. Compara a senha enviada com a senha criptografada no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // 4. Se tudo estiver correto, gera o Token JWT
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                papel: usuario.papel 
            },
            process.env.JWT_SECRET, 
            {
                expiresIn: '8h', 
            }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token
        });

    } catch (error) {
        console.error('Erro no processo de login:', error);
        res.status(500).json({ message: 'Ocorreu um erro interno.' });
    }
};