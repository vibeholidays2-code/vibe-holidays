import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../Navbar';

// Mock useLocation hook
const mockLocation = { pathname: '/' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  describe('Logo and Branding', () => {
    it('renders enhanced logo with gradient styling', () => {
      renderNavbar();
      
      const logoLink = screen.getByLabelText('Vibes Holidays - Go to homepage');
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveClass('group', 'transition-all', 'duration-200', 'ease-in-out-smooth');
      
      const logoText = screen.getByText('Vibes Holidays');
      expect(logoText).toHaveClass('bg-gradient-primary', 'bg-clip-text', 'text-transparent');
      
      const logoIcon = screen.getByText('V');
      expect(logoIcon).toHaveClass('text-white', 'font-bold');
    });

    it('applies hover effects to logo', () => {
      renderNavbar();
      
      const logoLink = screen.getByLabelText('Vibes Holidays - Go to homepage');
      expect(logoLink).toHaveClass('hover:-translate-y-0.5');
    });
  });

  describe('Desktop Navigation', () => {
    it('renders all navigation links with enhanced styling', () => {
      renderNavbar();
      
      const menubar = screen.getByRole('menubar');
      const navLinks = ['Home', 'Packages', 'Gallery', 'About', 'Contact'];
      
      navLinks.forEach(linkText => {
        const link = within(menubar).getByRole('menuitem', { name: linkText });
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('transition-all', 'duration-200', 'ease-in-out-smooth');
      });
    });

    it('highlights active page with proper styling', () => {
      mockLocation.pathname = '/';
      renderNavbar();
      
      const menubar = screen.getByRole('menubar');
      const homeLink = within(menubar).getByRole('menuitem', { name: 'Home' });
      expect(homeLink).toHaveClass('text-primary-600', 'bg-primary-50', 'border-primary-600');
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies hover effects to inactive navigation links', () => {
      renderNavbar();
      
      const menubar = screen.getByRole('menubar');
      const packagesLink = within(menubar).getByRole('menuitem', { name: 'Packages' });
      expect(packagesLink).toHaveClass('hover:text-primary-600', 'hover:bg-primary-50/50');
    });

    it('includes gradient underline animation', () => {
      renderNavbar();
      
      const menubar = screen.getByRole('menubar');
      const homeLink = within(menubar).getByRole('menuitem', { name: 'Home' });
      const underline = homeLink.querySelector('span');
      expect(underline).toHaveClass('bg-gradient-primary', 'transition-transform', 'duration-200');
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu button with enhanced styling', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('rounded-xl', 'transition-all', 'duration-200', 'ease-in-out-smooth');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('toggles mobile menu visibility with smooth transitions', async () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      const mobileMenu = screen.getByRole('menu');
      
      // Initially closed
      expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100');
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByLabelText('Close main menu')).toBeInTheDocument();
      });
    });

    it('renders mobile navigation links with enhanced styling', async () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('menu');
        expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100');
        
        // Check mobile-specific styling for one link
        const mobileHomeLink = within(mobileMenu).getByRole('menuitem', { name: 'Home' });
        expect(mobileHomeLink).toHaveClass('rounded-xl', 'transition-all', 'duration-200');
      });
    });

    it('closes mobile menu when link is clicked', async () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('menu');
        expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100');
      });
      
      // Click a mobile menu link
      const mobileMenu = screen.getByRole('menu');
      const mobilePackagesLink = within(mobileMenu).getByRole('menuitem', { name: 'Packages' });
      
      fireEvent.click(mobilePackagesLink);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('menu');
        expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0');
      });
    });

    it('includes animated hamburger menu icon', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      const hamburgerLines = menuButton.querySelectorAll('span:not(.sr-only)');
      
      expect(hamburgerLines).toHaveLength(3);
      hamburgerLines.forEach(line => {
        expect(line).toHaveClass('transition-all', 'duration-300', 'ease-in-out-smooth');
      });
    });
  });

  describe('Accessibility', () => {
    it('includes proper ARIA attributes', () => {
      renderNavbar();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      const menubar = screen.getByRole('menubar');
      expect(menubar).toBeInTheDocument();
      
      const mobileMenu = screen.getByRole('menu');
      expect(mobileMenu).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('provides proper screen reader text', () => {
      renderNavbar();
      
      expect(screen.getByText('Open main menu')).toHaveClass('sr-only');
    });

    it('updates aria-expanded correctly', async () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Professional Styling', () => {
    it('applies backdrop blur and enhanced shadows', () => {
      renderNavbar();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('bg-white/95', 'backdrop-blur-sm', 'shadow-soft');
    });

    it('includes proper focus states', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toHaveClass('focus:ring-2', 'focus:ring-primary-500', 'focus:ring-offset-2');
    });

    it('uses professional color palette', () => {
      renderNavbar();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('border-neutral-100');
      
      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toHaveClass('text-neutral-700', 'hover:text-primary-600', 'hover:bg-primary-50');
    });
  });
});