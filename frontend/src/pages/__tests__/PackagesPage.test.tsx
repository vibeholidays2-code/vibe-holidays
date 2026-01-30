import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PackagesPage from '../PackagesPage';
import { packageService } from '../../services/packageService';
import { Package } from '../../types/package';

// Mock the package service
vi.mock('../../services/packageService', () => ({
  packageService: {
    getPackages: vi.fn(),
  },
}));

// Helper to render with router and query client
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

const mockPackage: Package = {
  _id: '1',
  name: 'Bali Adventure',
  destination: 'Bali',
  duration: 7,
  price: 1200,
  description: 'Explore the beautiful island of Bali',
  itinerary: ['Day 1: Arrival', 'Day 2: Beach'],
  inclusions: ['Hotel', 'Meals'],
  exclusions: ['Flights'],
  images: ['https://example.com/bali.jpg'],
  featured: true,
  active: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('PackagesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Package Card Rendering', () => {
    it('should render package cards with all key information', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
        expect(screen.getByText('Bali')).toBeInTheDocument();
        expect(screen.getByText('7 days')).toBeInTheDocument();
        expect(screen.getByText('$1,200')).toBeInTheDocument();
      });
    });

    it('should render multiple package cards', async () => {
      const mockPackages = [
        { ...mockPackage, _id: '1', name: 'Bali Adventure' },
        { ...mockPackage, _id: '2', name: 'Paris Getaway', destination: 'Paris' },
        { ...mockPackage, _id: '3', name: 'Tokyo Tour', destination: 'Tokyo' },
      ];

      const mockResponse = {
        success: true,
        data: mockPackages,
        pagination: { page: 1, limit: 9, total: 3, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
        expect(screen.getByText('Paris Getaway')).toBeInTheDocument();
        expect(screen.getByText('Tokyo Tour')).toBeInTheDocument();
      });
    });

    it('should display featured badge on featured packages', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Featured')).toBeInTheDocument();
      });
    });

    it('should render package description', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText(/explore the beautiful island of bali/i)).toBeInTheDocument();
      });
    });
  });

  describe('Filter Application', () => {
    it('should apply destination filter', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      const destinationInput = screen.getByPlaceholderText('e.g., Bali');
      fireEvent.change(destinationInput, { target: { value: 'Bali' } });

      await waitFor(() => {
        expect(packageService.getPackages).toHaveBeenCalledWith(
          expect.objectContaining({ destination: 'Bali' })
        );
      });
    });

    it('should apply price range filter', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      const minPriceInput = screen.getAllByPlaceholderText('Min')[0];
      const maxPriceInput = screen.getAllByPlaceholderText('Max')[0];

      fireEvent.change(minPriceInput, { target: { value: '1000' } });
      fireEvent.change(maxPriceInput, { target: { value: '2000' } });

      await waitFor(() => {
        expect(packageService.getPackages).toHaveBeenCalledWith(
          expect.objectContaining({ minPrice: 1000, maxPrice: 2000 })
        );
      });
    });

    it('should apply duration filter', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      const minDurationInput = screen.getAllByPlaceholderText('Min')[1];
      const maxDurationInput = screen.getAllByPlaceholderText('Max')[1];

      fireEvent.change(minDurationInput, { target: { value: '5' } });
      fireEvent.change(maxDurationInput, { target: { value: '10' } });

      await waitFor(() => {
        expect(packageService.getPackages).toHaveBeenCalledWith(
          expect.objectContaining({ minDuration: 5, maxDuration: 10 })
        );
      });
    });

    it('should apply featured filter', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      const featuredCheckbox = screen.getByRole('checkbox', { name: /featured only/i });
      fireEvent.click(featuredCheckbox);

      await waitFor(() => {
        expect(packageService.getPackages).toHaveBeenCalledWith(
          expect.objectContaining({ featured: true })
        );
      });
    });

    it('should clear all filters when Clear All is clicked', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      // Apply some filters
      const destinationInput = screen.getByPlaceholderText('e.g., Bali');
      fireEvent.change(destinationInput, { target: { value: 'Bali' } });

      // Clear filters
      const clearButton = screen.getByRole('button', { name: /clear all/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(destinationInput).toHaveValue('');
      });
    });

    it('should reset to page 1 when filters change', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 20, pages: 3 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      // Change filter
      const destinationInput = screen.getByPlaceholderText('e.g., Bali');
      fireEvent.change(destinationInput, { target: { value: 'Paris' } });

      await waitFor(() => {
        expect(packageService.getPackages).toHaveBeenCalledWith(
          expect.objectContaining({ page: 1, destination: 'Paris' })
        );
      });
    });
  });

  describe('Search Functionality', () => {
    it('should render search input', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search packages...')).toBeInTheDocument();
      });
    });

    it('should update search input value', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search packages...');
      fireEvent.change(searchInput, { target: { value: 'adventure' } });

      expect(searchInput).toHaveValue('adventure');
    });
  });

  describe('Loading and Error States', () => {
    it('should show error message when fetch fails', async () => {
      vi.mocked(packageService.getPackages).mockRejectedValue(
        new Error('Network error')
      );

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load packages/i)).toBeInTheDocument();
      });
    });

    it('should show no results message when no packages match filters', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: { page: 1, limit: 9, total: 0, pages: 0 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText(/no packages found/i)).toBeInTheDocument();
      });
    });

    it('should display results count', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 15, pages: 2 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByText(/showing 1 of 15 packages/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination when multiple pages exist', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 30, pages: 4 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      });
    });

    it('should disable Previous button on first page', async () => {
      const mockResponse = {
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 9, total: 30, pages: 4 },
      };

      vi.mocked(packageService.getPackages).mockResolvedValue(mockResponse);

      renderWithProviders(<PackagesPage />);

      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: 'Previous' });
        expect(prevButton).toBeDisabled();
      });
    });
  });
});
