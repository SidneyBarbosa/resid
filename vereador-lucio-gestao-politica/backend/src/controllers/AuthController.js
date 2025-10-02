const db = require('../database/db');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    // A consulta SQL para a verificação do email e senha
    const query = `
        SELECT * FROM "Profiles"
        WHERE
            email = $1
            AND
            password_hash = crypt($2, password_hash);
    `;

    try {
        //DOIS parâmetros para a consulta: [email, senha]
        const result = await db.query(query, [email, senha]);

        // Se a consulta retornar uma linha (ou mais), o login foi bem-sucedido
        if (result.rows.length > 0) {
            const user = result.rows[0]; // O usuário autenticado
            
            // Adicionar logicas para gerar um token JWT
            
            return res.status(200).json({ message: 'Login bem-sucedido!', user });
        } else {
            // Se a consulta não retornar nada, é porque o email ou a senha estavam errados
            return res.status(401).json({ message: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
        }

    } catch (err) {
        // Verifica se o erro é de "relação não existe" (tabela não encontrada)
        if (err.code === '42P01') {
             console.error('Erro no login: A tabela "Profiles" não foi encontrada. Verifique o nome da tabela.', err.message);
             return res.status(500).json({ message: 'Erro de configuração no servidor.' });
        }

        console.error('Erro no login:', err.message);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
};