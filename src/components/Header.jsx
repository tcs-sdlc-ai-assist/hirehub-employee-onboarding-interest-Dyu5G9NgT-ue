import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('hirehub_admin_auth') === 'true'
  );

  useEffect(() => {
    const authStatus = sessionStorage.getItem('hirehub_admin_auth') === 'true';
    setIsAuthenticated(authStatus);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('hirehub_admin_auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/admin');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#2563eb' : '#374151',
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
    fontSize: '0.95rem',
  });

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          HireHub
        </Link>
        <nav style={styles.nav}>
          <NavLink to="/" end style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/apply" style={navLinkStyle}>
            Apply
          </NavLink>
          <NavLink to="/admin" style={navLinkStyle}>
            Admin
          </NavLink>
        </nav>
        <div style={styles.authSection}>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              style={styles.loginButton}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    width: '100%',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '64px',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#2563eb',
    textDecoration: 'none',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Header;