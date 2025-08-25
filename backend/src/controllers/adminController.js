const User = require("../models/user");
const UserType = require("../models/userType");
const Report = require("../models/report");

const getUsersData = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: UserType,
                as: "userType",
                attributes: ["name"],
            },
            attributes: ["idUser", "name", "email", "accountStatus"],
        });

        res.json({ users });
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
    }
};

const block = async (req, res) => {
    const { idUser } = req.params;

    try {
        const user = await User.findByPk(idUser);

        if (!user) {
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }

        user.estadoConta = "Bloqueado";
        await user.save();

        res.json({ message: "Conta bloqueada com sucesso" });
    } catch (error) {
        console.error("Erro ao bloquear conta:", error);
        res.status(500).json({ error: "Erro ao bloquear conta" });
    }
};

const unblock = async (req, res) => {
    const { idUser } = req.params;

    try {
        const user = await User.findByPk(idUser);

        if (!user) {
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }

        user.estadoConta = "Ativo";
        await user.save();

        res.json({ message: "Conta desbloqueada com sucesso" });
    } catch (error) {
        console.error("Erro ao desbloquear conta:", error);
        res.status(500).json({ error: "Erro ao desbloquear conta" });
    }
};

const updateRole = async (req, res) => {
    const { idUser } = req.params;
    const { userType } = req.body;

    try {
        const user = await User.findByPk(idUser);

        if (!user) {
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }

        const type = await UserType.findOne({ where: { name: userType } });

        if (!type) {
            return res.status(400).json({ error: "Tipo de utilizador inválido" });
        }

        user.idUserType = type.idUserType;
        await user.save();

        res.json({ message: "Tipo de utilizador atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar tipo de utilizador:", error);
        res.status(500).json({ error: "Erro ao atualizar tipo de utilizador" });
    }
};

module.exports = { 
    getUsersData, 
    block, 
    unblock, 
    updateRole
};
