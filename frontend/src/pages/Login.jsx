import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // For D1, simple email check or test auth.
    // "Use these exact credentials... Email: test@example.com, Password: Any".
    // "The dashboard should display the merchant's API credentials after login."
    // So I'll fetch the test merchant details from the API.

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // In D1, just verifying email against test merchant or allowing any.
            // Spec says: "you can implement simple email-based authentication"
            // I will just save the email to localStorage and redirect.
            // BUT I need to show API keys in Dashboard, so I need to know WHO logged in.
            // I'll fetch test merchant to verify.
            if (email === 'test@example.com') {
                localStorage.setItem('merchant_email', email);
                navigate('/dashboard');
            } else {
                alert('Invalid credentials (use test@example.com)');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form data-test-id="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <h2>Login</h2>
                <input
                    data-test-id="email-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    data-test-id="password-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button data-test-id="login-button" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
