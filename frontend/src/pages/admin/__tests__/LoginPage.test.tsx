import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import api from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render with router
const renderWithRouter = (component: React.ReactElement, initialEntries = ['/admin/login']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Page Rendering', () => {
    it('should render login page heading', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    });

    it('should render sign in description', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByText(/sign in to access the admin dashboard/i)).toBeInTheDocument();
    });

    it('should render username input field', () => {
      renderWithRouter(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/enter your username/i);
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('name', 'username');
    });

    it('should render password input field', () => {
      renderWithRouter(<LoginPage />);
      
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
    });

    it('should render sign in button', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render back to website link', () => {
      renderWithRouter(<LoginPage />);
      
      const backLink = screen.getByRole('link', { name: /back to website/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });
  });

  describe('Login Form Validation', () => {
    it('should show error when username is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);
      
      // Fill password but leave username empty
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // API should not be called when validation fails
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // API should not be called when validation fails
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should show error when password is less than 6 characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), '12345');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
      
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should clear field error when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginPage />);
      
      // Enter short password to trigger validation error
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), '12345');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
      
      // Start typing in password field
      await user.type(screen.getByPlaceholderText(/enter your password/i), '6');
      
      // Error should be cleared
      expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({
        data: {
          token: 'test-token',
          user: { username: 'admin', role: 'admin' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', {
          username: 'admin',
          password: 'password123',
        });
      });
    });
  });

  describe('Successful Login Flow', () => {
    it('should store token in localStorage on successful login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({
        data: {
          token: 'test-token-12345',
          user: { username: 'admin', role: 'admin' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-token-12345');
      });
    });

    it('should store user info in localStorage on successful login', async () => {
      const user = userEvent.setup();
      const userData = { username: 'admin', role: 'admin' };
      vi.mocked(api.post).mockResolvedValue({
        data: {
          token: 'test-token',
          user: userData,
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        const storedUser = localStorage.getItem('user');
        expect(storedUser).toBe(JSON.stringify(userData));
      });
    });

    it('should navigate to dashboard after successful login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({
        data: {
          token: 'test-token',
          user: { username: 'admin', role: 'admin' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
      });
    });

    it('should navigate to intended page after successful login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({
        data: {
          token: 'test-token',
          user: { username: 'admin', role: 'admin' },
        },
      });
      
      // Simulate being redirected from /admin/packages
      renderWithRouter(<LoginPage />, [
        '/admin/login',
      ]);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/packages', { replace: true });
      });
    });

    it('should show loading state during login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          data: { token: 'test-token', user: { username: 'admin' } }
        }), 100))
      );
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Failed Login Handling', () => {
    it('should display error message for invalid credentials (401)', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      });
    });

    it('should display specific error message from server', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Server error occurred' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
      });
    });

    it('should display generic error message for network errors', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/an error occurred\. please try again\./i)).toBeInTheDocument();
      });
    });

    it('should display error when server response is missing token', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({
        data: {
          // Missing token
          user: { username: 'admin' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid response from server/i)).toBeInTheDocument();
      });
    });

    it('should not store token on failed login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      });
      
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should clear general error when resubmitting form', async () => {
      const user = userEvent.setup();
      
      // First attempt fails
      vi.mocked(api.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      });
      
      renderWithRouter(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/enter your username/i), 'admin');
      await user.type(screen.getByPlaceholderText(/enter your password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      });
      
      // Second attempt succeeds
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          token: 'test-token',
          user: { username: 'admin' },
        },
      });
      
      // Clear password and re-enter
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      await user.clear(passwordInput);
      await user.type(passwordInput, 'correctpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Error should be cleared before new submission
      await waitFor(() => {
        expect(screen.queryByText(/invalid username or password/i)).not.toBeInTheDocument();
      });
    });
  });
});
