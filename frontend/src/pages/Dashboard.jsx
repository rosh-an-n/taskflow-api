import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        try {
            setLoadingTasks(true);
            const res = await api.get('/tasks');
            setTasks(res.data.data);
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to fetch tasks.');
        } finally {
            setLoadingTasks(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated, fetchTasks]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleCreate = async (taskData) => {
        try {
            setCreating(true);
            await api.post('/tasks', taskData);
            showMessage('success', 'Task created successfully!');
            fetchTasks();
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to create task.');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdate = async (id, updateData) => {
        try {
            await api.put(`/tasks/${id}`, updateData);
            showMessage('success', 'Task updated successfully!');
            fetchTasks();
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to update task.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            showMessage('success', 'Task deleted successfully!');
            fetchTasks();
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to delete task.');
        }
    };

    if (authLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const stats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
    };

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>👋 Hello, {user?.name}</h1>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                {/* Stats */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value" style={{ color: '#ffb347' }}>{stats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value" style={{ color: '#4fc3f7' }}>{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value" style={{ color: '#00d4aa' }}>{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                {/* Create Task */}
                <TaskForm onSubmit={handleCreate} loading={creating} />

                {/* Task List */}
                <div className="task-list-section">
                    <h2>📋 Your Tasks</h2>
                    {loadingTasks ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="task-empty">
                            <span className="empty-icon">📝</span>
                            No tasks yet. Create your first task above!
                        </div>
                    ) : (
                        <div className="task-list">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
