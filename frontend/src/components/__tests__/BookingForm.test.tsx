import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../BookingForm';
import api from '../../services/api';

// Mock the api module
vi.mock('../../services/api');

describe('BookingForm Component', () => {
  const mockProps = {
    packageId: 'pkg123',
    packageName: 'Bali Adventure',
    packagePrice: 1500,
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render the booking form with package summary', () => {
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      expect(screen.getByText('Bali Adventure')).toBeInTheDocument();
      expect(screen.getAllByText('$1500').length).toBeGreaterThan(0);
      expect(screen.getByText('Total Price:')).toBeInTheDocument();
    });

    it('should render step 1 (Personal Info) initially', () => {
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    });

    it('should show step indicators', () => {
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Travel Details')).toBeInTheDocument();
    });
  });

  describe('Form Validation Errors', () => {
    it('should show error when full name is empty', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const nameInput = screen.getByLabelText(/full name/i);
      await user.click(nameInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when name is too short', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'A');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error when phone number is too short', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/phone number must be at least 10 digits/i)).toBeInTheDocument();
      });
    });

    it('should show error when travel date is in the past', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Navigate to step 2
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'John Doe');
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'john@example.com');
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '1234567890');
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      const travelDateInput = screen.getByLabelText(/travel date/i);
      await user.type(travelDateInput, '2020-01-01');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/travel date must be in the future/i)).toBeInTheDocument();
      });
    });

    it('should show error when number of travelers is less than 1', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Navigate to step 2
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'John Doe');
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'john@example.com');
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '1234567890');
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/number of travelers/i)).toBeInTheDocument();
      });
      
      const travelersInput = screen.getByLabelText(/number of travelers/i);
      await user.clear(travelersInput);
      await user.type(travelersInput, '0');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/at least 1 traveler is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Multi-step Navigation', () => {
    it('should navigate to step 2 when step 1 is valid', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'John Doe');
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'john@example.com');
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '1234567890');
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/number of travelers/i)).toBeInTheDocument();
      });
    });

    it('should not navigate to step 2 when step 1 has errors', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Should still be on step 1
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/travel date/i)).not.toBeInTheDocument();
    });

    it('should navigate back to step 1 from step 2', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Fill step 1 and navigate to step 2
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      // Click back button
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/travel date/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Successful Submission', () => {
    it('should submit booking successfully and show success message', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Fill step 1
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      // Fill step 2
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await user.type(screen.getByLabelText(/travel date/i), tomorrowStr);
      await user.clear(screen.getByLabelText(/number of travelers/i));
      await user.type(screen.getByLabelText(/number of travelers/i), '2');
      await user.type(screen.getByLabelText(/special requests/i), 'Vegetarian meals please');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit booking/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/bookings', {
          packageId: 'pkg123',
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          travelDate: tomorrowStr,
          numberOfTravelers: 2,
          specialRequests: 'Vegetarian meals please',
          totalPrice: 3000,
        });
      });
      
      await waitFor(() => {
        expect(screen.getByText(/booking submitted successfully/i)).toBeInTheDocument();
      });
    });

    it('should call onSuccess callback after successful submission', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await user.type(screen.getByLabelText(/travel date/i), tomorrowStr);
      await user.clear(screen.getByLabelText(/number of travelers/i));
      await user.type(screen.getByLabelText(/number of travelers/i), '1');
      
      await user.click(screen.getByRole('button', { name: /submit booking/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/booking submitted successfully/i)).toBeInTheDocument();
      });
      
      // Wait for the timeout in onSuccess
      await waitFor(() => {
        expect(mockProps.onSuccess).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('API Error Handling', () => {
    it('should display error message when API returns error', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Package is no longer available';
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });
      
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await user.type(screen.getByLabelText(/travel date/i), tomorrowStr);
      await user.clear(screen.getByLabelText(/number of travelers/i));
      await user.type(screen.getByLabelText(/number of travelers/i), '1');
      
      await user.click(screen.getByRole('button', { name: /submit booking/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display generic error message when API error has no message', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'));
      
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await user.type(screen.getByLabelText(/travel date/i), tomorrowStr);
      await user.clear(screen.getByLabelText(/number of travelers/i));
      await user.type(screen.getByLabelText(/number of travelers/i), '1');
      
      await user.click(screen.getByRole('button', { name: /submit booking/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit booking/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Total Price Calculation', () => {
    it('should calculate total price based on number of travelers', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<BookingForm {...mockProps} />);
      });
      
      // Navigate to step 2
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/number of travelers/i)).toBeInTheDocument();
      });
      
      // Change number of travelers
      const travelersInput = screen.getByLabelText(/number of travelers/i);
      await user.clear(travelersInput);
      await user.type(travelersInput, '3');
      
      await waitFor(() => {
        expect(screen.getByText('$4500')).toBeInTheDocument();
      });
    });
  });
});
