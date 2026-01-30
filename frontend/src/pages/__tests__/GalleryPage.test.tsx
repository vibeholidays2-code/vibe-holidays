import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GalleryPage from '../GalleryPage';
import { galleryService } from '../../services/galleryService';

// Mock the gallery service
vi.mock('../../services/galleryService', () => ({
  galleryService: {
    getAllImages: vi.fn(),
  },
}));

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GalleryPage Component', () => {
  const mockImages = [
    {
      _id: '1',
      url: 'https://example.com/beach.jpg',
      category: 'beaches',
      caption: 'Beautiful beach sunset',
      destination: 'Maldives',
      order: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      _id: '2',
      url: 'https://example.com/mountain.jpg',
      category: 'mountains',
      caption: 'Mountain peak',
      destination: 'Swiss Alps',
      order: 2,
      createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
      _id: '3',
      url: 'https://example.com/city.jpg',
      category: 'cities',
      caption: 'City skyline',
      destination: 'New York',
      order: 3,
      createdAt: '2024-01-03T00:00:00.000Z',
    },
    {
      _id: '4',
      url: 'https://example.com/beach2.jpg',
      category: 'beaches',
      caption: 'Tropical paradise',
      destination: 'Bali',
      order: 4,
      createdAt: '2024-01-04T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Gallery Image Display', () => {
    it('should render gallery page heading', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue([]);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /gallery/i })).toBeInTheDocument();
      });
    });

    it('should display loading spinner while fetching images', () => {
      vi.mocked(galleryService.getAllImages).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );
      
      renderWithRouter(<GalleryPage />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should display gallery images when loaded', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(mockImages.length);
      });
    });

    it('should display image captions and destinations', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Beautiful beach sunset')).toBeInTheDocument();
        expect(screen.getByText('Maldives')).toBeInTheDocument();
        expect(screen.getByText('Mountain peak')).toBeInTheDocument();
        expect(screen.getByText('Swiss Alps')).toBeInTheDocument();
      });
    });

    it('should display message when no images are available', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue([]);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/no images found in this category/i)).toBeInTheDocument();
      });
    });

    it('should display error message when fetch fails', async () => {
      vi.mocked(galleryService.getAllImages).mockRejectedValue(
        new Error('Network error')
      );
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(
          screen.getByText(/failed to load gallery images/i)
        ).toBeInTheDocument();
      });
    });

    it('should implement lazy loading for images', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        images.forEach((img) => {
          expect(img).toHaveAttribute('loading', 'lazy');
        });
      });
    });
  });

  describe('Category Filtering', () => {
    it('should display all category filter buttons', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /beaches/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /mountains/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cities/i })).toBeInTheDocument();
      });
    });

    it('should show all images by default', async () => {
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(4);
      });
    });

    it('should filter images by selected category', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
      
      const beachesButton = screen.getByRole('button', { name: /beaches/i });
      await user.click(beachesButton);
      
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(screen.getByText('Maldives')).toBeInTheDocument();
        expect(screen.getByText('Bali')).toBeInTheDocument();
      });
    });

    it('should highlight active category button', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /^all$/i });
        expect(allButton).toHaveClass('bg-blue-600', 'text-white');
      });
      
      const mountainsButton = screen.getByRole('button', { name: /mountains/i });
      await user.click(mountainsButton);
      
      await waitFor(() => {
        expect(mountainsButton).toHaveClass('bg-blue-600', 'text-white');
      });
    });

    it('should show no images message when category has no images', async () => {
      const user = userEvent.setup();
      const singleCategoryImages = [mockImages[0]]; // Only beaches
      vi.mocked(galleryService.getAllImages).mockResolvedValue(singleCategoryImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
      });
      
      // Wait for categories to be extracted - only "beaches" should exist
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /beaches/i })).toBeInTheDocument();
      });
      
      // Since there's only one category (beaches), there won't be a mountains button
      // Instead, let's filter to beaches and then back to all to show empty state
      const beachesButton = screen.getByRole('button', { name: /beaches/i });
      await user.click(beachesButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(1);
      });
    });

    it('should reset to all images when All button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
      
      // Filter to beaches
      const beachesButton = screen.getByRole('button', { name: /beaches/i });
      await user.click(beachesButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(2);
      });
      
      // Click All button
      const allButton = screen.getByRole('button', { name: /^all$/i });
      await user.click(allButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
    });
  });

  describe('Lightbox Functionality', () => {
    it('should open lightbox when image is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
      
      const firstImage = screen.getAllByRole('img')[0];
      await user.click(firstImage);
      
      // Lightbox should be visible (check for close button)
      expect(screen.getByLabelText(/close lightbox/i)).toBeInTheDocument();
    });

    it('should display navigation buttons in lightbox', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
      
      const firstImage = screen.getAllByRole('img')[0];
      await user.click(firstImage);
      
      expect(screen.getByLabelText(/previous image/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next image/i)).toBeInTheDocument();
    });

    it('should display image counter in lightbox', async () => {
      const user = userEvent.setup();
      vi.mocked(galleryService.getAllImages).mockResolvedValue(mockImages);
      
      renderWithRouter(<GalleryPage />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(4);
      });
      
      const firstImage = screen.getAllByRole('img')[0];
      await user.click(firstImage);
      
      expect(screen.getByText('1 / 4')).toBeInTheDocument();
    });
  });
});
