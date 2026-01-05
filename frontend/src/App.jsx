import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Sidebar from './components/Sidebar';
import { useState } from 'react';

// Simple Auth Context Logic prop drilling for brevity in D1
// In a real app we'd use Context API
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('merchant_email');
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
};

// Layout with Sidebar for Dashboard pages
const DashboardLayout = ({ children }) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>{children}</div>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/transactions" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Transactions />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
