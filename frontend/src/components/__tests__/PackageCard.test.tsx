import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PackageCard from '../PackageCard';
import { Package } from '../../types/package';

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockPackage: Package = {
  _id: '1',
  name: 'Bali Adventure',
  destination: 'Bali, Indonesia',
  duration: 7,
  price: 1200,
  description: 'Explore the beautiful island of Bali with pristine beaches and rich culture.',
  itinerary: ['Day 1: Arrival', 'Day 2: Beach'],
  inclusions: ['Hotel', 'Meals'],
  exclusions: ['Flights'],
  images: ['https://example.com/bali.jpg'],
  thumbnail: 'https://example.com/bali-thumb.jpg',
  featured: true,
  active: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('PackageCard Component', () => {
  describe('Package Card Rendering', () => {
    it('should render package name', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
    });

    it('should render package destination', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('Bali, Indonesia')).toBeInTheDocument();
    });

    it('should render package duration', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('7 days')).toBeInTheDocument();
    });

    it('should render package price with rupee symbol', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      // Check for the main price display (larger text)
      const priceElements = screen.getAllByText('₹1,200');
      const mainPrice = priceElements.find(el => el.classList.contains('text-2xl'));
      expect(mainPrice).toBeInTheDocument();
      expect(mainPrice).toHaveClass('text-2xl');
    });

    it('should render package description', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText(/explore the beautiful island of bali/i)).toBeInTheDocument();
    });

    it('should render package image', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const image = screen.getByAltText('Bali Adventure');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/bali-thumb.jpg');
    });

    it('should use first image when thumbnail is not available', () => {
      const packageWithoutThumbnail = { ...mockPackage, thumbnail: undefined };
      renderWithRouter(<PackageCard package={packageWithoutThumbnail} />);
      
      const image = screen.getByAltText('Bali Adventure');
      expect(image).toHaveAttribute('src', 'https://example.com/bali.jpg');
    });

    it('should use placeholder when no images are available', () => {
      const packageWithoutImages = { 
        ...mockPackage, 
        thumbnail: undefined,
        images: []
      };
      renderWithRouter(<PackageCard package={packageWithoutImages} />);
      
      const image = screen.getByAltText('Bali Adventure');
      expect(image).toHaveAttribute('src', '/placeholder-image.jpg');
    });

    it('should display enhanced featured badge for featured packages', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('✨ Featured')).toBeInTheDocument();
    });

    it('should not display featured badge for non-featured packages', () => {
      const nonFeaturedPackage = { ...mockPackage, featured: false };
      renderWithRouter(<PackageCard package={nonFeaturedPackage} />);
      
      expect(screen.queryByText('✨ Featured')).not.toBeInTheDocument();
    });

    it('should render enhanced View Details button with arrow', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('should link to package detail page', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/packages/1');
    });

    it('should display per person pricing label', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      expect(screen.getByText('per person')).toBeInTheDocument();
    });

    it('should apply lazy loading to image', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const image = screen.getByAltText('Bali Adventure');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Enhanced Visual Design', () => {
    it('should have professional styling classes', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const link = container.querySelector('a');
      expect(link).toHaveClass('block', 'group');
    });

    it('should have enhanced image container with proper height', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const imageContainer = container.querySelector('.h-56');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should have hover animations and transitions', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const image = container.querySelector('img');
      expect(image).toHaveClass('transition-transform', 'duration-500', 'group-hover:scale-105');
    });

    it('should have enhanced card styling with shadow effects', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const card = container.querySelector('[class*="group-hover:shadow-large"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    it('should format price with comma separator for thousands', () => {
      const expensivePackage = { ...mockPackage, price: 5000 };
      renderWithRouter(<PackageCard package={expensivePackage} />);
      
      // Check for the main price display (larger text)
      const priceElements = screen.getAllByText('₹5,000');
      const mainPrice = priceElements.find(el => el.classList.contains('text-2xl'));
      expect(mainPrice).toBeInTheDocument();
      expect(mainPrice).toHaveClass('text-2xl');
    });

    it('should format price correctly for values under 1000', () => {
      const cheapPackage = { ...mockPackage, price: 500 };
      renderWithRouter(<PackageCard package={cheapPackage} />);
      
      // Check for the main price display (larger text)
      const priceElements = screen.getAllByText('₹500');
      const mainPrice = priceElements.find(el => el.classList.contains('text-2xl'));
      expect(mainPrice).toBeInTheDocument();
      expect(mainPrice).toHaveClass('text-2xl');
    });

    it('should format large prices correctly', () => {
      const luxuryPackage = { ...mockPackage, price: 15000 };
      renderWithRouter(<PackageCard package={luxuryPackage} />);
      
      // Check for the main price display (larger text)
      const priceElements = screen.getAllByText('₹15,000');
      const mainPrice = priceElements.find(el => el.classList.contains('text-2xl'));
      expect(mainPrice).toBeInTheDocument();
      expect(mainPrice).toHaveClass('text-2xl');
    });
  });

  describe('Text Truncation', () => {
    it('should truncate long package names', () => {
      const longNamePackage = {
        ...mockPackage,
        name: 'This is a very long package name that should be truncated to fit within the card layout',
      };
      renderWithRouter(<PackageCard package={longNamePackage} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveClass('line-clamp-2');
    });

    it('should truncate long descriptions', () => {
      const longDescPackage = {
        ...mockPackage,
        description: 'This is a very long description that should be truncated to fit within the card layout. It contains multiple sentences and should only show a preview of the content to maintain a clean card design.',
      };
      renderWithRouter(<PackageCard package={longDescPackage} />);
      
      const description = screen.getByText(/this is a very long description/i);
      expect(description).toHaveClass('line-clamp-3');
    });
  });

  describe('Enhanced Visual Elements', () => {
    it('should render location icon with primary color', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const locationIcon = container.querySelector('svg');
      expect(locationIcon).toBeInTheDocument();
      expect(locationIcon).toHaveClass('text-primary-500');
    });

    it('should render duration icon with primary color', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(1);
      // Check that duration icon also has primary color
      expect(icons[1]).toHaveClass('text-primary-500');
    });

    it('should have enhanced hover effect classes', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const card = container.querySelector('[class*="group-hover:shadow-large"]');
      expect(card).toBeInTheDocument();
    });

    it('should have gradient overlay on hover', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const overlay = container.querySelector('[class*="bg-gradient-to-t"]');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Bali Adventure');
    });

    it('should have descriptive alt text for image', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const image = screen.getByAltText('Bali Adventure');
      expect(image).toBeInTheDocument();
    });

    it('should be wrapped in a link for keyboard navigation', () => {
      renderWithRouter(<PackageCard package={mockPackage} />);
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should have enhanced typography with proper color classes', () => {
      const { container } = renderWithRouter(<PackageCard package={mockPackage} />);
      
      const heading = container.querySelector('h3');
      expect(heading).toHaveClass('text-neutral-900', 'group-hover:text-primary-600');
    });
  });
});
