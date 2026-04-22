import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import ProductDescription from './pages/ProductDescription';
import Offers from './pages/Offers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminRoute ? 'min-h-screen bg-[#0b0d10]' : 'min-h-screen bg-gray-50'}>
      {!isAdminRoute ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/:id/description" element={<ProductDescription />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminRoute ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
