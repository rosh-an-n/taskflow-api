const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const config = require('../config/env');

const register = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('A user with this email already exists.');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: 'user' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    return { user, token };
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

module.exports = { register, login };
