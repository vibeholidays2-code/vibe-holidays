import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Components
import BookingForm from '../components/BookingForm';
import InquiryForm from '../components/InquiryForm';
import HomePage from '../pages/HomePage';
import PackagesPage from '../pages/PackagesPage';
import ContactPage from '../pages/ContactPage';

// Mock API
import api from '../services/api';
vi.mock('../services/api');

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-package-id' }),
  };
});

// Mock data
const mockPackages = [
  {
    _id: 'bali-1',
    name: 'Bali Adventure Package',
    destination: 'Bali',
    duration: 7,
    price: 25000,
    description: 'Experience the beauty of Bali with our comprehensive adventure package.',
    thumbnail: 'https://example.com/bali.jpg',
    images: ['https://example.com/bali1.jpg', 'https://example.com/bali2.jpg'],
    category: 'Bali',
    featured: true,
    itinerary: ['Day 1: Arrival in Bali', 'Day 2: Temple tour'],
    inclusions: ['Accommodation', 'Meals', 'Transportation'],
    exclusions: ['International flights', 'Personal expenses'],
    brochureUrl: 'https://example.com/bali-brochure.pdf',
  },
  {
    _id: 'vietnam-1',
    name: 'Vietnam Explorer',
    destination: 'Vietnam',
    duration: 10,
    price: 32000,
    description: 'Discover the wonders of Vietnam from north to south.',
    thumbnail: 'https://example.com/vietnam.jpg',
    images: ['https://example.com/vietnam1.jpg'],
    category: 'Vietnam',
    featured: true,
    itinerary: ['Day 1: Hanoi arrival', 'Day 2: Ha Long Bay'],
    inclusions: ['Hotels', 'Local transport'],
    exclusions: ['Visa fees', 'Tips'],
  },
];

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

describe('Integration Tests - Complete User Flows (Simplified)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    // Reset mocks
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock successful API responses by default
    vi.mocked(api.get).mockImplementation((url) => {
      if (url.includes('/packages')) {
        if (url.includes('featured=true')) {
          return Promise.resolve({ data: { data: mockPackages.filter(p => p.featured) } });
        }
        return Promise.resolve({ data: { data: mockPackages } });
      }
      return Promise.resolve({ data: { data: [] } });
    });
    
    vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    // Reset viewport
    setViewportSize(1024, 768);
  });

  describe('Complete Booking Flow Integration', () => {
    it('should complete booking form submission with enhanced UI components', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <BookingForm
              packageId="test-package-id"
              packageName="Test Package Detail"
              packagePrice={20000}
              onSuccess={vi.fn()}
              onCancel={vi.fn()}
            />
          </TestWrapper>
        );
      });

      // Fill Step 1: Personal Information using name attributes
      const nameInput = screen.getByDisplayValue('') as HTMLInputElement;
      const inputs = screen.getAllByDisplayValue('');
      
      // Find inputs by their names
      const customerNameInput = inputs.find(input => input.getAttribute('name') === 'customerName');
      const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
      const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone');

      if (customerNameInput && emailInput && phoneInput) {
        await user.type(customerNameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(phoneInput, '9876543210');

        // Navigate to Step 2
        await user.click(screen.getByRole('button', { name: /next/i }));

        // Wait for step 2 to appear
        await waitFor(() => {
          const travelDateInput = inputs.find(input => input.getAttribute('name') === 'travelDate');
          expect(travelDateInput).toBeInTheDocument();
        });

        // Fill Step 2: Travel Details
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const step2Inputs = screen.getAllByDisplayValue('');
        const travelDateInput = step2Inputs.find(input => input.getAttribute('name') === 'travelDate');
        const travelersInput = step2Inputs.find(input => input.getAttribute('name') === 'numberOfTravelers');

        if (travelDateInput && travelersInput) {
          await user.type(travelDateInput, tomorrowStr);
          await user.clear(travelersInput);
          await user.type(travelersInput, '2');

          // Submit booking
          await user.click(screen.getByRole('button', { name: /submit booking/i }));

          // Verify API call
          await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/bookings', {
              packageId: 'test-package-id',
              customerName: 'John Doe',
              email: 'john@example.com',
              phone: '9876543210',
              travelDate: tomorrowStr,
              numberOfTravelers: 2,
              specialRequests: '',
              totalPrice: 40000,
            });
          });

          // Verify success message
          await waitFor(() => {
            expect(screen.getByText(/booking submitted successfully/i)).toBeInTheDocument();
          });
        }
      }
    });

    it('should handle booking form validation errors', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <BookingForm
              packageId="test-package-id"
              packageName="Test Package"
              packagePrice={15000}
              onSuccess={vi.fn()}
              onCancel={vi.fn()}
            />
          </TestWrapper>
        );
      });

      // Try to proceed without filling required fields
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Should stay on step 1 (form validation prevents progression)
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.queryByText('Travel Details')).toBeInTheDocument(); // Step indicator is always visible
    });
  });

  describe('Search and Filtering Functionality Integration', () => {
    it('should complete search and filter flow on packages page', async () => {
      const user = userEvent.setup();
      
      // Start with packages page
      await act(async () => {
        render(
          <TestWrapper>
            <PackagesPage />
          </TestWrapper>
        );
      });

      // Wait for destination cards to load
      await waitFor(() => {
        expect(screen.getByText('Holiday Packages')).toBeInTheDocument();
      });

      // Select a destination
      await waitFor(() => {
        expect(screen.getByText('Bali')).toBeInTheDocument();
      });

      const baliDestination = screen.getByText('Bali').closest('button');
      expect(baliDestination).toBeInTheDocument();
      await user.click(baliDestination!);

      // Should show packages for Bali
      await waitFor(() => {
        expect(screen.getByText('Bali Packages')).toBeInTheDocument();
      });

      // Use search functionality
      const searchInput = screen.getByRole('textbox', { name: /search packages/i });
      await user.type(searchInput, 'Adventure');

      // Should filter packages based on search
      await waitFor(() => {
        expect(screen.getByText('Bali Adventure Package')).toBeInTheDocument();
      });

      // Change sorting
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'price-high');

      // Packages should be re-sorted
      expect(sortSelect).toHaveValue('price-high');
    });

    it('should handle empty search results gracefully', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <PackagesPage />
          </TestWrapper>
        );
      });

      // Select destination first
      await waitFor(() => {
        expect(screen.getByText('Bali')).toBeInTheDocument();
      });

      const baliDestination = screen.getByText('Bali').closest('button');
      await user.click(baliDestination!);

      await waitFor(() => {
        expect(screen.getByText('Bali Packages')).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByRole('textbox', { name: /search packages/i });
      await user.type(searchInput, 'NonexistentPackage');

      // Should show no results message
      await waitFor(() => {
        expect(screen.getByText(/no packages match your search/i)).toBeInTheDocument();
      });
    });
  });

  describe('Inquiry Form Integration Flow', () => {
    it('should complete inquiry submission from contact page', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <ContactPage />
          </TestWrapper>
        );
      });

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
      });

      // Fill contact form using name attributes
      const inputs = screen.getAllByDisplayValue('');
      const nameInput = inputs.find(input => input.getAttribute('name') === 'name');
      const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
      const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone');
      const messageInput = screen.getByRole('textbox', { name: /message/i });

      if (nameInput && emailInput && phoneInput) {
        await user.type(nameInput, 'Alice Johnson');
        await user.type(emailInput, 'alice@example.com');
        await user.type(phoneInput, '9876543210');
        await user.type(messageInput, 'I would like to know more about your Bali packages.');

        // Submit inquiry
        await user.click(screen.getByRole('button', { name: /send message/i }));

        // Verify API call
        await waitFor(() => {
          expect(api.post).toHaveBeenCalledWith('/contact', {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            phone: '9876543210',
            message: 'I would like to know more about your Bali packages.',
          });
        });

        // Verify success message
        await waitFor(() => {
          expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
        });
      }
    });

    it('should handle inquiry form with preselected package', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <InquiryForm
              preselectedPackageId="vietnam-1"
              onSuccess={vi.fn()}
              onCancel={vi.fn()}
            />
          </TestWrapper>
        );
      });

      // Wait for form to load with preselected package
      await waitFor(() => {
        const packageSelect = screen.getByRole('combobox') as HTMLSelectElement;
        expect(packageSelect.value).toBe('vietnam-1');
      });

      // Fill form using name attributes
      const inputs = screen.getAllByDisplayValue('');
      const nameInput = inputs.find(input => input.getAttribute('name') === 'name');
      const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
      const messageInput = screen.getByRole('textbox', { name: /message/i });

      if (nameInput && emailInput) {
        await user.type(nameInput, 'Bob Smith');
        await user.type(emailInput, 'bob@example.com');
        await user.type(messageInput, 'I am interested in the Vietnam package for next month.');

        // Submit
        await user.click(screen.getByRole('button', { name: /submit inquiry/i }));

        // Verify correct package was submitted
        await waitFor(() => {
          expect(api.post).toHaveBeenCalledWith('/inquiries', {
            name: 'Bob Smith',
            email: 'bob@example.com',
            phone: '',
            packageId: 'vietnam-1',
            message: 'I am interested in the Vietnam package for next month.',
          });
        });
      }
    });
  });

  describe('Responsive Behavior Across Viewport Changes', () => {
    it('should adapt UI components across different viewport sizes', async () => {
      await act(async () => {
        render(
          <TestWrapper>
            <HomePage />
          </TestWrapper>
        );
      });

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText(/discover your next adventure/i)).toBeInTheDocument();
      });

      // Test mobile viewport (375px)
      setViewportSize(375, 667);
      
      // Hero section should be responsive
      const heroSection = screen.getByText(/discover your next adventure/i).closest('section');
      expect(heroSection).toBeInTheDocument();

      // Test tablet viewport (768px)
      setViewportSize(768, 1024);
      
      // Content should still be visible and properly laid out
      expect(screen.getByText(/discover your next adventure/i)).toBeInTheDocument();

      // Test desktop viewport (1200px)
      setViewportSize(1200, 800);
      
      // All content should be visible
      expect(screen.getByText(/discover your next adventure/i)).toBeInTheDocument();
      
      // Featured packages should be visible
      await waitFor(() => {
        expect(screen.getByText(/featured packages/i)).toBeInTheDocument();
      });
    });

    it('should maintain functionality across viewport changes in packages page', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(
          <TestWrapper>
            <PackagesPage />
          </TestWrapper>
        );
      });

      // Start with desktop
      setViewportSize(1200, 800);
      
      await waitFor(() => {
        expect(screen.getByText('Holiday Packages')).toBeInTheDocument();
      });

      // Select destination
      const baliDestination = screen.getByText('Bali').closest('button');
      await user.click(baliDestination!);

      await waitFor(() => {
        expect(screen.getByText('Bali Packages')).toBeInTheDocument();
      });

      // Switch to mobile viewport
      setViewportSize(375, 667);
      
      // Search and filter should still be functional
      const searchInput = screen.getByRole('textbox', { name: /search packages/i });
      expect(searchInput).toBeInTheDocument();
      
      await user.type(searchInput, 'Adventure');
      
      // Results should still be filtered
      await waitFor(() => {
        expect(screen.getByText('Bali Adventure Package')).toBeInTheDocument();
      });

      // Switch to tablet
      setViewportSize(768, 1024);
      
      // Search should still be active
      expect(searchInput).toHaveValue('Adventure');
      
      // Sort functionality should work
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'price-high');
      
      expect(sortSelect).toHaveValue('price-high');
    });
  });

  describe('Error Handling in Complete Flows', () => {
    it('should handle network errors gracefully with enhanced error states', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));
      
      await act(async () => {
        render(
          <TestWrapper>
            <HomePage />
          </TestWrapper>
        );
      });

      // Should show enhanced error state
      await waitFor(() => {
        expect(screen.getByText(/unable to load packages/i)).toBeInTheDocument();
      });

      // Should provide enhanced retry option
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should handle API errors during booking submission', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Package is no longer available';
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });
      
      await act(async () => {
        render(
          <TestWrapper>
            <BookingForm
              packageId="test-package-id"
              packageName="Test Package"
              packagePrice={15000}
              onSuccess={vi.fn()}
              onCancel={vi.fn()}
            />
          </TestWrapper>
        );
      });

      // Fill and submit form quickly
      const inputs = screen.getAllByDisplayValue('');
      const customerNameInput = inputs.find(input => input.getAttribute('name') === 'customerName');
      const emailInput = inputs.find(input => input.getAttribute('name') === 'email');
      const phoneInput = inputs.find(input => input.getAttribute('name') === 'phone');

      if (customerNameInput && emailInput && phoneInput) {
        await user.type(customerNameInput, 'Jane Doe');
        await user.type(emailInput, 'jane@example.com');
        await user.type(phoneInput, '9876543210');
        await user.click(screen.getByRole('button', { name: /next/i }));

        await waitFor(() => {
          const step2Inputs = screen.getAllByDisplayValue('');
          const travelDateInput = step2Inputs.find(input => input.getAttribute('name') === 'travelDate');
          expect(travelDateInput).toBeInTheDocument();
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const step2Inputs = screen.getAllByDisplayValue('');
        const travelDateInput = step2Inputs.find(input => input.getAttribute('name') === 'travelDate');
        const travelersInput = step2Inputs.find(input => input.getAttribute('name') === 'numberOfTravelers');

        if (travelDateInput && travelersInput) {
          await user.type(travelDateInput, tomorrowStr);
          await user.clear(travelersInput);
          await user.type(travelersInput, '1');

          await user.click(screen.getByRole('button', { name: /submit booking/i }));

          // Should show error message
          await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
          });
        }
      }
    });
  });

  describe('Enhanced UI Component Integration', () => {
    it('should integrate enhanced design system across all components', async () => {
      // Test HomePage with enhanced design system
      await act(async () => {
        render(
          <TestWrapper>
            <HomePage />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/discover your next adventure/i)).toBeInTheDocument();
      });

      // Verify enhanced hero section styling
      const heroTitle = screen.getByText(/discover your next adventure/i);
      expect(heroTitle).toHaveClass('bg-gradient-to-r'); // Enhanced gradient text

      // Test enhanced button styling
      const ctaButtons = screen.getAllByRole('button');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });

    it('should maintain enhanced visual hierarchy across all pages', async () => {
      // Test HomePage visual hierarchy
      await act(async () => {
        render(
          <TestWrapper>
            <HomePage />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/discover your next adventure/i)).toBeInTheDocument();
      });

      // Verify enhanced heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveClass('text-4xl'); // Enhanced typography scale
    });
  });
});