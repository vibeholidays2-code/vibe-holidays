import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Mock reviewService to avoid real API calls
vi.mock('../../services/reviewService', () => ({
  reviewService: {
    getApprovedReviews: vi.fn(() => Promise.resolve([])),
    createReview: vi.fn(() => Promise.resolve({})),
  },
}));

// Mock heavy 3D & UI components that require browser APIs not in jsdom
vi.mock('../../components/FloatingGlobe3D', () => ({ default: () => <div data-testid="globe-3d" /> }));
vi.mock('../../components/HeroModern', () => ({
  default: ({ featuredPackages: _fp }: any) => (
    <section>
      <h1>Discover Your Next Adventure</h1>
      <p>Create Unforgettable Memories with Vibe Holidays</p>
      <a href="/packages">Explore Packages</a>
      <a href="/contact">Contact Us</a>
    </section>
  ),
}));
vi.mock('../../components/WhyChooseUs', () => ({ default: () => <div data-testid="why-choose-us" /> }));
vi.mock('../../components/SEO', () => ({ default: () => null }));
vi.mock('../../components/LoadingSpinner', () => ({
  InlineLoader: ({ text }: any) => <div>{text || 'Loading featured packages...'}</div>,
}));
vi.mock('../../components/SkeletonLoader', () => ({
  SkeletonPackageCard: () => <div data-testid="skeleton-card" />,
}));
vi.mock('../../components/InquiryModal', () => ({ default: () => null }));


// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    globalThis.fetch = vi.fn() as any;
  });

  describe('Hero Section Rendering', () => {
    it('should render hero section with main heading', () => {
      renderWithRouter(<HomePage />);

      const heading = screen.getByRole('heading', { name: /discover your next adventure/i });
      expect(heading).toBeInTheDocument();
    });

    it('should render hero section with tagline', () => {
      renderWithRouter(<HomePage />);

      const tagline = screen.getByText(/create unforgettable memories with vibe holidays/i);
      expect(tagline).toBeInTheDocument();
    });

    it('should render Explore Packages button in hero section', () => {
      renderWithRouter(<HomePage />);

      const exploreButton = screen.getByRole('link', { name: /explore packages/i });
      expect(exploreButton).toBeInTheDocument();
      expect(exploreButton).toHaveAttribute('href', '/packages');
    });

    it('should render Contact Us button in hero section', () => {
      renderWithRouter(<HomePage />);

      const contactButton = screen.getByRole('link', { name: /contact us/i });
      expect(contactButton).toBeInTheDocument();
      expect(contactButton).toHaveAttribute('href', '/contact');
    });

    it('should render hero section with background styling', () => {
      const { container } = renderWithRouter(<HomePage />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveClass('relative', 'h-[600px]');
    });
  });

  describe('Featured Packages Display', () => {
    it('should render featured packages section heading', () => {
      renderWithRouter(<HomePage />);

      const heading = screen.getByRole('heading', { name: /featured holiday packages/i });
      expect(heading).toBeInTheDocument();
    });

    it('should show loading message when packages are being fetched', () => {
      // Mock fetch to never resolve
      globalThis.fetch = vi.fn(() => new Promise(() => { })) as any;

      renderWithRouter(<HomePage />);

      expect(screen.getByText(/loading featured packages/i)).toBeInTheDocument();
    });

    it('should fetch featured packages on mount', async () => {
      const mockPackages = [
        {
          _id: '1',
          name: 'Bali Adventure',
          destination: 'Bali, Indonesia',
          duration: 7,
          price: 1200,
          description: 'Explore the beautiful island of Bali',
          images: ['https://example.com/bali.jpg'],
        },
      ];

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ packages: mockPackages }),
        } as Response)
      ) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/packages?featured=true&limit=6')
        );
      });
    });

    it('should display featured packages when data is loaded', async () => {
      const mockPackages = [
        {
          _id: '1',
          name: 'Bali Adventure',
          destination: 'Bali, Indonesia',
          duration: 7,
          price: 1200,
          description: 'Explore the beautiful island of Bali',
          images: ['https://example.com/bali.jpg'],
        },
        {
          _id: '2',
          name: 'Paris Getaway',
          destination: 'Paris, France',
          duration: 5,
          price: 1800,
          description: 'Experience the city of lights',
          images: ['https://example.com/paris.jpg'],
        },
      ];

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ packages: mockPackages }),
        } as Response)
      ) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
        expect(screen.getByText('Paris Getaway')).toBeInTheDocument();
      });
    });

    it('should display package details correctly', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Bali Adventure',
        destination: 'Bali, Indonesia',
        duration: 7,
        price: 1200,
        description: 'Explore the beautiful island of Bali',
        images: ['https://example.com/bali.jpg'],
      };

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ packages: [mockPackage] }),
        } as Response)
      ) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
        expect(screen.getByText('Bali, Indonesia')).toBeInTheDocument();
        expect(screen.getByText('7 days')).toBeInTheDocument();
        expect(screen.getByText('$1200')).toBeInTheDocument();
        expect(screen.getByText(/explore the beautiful island of bali/i)).toBeInTheDocument();
      });
    });

    it('should render View Details button for each package', async () => {
      const mockPackages = [
        {
          _id: '1',
          name: 'Bali Adventure',
          destination: 'Bali, Indonesia',
          duration: 7,
          price: 1200,
          description: 'Explore the beautiful island of Bali',
          images: ['https://example.com/bali.jpg'],
        },
      ];

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ packages: mockPackages }),
        } as Response)
      ) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('link', { name: /view details/i });
        expect(viewDetailsButtons.length).toBeGreaterThan(0);
        expect(viewDetailsButtons[0]).toHaveAttribute('href', '/packages/1');
      });
    });

    it('should render View All Packages button', async () => {
      const mockPackages = [
        {
          _id: '1',
          name: 'Bali Adventure',
          destination: 'Bali, Indonesia',
          duration: 7,
          price: 1200,
          description: 'Explore the beautiful island of Bali',
          images: ['https://example.com/bali.jpg'],
        },
      ];

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ packages: mockPackages }),
        } as Response)
      ) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        const viewAllButton = screen.getByRole('link', { name: /view all packages/i });
        expect(viewAllButton).toBeInTheDocument();
        expect(viewAllButton).toHaveAttribute('href', '/packages');
      });
    });

    it('should handle fetch error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;

      renderWithRouter(<HomePage />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        // Should still show loading message when error occurs
        expect(screen.getByText(/loading featured packages/i)).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
