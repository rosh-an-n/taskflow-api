import { useState } from 'react';

export default function TaskForm({ onSubmit, loading }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
    };

    return (
        <div className="task-form-section">
            <h2>✨ Create New Task</h2>
            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="task-title">Title</label>
                    <input
                        id="task-title"
                        className="form-input"
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="task-desc">Description</label>
                    <input
                        id="task-desc"
                        className="form-input"
                        type="text"
                        placeholder="Optional details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading || !title.trim()}>
                    {loading ? 'Creating...' : '+ Add Task'}
                </button>
            </form>
        </div>
    );
}
