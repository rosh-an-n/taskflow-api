import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

export default function TaskCard({ task, onUpdate, onDelete }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        status: task.status,
    });

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.id === task.userId;
    const canEdit = isOwner || isAdmin;

    const handleSave = (e) => {
        e.preventDefault();
        onUpdate(task.id, editData);
        setEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            title: task.title,
            description: task.description || '',
            status: task.status,
        });
        setEditing(false);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (editing) {
        return (
            <div className="task-card">
                <form className="edit-form" onSubmit={handleSave}>
                    <div className="edit-form-row">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-input"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input
                            className="form-input"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Optional description..."
                        />
                    </div>
                    <div className="edit-form-actions">
                        <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="task-card">
            <div className="task-card-header">
                <div className="task-card-title">{task.title}</div>
                <div className="task-card-actions">
                    {canEdit && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
                            ✏️ Edit
                        </button>
                    )}
                    {isAdmin && (
                        <button className="btn btn-ghost btn-sm" onClick={() => onDelete(task.id)}>
                            🗑️
                        </button>
                    )}
                </div>
            </div>
            {task.description && (
                <div className="task-card-body">{task.description}</div>
            )}
            <div className="task-card-footer">
                <span className={`status-badge status-${task.status}`}>
                    {STATUS_LABELS[task.status]}
                </span>
                <div className="task-card-meta">
                    {task.user && <span>by {task.user.name} • </span>}
                    {formatDate(task.createdAt)}
                </div>
            </div>
        </div>
    );
}
