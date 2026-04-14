import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import AdminLogin from './AdminLogin';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('hirehub_admin_auth') === 'true'
  );

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('hirehub_admin_auth');
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (typeof children === 'function') {
    return children({ onLogout: handleLogout });
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default ProtectedRoute;