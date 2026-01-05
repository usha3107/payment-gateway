import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div style={{
            width: '250px',
            background: '#2c3e50',
            color: 'white',
            padding: '20px'
        }}>
            <h2>Gateway</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                <Link to="/dashboard/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
                <button onClick={() => {
                    localStorage.removeItem('merchant_email');
                    window.location.href = '/login';
                }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                    Logout
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
