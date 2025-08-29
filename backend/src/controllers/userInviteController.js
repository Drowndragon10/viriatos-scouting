const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UserType = require('../models/userType');
const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

const router = express.Router();

const generateInviteLink = (email, idUserType) => {
    const token = jwt.sign(
        { email, idUserType },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return `${process.env.FRONTEND_URL}/inviteRegister/${token}`;
};

const inviteUser = async (req, res) => {
    const { email, idUserType } = req.body;

    try {
        const inviteLink = generateInviteLink(email, idUserType);

        res.status(200).json({
            message: 'Invite generated successfully.',
            inviteLink,
        });
        
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                    Email: 'jetmailgoncalo@gmail.com',
                    Name: 'Scouting App',
                },
                    To: [
                        {
                            Email: email,
                            Name: 'User',
                        },
                    ],
                    Subject: 'Invitation to Scouting App',
                    HTMLPart: `
                        <p>Click the link below to create your account:</p>
                        <a href="${inviteLink}">${inviteLink}</a>
                    `,
                },
            ],
        });
        await request;
    } catch (error) {
        console.error('Error generating invite link:', error.message);
        res.status(500).json({ error: 'Failed to generate invite link' });
    }
};

const createAccount = async (req, res) => {
    const {name, password, inviteToken} = req.body;

    let decoded;
    try {
        decoded = jwt.verify(inviteToken, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Token expired. Please request a new invite.' });
        }
        return res.status(400).json({ error: 'Invalid token' });
    }

    if (!decoded || !decoded.email || typeof decoded.idUserType !== 'number') {
        return res.status(400).json({ error: 'Invalid token payload. Missing email or user type.' });
    }

    const { email, idUserType } = decoded;

    const userType = parseInt(idUserType, 10);
    if (isNaN(userType)) {
        return res.status(400).json({ error: 'Invalid user type.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            idUserType: userType,
            accountStatus: 'Ativo',
        });

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'The email is already registered.' });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ error: 'Invalid user type.' });
        }

        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    inviteUser,
    createAccount,
};
