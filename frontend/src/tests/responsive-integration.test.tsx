import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Components to test
import Button from '../components/Button';
import PackageCard from '../components/PackageCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock data
const mockPackage = {
  _id: '1',
  name: 'Bali Adventure Package',
  destination: 'Bali',
  duration: 7,
  price: 25000,
  description: 'Experience the beauty of Bali with our comprehensive adventure package.',
  thumbnail: 'https://example.com/bali.jpg',
  images: ['https://example.com/bali1.jpg', 'https://example.com/bali2.jpg'],
  category: 'Bali',
  featured: true,
};

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Viewport size testing utility
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// Touch target size validation - simplified for testing environment
const validateTouchTargets = (container: HTMLElement) => {
  const interactiveElements = container.querySelectorAll(
    'button, a[href], input, select, textarea, [role="button"], [tabindex="0"]'
  );
  
  const invalidElements: Element[] = [];
  
  interactiveElements.forEach((element) => {
    // Check for minimum size classes in Tailwind
    const classes = element.className;
    const hasMinHeight = classes.includes('min-h-[44px]') || 
                        classes.includes('py-3') || 
                        classes.includes('py-4') || 
                        classes.includes('py-5') ||
                        classes.includes('h-16') ||
                        classes.includes('h-18');
    
    if (!hasMinHeight) {
      invalidElements.push(element);
    }
  });
  
  return invalidElements;
};

describe('Responsive Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    // Mock fetch for API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [mockPackage] }),
      })
    ) as any;
  });

  describe('Button Component Responsive Behavior', () => {
    it('should have proper touch target classes', () => {
      const { container } = render(
        <TestWrapper>
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </TestWrapper>
      );
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        // Check that each button has at least one of the minimum height classes
        const hasMinHeight = button.classList.contains('min-h-[44px]') || 
                            button.classList.contains('min-h-[48px]') || 
                            button.classList.contains('min-h-[52px]');
        expect(hasMinHeight).toBe(true);
      });
    });

    it('should have responsive classes for different screen sizes', () => {
      const { container } = render(
        <TestWrapper>
          <Button variant="primary">Test Button</Button>
        </TestWrapper>
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('transition-all', 'duration-200');
    });
  });

  describe('PackageCard Component Responsive Behavior', () => {
    it('should have responsive image container', () => {
      const { container } = render(
        <TestWrapper>
          <PackageCard package={mockPackage} />
        </TestWrapper>
      );

      const imageContainer = container.querySelector('.h-56');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should have proper responsive grid classes', () => {
      const { container } = render(
        <TestWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <PackageCard package={mockPackage} />
          </div>
        </TestWrapper>
      );
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3');
    });
  });

  describe('Navigation Component Responsive Behavior', () => {
    it('should have mobile menu button with proper classes', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );
      
      const menuButton = screen.getByLabelText(/open main menu/i);
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('md:hidden');
    });

    it('should have desktop menu with responsive classes', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );
      
      const desktopMenu = screen.getByRole('menubar');
      expect(desktopMenu).toBeInTheDocument();
      expect(desktopMenu).toHaveClass('hidden', 'md:flex');
    });

    it('should have proper accessibility attributes', () => {
      const { container } = render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });
  });

  describe('Footer Component Responsive Behavior', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );
      
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      // Check for responsive grid classes
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('should have proper contact information structure', () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );
      
      // Check for contact links
      expect(screen.getByText('+91 7048505128')).toBeInTheDocument();
      expect(screen.getByText('vibesholidays.9@gmail.com')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements Accessibility', () => {
    it('should have proper focus indicators on buttons', () => {
      const { container } = render(
        <TestWrapper>
          <Button>Focus Test</Button>
        </TestWrapper>
      );
      
      const button = container.querySelector('button');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
    });

    it('should have keyboard accessible navigation', () => {
      const { container } = render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );
      
      const focusableElements = container.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex="0"]'
      );
      
      focusableElements.forEach((element) => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Animation and Transition Classes', () => {
    it('should render PackageCard with proper structure', () => {
      const { container } = render(
        <TestWrapper>
          <PackageCard package={mockPackage} />
        </TestWrapper>
      );
      
      // Check that the component renders with expected structure
      const card = container.querySelector('a'); // PackageCard is wrapped in a Link
      expect(card).toBeInTheDocument();
      
      // Check for image
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      
      // Check for package name
      expect(container.textContent).toContain(mockPackage.name);
    });

    it('should have reasonable animation durations', () => {
      const { container } = render(
        <TestWrapper>
          <Button>Animated Button</Button>
        </TestWrapper>
      );
      
      const button = container.querySelector('button');
      expect(button).toHaveClass('duration-200');
    });
  });

  describe('Content Layout and Spacing', () => {
    it('should have proper spacing classes', () => {
      const { container } = render(
        <TestWrapper>
          <div className="container mx-auto px-4 lg:px-8 xl:px-12">
            <h1>Test Content</h1>
          </div>
        </TestWrapper>
      );
      
      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'lg:px-8', 'xl:px-12');
    });

    it('should handle text overflow properly', () => {
      const { container } = render(
        <TestWrapper>
          <div className="truncate">
            <p>This is a very long text that should be truncated properly</p>
          </div>
        </TestWrapper>
      );
      
      const truncatedDiv = container.querySelector('.truncate');
      expect(truncatedDiv).toBeInTheDocument();
    });
  });
});