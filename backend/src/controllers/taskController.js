const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskService.createTask(req.user.id, { title, description, status });
        res.status(201).json({ success: true, message: 'Task created successfully.', data: task });
    } catch (error) {
        next(error);
    }
};

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getAllTasks(req.user);
        res.status(200).json({ success: true, message: 'Tasks retrieved successfully.', data: tasks });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Task retrieved successfully.', data: task });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskService.updateTask(req.params.id, req.user, { title, description, status });
        res.status(200).json({ success: true, message: 'Task updated successfully.', data: task });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
