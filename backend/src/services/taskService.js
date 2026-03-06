const prisma = require('../config/db');

const createTask = async (userId, { title, description, status }) => {
    const task = await prisma.task.create({
        data: { title, description: description || null, status: status || 'pending', userId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    return task;
};

const getAllTasks = async (user) => {
    const where = user.role === 'admin' ? {} : { userId: user.id };
    const tasks = await prisma.task.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
    });
    return tasks;
};

const getTaskById = async (taskId, user) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!task) {
        const error = new Error('Task not found.');
        error.statusCode = 404;
        throw error;
    }

    if (task.userId !== user.id && user.role !== 'admin') {
        const error = new Error('Access denied.');
        error.statusCode = 403;
        throw error;
    }

    return task;
};

const updateTask = async (taskId, user, updateData) => {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

    if (!existingTask) {
        const error = new Error('Task not found.');
        error.statusCode = 404;
        throw error;
    }

    if (existingTask.userId !== user.id && user.role !== 'admin') {
        const error = new Error('Access denied.');
        error.statusCode = 403;
        throw error;
    }

    const data = {};
    if (updateData.title !== undefined) data.title = updateData.title;
    if (updateData.description !== undefined) data.description = updateData.description;
    if (updateData.status !== undefined) data.status = updateData.status;

    const task = await prisma.task.update({
        where: { id: taskId },
        data,
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    return task;
};

const deleteTask = async (taskId) => {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask) {
        const error = new Error('Task not found.');
        error.statusCode = 404;
        throw error;
    }
    await prisma.task.delete({ where: { id: taskId } });
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
