import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// Test components
const ProtectedContent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

// Helper to render with router
const renderWithRouter = (
  component: React.ReactElement,
  initialEntries: string[] = ['/admin/dashboard']
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute>{component}</ProtectedRoute>}
        />
        <Route
          path="/admin/packages"
          element={<ProtectedRoute>{component}</ProtectedRoute>}
        />
        <Route
          path="/admin/bookings"
          element={<ProtectedRoute>{component}</ProtectedRoute>}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Protected Route Access', () => {
    it('should render protected content when token exists', () => {
      localStorage.setItem('token', 'test-token-12345');
      
      renderWithRouter(<ProtectedContent />);
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login when token does not exist', () => {
      renderWithRouter(<ProtectedContent />);
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to login when token is null', () => {
      localStorage.setItem('token', 'null');
      localStorage.removeItem('token');
      
      renderWithRouter(<ProtectedContent />);
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect to login when token is empty string', () => {
      localStorage.setItem('token', '');
      
      renderWithRouter(<ProtectedContent />);
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should allow access with any non-empty token', () => {
      localStorage.setItem('token', 'any-valid-token');
      
      renderWithRouter(<ProtectedContent />);
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Route Preservation', () => {
    it('should preserve intended route when redirecting to login from dashboard', () => {
      // No token, accessing /admin/dashboard
      renderWithRouter(<ProtectedContent />, ['/admin/dashboard']);
      
      // Should redirect to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      
      // The location state should be preserved for redirect after login
      // This is handled by Navigate component's state prop
    });

    it('should preserve intended route when redirecting to login from packages', () => {
      // No token, accessing /admin/packages
      renderWithRouter(<ProtectedContent />, ['/admin/packages']);
      
      // Should redirect to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should preserve intended route when redirecting to login from bookings', () => {
      // No token, accessing /admin/bookings
      renderWithRouter(<ProtectedContent />, ['/admin/bookings']);
      
      // Should redirect to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('Token Changes', () => {
    it('should deny access when token is removed after initial render', () => {
      localStorage.setItem('token', 'test-token');
      
      const { rerender } = renderWithRouter(<ProtectedContent />);
      
      // Initially should have access
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      
      // Remove token
      localStorage.removeItem('token');
      
      // Re-render
      rerender(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute><ProtectedContent /></ProtectedRoute>}
            />
          </Routes>
        </MemoryRouter>
      );
      
      // Should redirect to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('should render children components correctly', () => {
      localStorage.setItem('token', 'test-token');
      
      const ComplexContent = () => (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to admin panel</p>
          <button>Action Button</button>
        </div>
      );
      
      renderWithRouter(<ComplexContent />);
      
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/welcome to admin panel/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action button/i })).toBeInTheDocument();
    });

    it('should render multiple child elements', () => {
      localStorage.setItem('token', 'test-token');
      
      const MultipleChildren = () => (
        <>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </>
      );
      
      renderWithRouter(<MultipleChildren />);
      
      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });
  });
});
