import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/checkout" element={<Checkout />} />
                {/* Redirect root to checkout? Or 404. Spec says /checkout?order_id=... */}
            </Routes>
        </Router>
    );
}

export default App;
