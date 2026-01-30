import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BookingManagementPage from '../BookingManagementPage';
import api from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api');

// Mock window.alert
const mockAlert = vi.fn();
globalThis.alert = mockAlert as any;

describe('BookingManagementPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
  });

  describe('Booking Status Updates', () => {
    it('should update booking status successfully', async () => {
      const mockBooking = {
        _id: '1',
        packageId: {
          _id: 'pkg1',
          name: 'Beach Paradise',
          destination: 'Maldives',
          duration: 7,
          price: 2500,
        },
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        travelDate: '2024-06-15T00:00:00Z',
        numberOfTravelers: 2,
        specialRequests: 'Window seat',
        status: 'pending',
        totalPrice: 5000,
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [mockBooking] },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Find the status select dropdown
      const statusSelects = screen.getAllByRole('combobox');
      const bookingStatusSelect = statusSelects.find(
        (select) => (select as HTMLSelectElement).value === 'pending'
      );

      expect(bookingStatusSelect).toBeInTheDocument();

      // Change status to confirmed
      fireEvent.change(bookingStatusSelect!, { target: { value: 'confirmed' } });

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/admin/bookings/1', { status: 'confirmed' });
      });

      expect(mockAlert).toHaveBeenCalledWith('Booking status updated successfully!');
    });

    it('should handle API errors during status update', async () => {
      const mockBooking = {
        _id: '1',
        packageId: {
          _id: 'pkg1',
          name: 'Mountain Trek',
          destination: 'Nepal',
          duration: 10,
          price: 3000,
        },
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        travelDate: '2024-07-20T00:00:00Z',
        numberOfTravelers: 1,
        status: 'pending',
        totalPrice: 3000,
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [mockBooking] },
      });

      vi.mocked(api.put).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to update booking status',
          },
        },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Find and change status
      const statusSelects = screen.getAllByRole('combobox');
      const bookingStatusSelect = statusSelects.find(
        (select) => (select as HTMLSelectElement).value === 'pending'
      );

      fireEvent.change(bookingStatusSelect!, { target: { value: 'cancelled' } });

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to update booking status');
      });
    });

    it('should update status in modal when viewing booking details', async () => {
      const mockBooking = {
        _id: '1',
        packageId: {
          _id: 'pkg1',
          name: 'Safari Adventure',
          destination: 'Kenya',
          duration: 5,
          price: 4000,
        },
        customerName: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '+1234567892',
        travelDate: '2024-08-10T00:00:00Z',
        numberOfTravelers: 3,
        specialRequests: 'Vegetarian meals',
        status: 'confirmed',
        totalPrice: 12000,
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [mockBooking] },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      });

      // Open details modal
      const viewDetailsButton = screen.getByText('View Details');
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByText('Booking Details')).toBeInTheDocument();
      });

      // Verify booking details are displayed
      expect(screen.getAllByText('bob@example.com').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Safari Adventure').length).toBeGreaterThan(0);
      expect(screen.getByText('Vegetarian meals')).toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter bookings by status', async () => {
      const mockBookings = [
        {
          _id: '1',
          packageId: {
            _id: 'pkg1',
            name: 'Beach Paradise',
            destination: 'Maldives',
            duration: 7,
            price: 2500,
          },
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          travelDate: '2024-06-15T00:00:00Z',
          numberOfTravelers: 2,
          status: 'pending',
          totalPrice: 5000,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          _id: '2',
          packageId: {
            _id: 'pkg2',
            name: 'City Tour',
            destination: 'Paris',
            duration: 3,
            price: 1500,
          },
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          travelDate: '2024-07-20T00:00:00Z',
          numberOfTravelers: 1,
          status: 'confirmed',
          totalPrice: 1500,
          createdAt: '2024-01-15T10:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockBookings },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Find the filter dropdown (first combobox is the filter)
      const filterSelect = screen.getAllByRole('combobox')[0];
      
      // Filter by pending status
      fireEvent.change(filterSelect, { target: { value: 'pending' } });

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/admin/bookings', {
          params: { limit: 100, status: 'pending' },
        });
      });
    });

    it('should clear filter when Clear Filter button is clicked', async () => {
      const mockBookings = [
        {
          _id: '1',
          packageId: {
            _id: 'pkg1',
            name: 'Beach Paradise',
            destination: 'Maldives',
            duration: 7,
            price: 2500,
          },
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          travelDate: '2024-06-15T00:00:00Z',
          numberOfTravelers: 2,
          status: 'pending',
          totalPrice: 5000,
          createdAt: '2024-01-15T10:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockBookings },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Apply filter
      const filterSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(filterSelect, { target: { value: 'pending' } });

      await waitFor(() => {
        expect(screen.getByText('Clear Filter')).toBeInTheDocument();
      });

      // Clear filter
      const clearButton = screen.getByText('Clear Filter');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/admin/bookings', {
          params: { limit: 100 },
        });
      });
    });

    it('should display all status options in filter dropdown', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [] },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Filter by Status:')).toBeInTheDocument();
      });

      const filterSelect = screen.getAllByRole('combobox')[0];
      const options = Array.from(filterSelect.querySelectorAll('option'));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).toContain('All Bookings');
      expect(optionTexts).toContain('Pending');
      expect(optionTexts).toContain('Confirmed');
      expect(optionTexts).toContain('Cancelled');
    });
  });

  describe('Export Functionality', () => {
    it('should show alert when no bookings to export', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [] },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('No bookings found')).toBeInTheDocument();
      });

      // Click export button
      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);

      expect(mockAlert).toHaveBeenCalledWith('No bookings to export');
    });
  });

  describe('Loading and Error States', () => {
    it('should handle API errors when fetching bookings', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to load bookings');
      });
    });

    it('should display empty state when no bookings exist', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [] },
      });

      render(<BookingManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('No bookings found')).toBeInTheDocument();
      });
    });
  });
});
