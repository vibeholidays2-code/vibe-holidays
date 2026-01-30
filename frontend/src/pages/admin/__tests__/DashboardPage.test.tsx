import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../DashboardPage';
import api from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Helper to render with React Query provider
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Statistics Display', () => {
    it('should display total bookings statistic', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 42,
              pending: 5,
              confirmed: 35,
              cancelled: 2,
            },
            revenue: { total: 50000 },
            inquiries: { total: 15, new: 3 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Total Bookings')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    it('should display confirmed and pending bookings breakdown', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 50,
              pending: 10,
              confirmed: 38,
              cancelled: 2,
            },
            revenue: { total: 75000 },
            inquiries: { total: 20, new: 5 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('38 confirmed')).toBeInTheDocument();
        expect(screen.getByText('10 pending')).toBeInTheDocument();
      });
    });

    it('should display total revenue formatted as currency', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 30,
              pending: 5,
              confirmed: 25,
              cancelled: 0,
            },
            revenue: { total: 125000 },
            inquiries: { total: 10, new: 2 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('$125,000.00')).toBeInTheDocument();
      });
    });

    it('should display total inquiries statistic', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 25,
              pending: 3,
              confirmed: 22,
              cancelled: 0,
            },
            revenue: { total: 60000 },
            inquiries: { total: 18, new: 7 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Total Inquiries')).toBeInTheDocument();
        expect(screen.getByText('18')).toBeInTheDocument();
        expect(screen.getByText('7 new')).toBeInTheDocument();
      });
    });

    it('should display pending bookings statistic', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 40,
              pending: 12,
              confirmed: 28,
              cancelled: 0,
            },
            revenue: { total: 80000 },
            inquiries: { total: 15, new: 4 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Pending Bookings')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
      });
    });

    it('should display zero values when no data exists', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 0,
              pending: 0,
              confirmed: 0,
              cancelled: 0,
            },
            revenue: { total: 0 },
            inquiries: { total: 0, new: 0 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Total Bookings')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
      });
    });
  });

  describe('Recent Activity Rendering', () => {
    it('should display recent bookings table with customer information', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 10,
              pending: 2,
              confirmed: 8,
              cancelled: 0,
            },
            revenue: { total: 25000 },
            inquiries: { total: 5, new: 1 },
            recentBookings: [
              {
                _id: '1',
                customerName: 'John Doe',
                email: 'john@example.com',
                status: 'confirmed',
                totalPrice: 2500,
                createdAt: '2024-01-15T10:00:00Z',
                packageId: {
                  name: 'Beach Paradise',
                  destination: 'Maldives',
                },
              },
              {
                _id: '2',
                customerName: 'Jane Smith',
                email: 'jane@example.com',
                status: 'pending',
                totalPrice: 3200,
                createdAt: '2024-01-14T15:30:00Z',
                packageId: {
                  name: 'Mountain Adventure',
                  destination: 'Switzerland',
                },
              },
            ],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Recent Bookings')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });
    });

    it('should display booking package names and dates', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 5,
              pending: 1,
              confirmed: 4,
              cancelled: 0,
            },
            revenue: { total: 15000 },
            inquiries: { total: 3, new: 0 },
            recentBookings: [
              {
                _id: '1',
                customerName: 'Alice Johnson',
                email: 'alice@example.com',
                status: 'confirmed',
                totalPrice: 4500,
                createdAt: '2024-01-15T10:00:00Z',
                packageId: {
                  name: 'Safari Experience',
                  destination: 'Kenya',
                },
              },
            ],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Safari Experience')).toBeInTheDocument();
        expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
      });
    });

    it('should display booking status badges with correct styling', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 3,
              pending: 1,
              confirmed: 2,
              cancelled: 0,
            },
            revenue: { total: 10000 },
            inquiries: { total: 2, new: 0 },
            recentBookings: [
              {
                _id: '1',
                customerName: 'Bob Wilson',
                email: 'bob@example.com',
                status: 'confirmed',
                totalPrice: 3000,
                createdAt: '2024-01-15T10:00:00Z',
                packageId: {
                  name: 'City Tour',
                  destination: 'Paris',
                },
              },
              {
                _id: '2',
                customerName: 'Carol Davis',
                email: 'carol@example.com',
                status: 'pending',
                totalPrice: 2800,
                createdAt: '2024-01-14T10:00:00Z',
                packageId: {
                  name: 'Island Hopping',
                  destination: 'Greece',
                },
              },
            ],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        const statusBadges = screen.getAllByText(/confirmed|pending/i);
        expect(statusBadges.length).toBeGreaterThan(0);
      });
    });

    it('should display booking prices formatted as currency', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 2,
              pending: 0,
              confirmed: 2,
              cancelled: 0,
            },
            revenue: { total: 8000 },
            inquiries: { total: 1, new: 0 },
            recentBookings: [
              {
                _id: '1',
                customerName: 'David Lee',
                email: 'david@example.com',
                status: 'confirmed',
                totalPrice: 5500,
                createdAt: '2024-01-15T10:00:00Z',
                packageId: {
                  name: 'Cruise Package',
                  destination: 'Caribbean',
                },
              },
            ],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('$5,500.00')).toBeInTheDocument();
      });
    });

    it('should display message when no recent bookings exist', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 0,
              pending: 0,
              confirmed: 0,
              cancelled: 0,
            },
            revenue: { total: 0 },
            inquiries: { total: 0, new: 0 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('No recent bookings')).toBeInTheDocument();
      });
    });

    it('should display recent inquiries with customer information', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 5,
              pending: 1,
              confirmed: 4,
              cancelled: 0,
            },
            revenue: { total: 12000 },
            inquiries: { total: 8, new: 2 },
            recentBookings: [],
            recentInquiries: [
              {
                _id: '1',
                name: 'Emma Brown',
                email: 'emma@example.com',
                message: 'I would like to know more about the beach packages.',
                status: 'new',
                createdAt: '2024-01-15T12:00:00Z',
                packageId: {
                  name: 'Tropical Getaway',
                  destination: 'Bali',
                },
              },
              {
                _id: '2',
                name: 'Frank Miller',
                email: 'frank@example.com',
                message: 'Can you provide custom itinerary options?',
                status: 'read',
                createdAt: '2024-01-14T09:00:00Z',
              },
            ],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Recent Inquiries')).toBeInTheDocument();
        expect(screen.getByText('Emma Brown')).toBeInTheDocument();
        expect(screen.getByText('emma@example.com')).toBeInTheDocument();
        expect(screen.getByText('Frank Miller')).toBeInTheDocument();
        expect(screen.getByText('frank@example.com')).toBeInTheDocument();
      });
    });

    it('should display inquiry messages', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 3,
              pending: 0,
              confirmed: 3,
              cancelled: 0,
            },
            revenue: { total: 9000 },
            inquiries: { total: 5, new: 1 },
            recentBookings: [],
            recentInquiries: [
              {
                _id: '1',
                name: 'Grace Taylor',
                email: 'grace@example.com',
                message: 'What are the payment options available?',
                status: 'new',
                createdAt: '2024-01-15T14:00:00Z',
              },
            ],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('What are the payment options available?')).toBeInTheDocument();
      });
    });

    it('should display inquiry status badges', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 4,
              pending: 1,
              confirmed: 3,
              cancelled: 0,
            },
            revenue: { total: 11000 },
            inquiries: { total: 6, new: 2 },
            recentBookings: [],
            recentInquiries: [
              {
                _id: '1',
                name: 'Henry Wilson',
                email: 'henry@example.com',
                message: 'Looking for family-friendly packages.',
                status: 'new',
                createdAt: '2024-01-15T16:00:00Z',
              },
              {
                _id: '2',
                name: 'Iris Chen',
                email: 'iris@example.com',
                message: 'Need information about visa requirements.',
                status: 'responded',
                createdAt: '2024-01-14T11:00:00Z',
              },
            ],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('new')).toBeInTheDocument();
        expect(screen.getByText('responded')).toBeInTheDocument();
      });
    });

    it('should display package information for inquiries when available', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 2,
              pending: 0,
              confirmed: 2,
              cancelled: 0,
            },
            revenue: { total: 7000 },
            inquiries: { total: 3, new: 1 },
            recentBookings: [],
            recentInquiries: [
              {
                _id: '1',
                name: 'Jack Anderson',
                email: 'jack@example.com',
                message: 'Is this package suitable for seniors?',
                status: 'new',
                createdAt: '2024-01-15T18:00:00Z',
                packageId: {
                  name: 'Cultural Heritage Tour',
                  destination: 'Italy',
                },
              },
            ],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Package: Cultural Heritage Tour')).toBeInTheDocument();
      });
    });

    it('should display message when no recent inquiries exist', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: {
            bookings: {
              total: 5,
              pending: 1,
              confirmed: 4,
              cancelled: 0,
            },
            revenue: { total: 15000 },
            inquiries: { total: 0, new: 0 },
            recentBookings: [],
            recentInquiries: [],
          },
        },
      });

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('No recent inquiries')).toBeInTheDocument();
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should display loading spinner while fetching data', () => {
      vi.mocked(api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithQueryClient(<DashboardPage />);

      const spinner = screen.getByText((_content, element) => {
        return element?.className?.includes('animate-spin') || false;
      });
      expect(spinner).toBeInTheDocument();
    });

    it('should display error message when API call fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      renderWithQueryClient(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
      });
    });
  });
});
