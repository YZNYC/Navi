import nodemailer from 'nodemailer';

async function criarTransportadores() {
    let transportadores = {};

    // Ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
        console.log("Criando conta Ethereal...");
        const contaTeste = await nodemailer.createTestAccount();
        transportadores.ethereal = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: contaTeste.user,
                pass: contaTeste.pass,
            },
        });
        console.log("Conta Ethereal:", contaTeste);

        // Gmail opcional
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log("Configurando Gmail...");
            transportadores.gmail = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT),
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }
    } else {

        console.log("Configurando Gmail (produção)...");
        transportadores.producao = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    return transportadores;
}

// Envia email de redefinição de senha
export const enviarEmailResetSenha = async (emailDestino, token) => {
    try {
        const transportadores = await criarTransportadores();
        const urlDeReset = `http://localhost:3001/resetar-senha?token=${token}`;

        const mailOptions = {
            from: `"Equipe Navi" <${process.env.EMAIL_USER || 'no-reply@navi.com'}>`,
            to: emailDestino,
            subject: "Recuperação de Senha - Navi",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
                    <h2>Solicitação de Redefinição de Senha</h2>
                    <p>Clique no botão abaixo para criar uma nova senha:</p>
                    <a href="${urlDeReset}" target="_blank" style="display: inline-block; ...">Redefinir Senha</a>
                    ...
                </div>
            `,
        };

        const promessasDeEnvio = [];

        if (transportadores.gmail) {
            console.log("Adicionando envio via Gmail...");
            promessasDeEnvio.push(transportadores.gmail.sendMail(mailOptions));
        }

        console.log("Enviando emails...");
        const resultados = await Promise.allSettled(promessasDeEnvio);

        resultados.forEach((resultado, index) => {
            if (resultado.status === 'fulfilled') {
                const info = resultado.value;
                const ehEthereal = info.response?.includes('ethereal.email');

                if (ehEthereal) {
                    console.log("Email de teste Ethereal:", nodemailer.getTestMessageUrl(info));
                } else {
                    console.log(`Email enviado para ${emailDestino} via Gmail.`);
                }
            } else {
                console.error(`Falha no envio #${index + 1}:`, resultado.reason);
            }
        });

    } catch (error) {
        console.error("Erro ao enviar email:", error);
        throw new Error("Falha no envio de email.");
    }
};
