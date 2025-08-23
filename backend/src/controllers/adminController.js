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

const getUserStats = async (req, res) => {
    try {
        const admins = await User.count({
            include: {
                model: UserType,
                as: "userType",
                where: { nome: "Administrador" },
            },
        });

        const coaches = await User.count({
            include: {
                model: UserType,
                as: "userType",
                where: { nome: "Treinador" },
            },
        });

        const scouts = await User.count({
            include: {
                model: UserType,
                as: "userType",
                where: { nome: "Olheiro" },
            },
        });

        res.json({
            admins,
            coaches,
            scouts,
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas de utilizadores:", error);
        res.status(500).json({ error: "Erro ao buscar estatísticas de utilizadores" });
    }
};

const getAccountStats = async (req, res) => {
    try {
        const activeAccounts = await User.count({
            where: { estadoConta: "Ativo" },
        });

        const inactiveAccounts = await User.count({
            where: { estadoConta: "Inativo" },
        });

        res.json({
            activeAccounts,
            inactiveAccounts,
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas de contas:", error);
        res.status(500).json({ error: "Erro ao buscar estatísticas de contas" });
    }
};

const getReportStats = async (req, res) => {
    try {
        const approved = await Report.count({
            where: { estado: "Aprovado" },
        });

        const rejected = await Report.count({
            where: { estado: "Reprovado" },
        });

        const pending = await Report.count({
            where: { estado: "Em Revisão" },
        });

        const total = await Report.count();

        res.json({
            approved,
            rejected,
            pending,
            total,
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas de relatórios:", error);
        res.status(500).json({ error: "Erro ao buscar estatísticas de relatórios" });
    }
};

module.exports = { 
    getUsersData, 
    block, 
    unblock, 
    updateRole, 
    getUserStats, 
    getAccountStats, 
    getReportStats 
};
