const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');
const { validateCreateTask, validateUpdateTask, validateTaskId } = require('../../middleware/validate');

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, validateCreateTask, taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks (admin sees all, user sees own)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, taskController.getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task retrieved
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticateToken, validateTaskId, taskController.getTaskById);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task (owner or admin)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticateToken, validateUpdateTask, taskController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task (admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task deleted
 *       403:
 *         description: Admin only
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), validateTaskId, taskController.deleteTask);

module.exports = router;
