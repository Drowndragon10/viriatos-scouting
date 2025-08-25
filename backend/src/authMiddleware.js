const jwt = require('jsonwebtoken');
const { UserType } = require('./models/userType');

const verifyToken = (req, res, next) => {
    const authToken = req.headers['authorization']?.split(' ')[1];
    console.log('Token recebido:', authToken);

    if (!authToken) {
        console.log('Token ausente');
        return res.status(401).send({ message: 'Token não fornecido' });
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Erro ao verificar token:', err.message);
            return res.status(403).send({ message: 'Token inválido ou expirado' });
        }

        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    });
};
module.exports = { verifyToken };
