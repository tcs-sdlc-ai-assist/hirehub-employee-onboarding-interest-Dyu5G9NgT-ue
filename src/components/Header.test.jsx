import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderHeader(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders the HireHub logo linking to /', () => {
    renderHeader();
    const logo = screen.getByText('HireHub');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders all nav links: Home, Apply, Admin', () => {
    renderHeader();
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');

    const applyLink = screen.getByText('Apply');
    expect(applyLink).toBeInTheDocument();
    expect(applyLink.closest('a')).toHaveAttribute('href', '/apply');

    const adminLink = screen.getByText('Admin');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest('a')).toHaveAttribute('href', '/admin');
  });

  it('shows Login button when not authenticated', () => {
    renderHeader();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows Logout button when authenticated', () => {
    sessionStorage.setItem('hirehub_admin_auth', 'true');
    renderHeader();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('clicking Login navigates to /admin', async () => {
    const user = userEvent.setup();
    renderHeader();
    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('clicking Logout clears sessionStorage and navigates to /', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('hirehub_admin_auth', 'true');
    renderHeader();
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    expect(sessionStorage.getItem('hirehub_admin_auth')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows Login button after logout', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('hirehub_admin_auth', 'true');
    renderHeader();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    await user.click(screen.getByText('Logout'));
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});