import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('taskflow_token');
        const savedUser = localStorage.getItem('taskflow_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user: userData, token: jwt } = res.data.data;
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('taskflow_token', jwt);
        localStorage.setItem('taskflow_user', JSON.stringify(userData));
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { user: userData, token: jwt } = res.data.data;
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('taskflow_token', jwt);
        localStorage.setItem('taskflow_user', JSON.stringify(userData));
        return res.data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
