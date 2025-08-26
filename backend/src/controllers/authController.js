const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ where: { email } });

        if (user.accountStatus === 'Inactive') {
            return res.status(403).send({ message: 'Account blocked. Please contact the administrator.' });
        }

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const authToken = jwt.sign(
                    { idUser: user.idUser, idUserType: user.idUserType },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.send({ message: 'Login successful', authToken });
            } else {
                return res.status(401).send({ message: 'Invalid password' });
            }
        }
        res.status(401).send({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ message: 'Name, email and password are required' });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).send({ message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            idUserType: 2,
        });

        if (newUser) {
            return res.status(201).send({ message: 'User successfully registered' });
        } else {
            return res.status(500).send({ message: 'Error registering user' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.users = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        return res.status(400).json({ error: error.message });
    }
};

exports.updateName = async (req, res) => {
    const { name } = req.body;
    const { idUser } = req.params;

    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
        return res.status(401).send({ message: 'Authentication token not provided' });
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        if (decoded.idUser !== parseInt(idUser)) {
            return res.status(401).send({ message: 'User ID in token does not match provided ID' });
        }

        const user = await User.findOne({ where: { idUser } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.name = name;
        await user.save();

        return res.status(200).send({ message: 'Name updated successfully' });
    } catch (error) {
        console.error('Error updating name:', error);
        return res.status(500).send({ message: 'Server error' });
    }
};

exports.userData = async (req, res) => {
    const { idUser } = req.params;
    console.log('idUser received from URL:', idUser);

    const authToken = req.headers.authorization?.split(' ')[1];

    if (!authToken) {
        console.error('Authentication token not provided');
        return res.status(401).send({ message: 'Authentication token not provided' });
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        if (decoded.idUser !== parseInt(idUser)) {
            return res.status(401).send({ message: 'User ID in token does not match provided ID' });
        }

        const user = await User.findOne({ where: { idUser } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).send({ message: 'Server error' });
    }
};
