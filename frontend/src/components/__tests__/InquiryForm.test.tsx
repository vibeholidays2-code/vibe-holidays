import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InquiryForm from '../InquiryForm';
import api from '../../services/api';

// Mock the api module
vi.mock('../../services/api');

describe('InquiryForm Component', () => {
  const mockPackages = [
    { _id: 'pkg1', name: 'Bali Adventure', destination: 'Bali' },
    { _id: 'pkg2', name: 'Paris Romance', destination: 'Paris' },
    { _id: 'pkg3', name: 'Tokyo Explorer', destination: 'Tokyo' },
  ];

  const mockProps = {
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the packages API call
    vi.mocked(api.get).mockResolvedValue({
      data: { data: mockPackages },
    });
  });

  describe('Form Rendering', () => {
    it('should render the inquiry form with all fields', async () => {
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
    });

    it('should load and display package options', async () => {
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/packages');
      });
      
      await waitFor(() => {
        const select = screen.getByLabelText(/package of interest/i);
        expect(select).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching packages', async () => {
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      expect(screen.getByText(/loading packages/i)).toBeInTheDocument();
    });

    it('should preselect package when preselectedPackageId is provided', async () => {
      await act(async () => {
        render(<InquiryForm {...mockProps} preselectedPackageId="pkg2" />);
      });
      
      await waitFor(() => {
        const select = screen.getByLabelText(/package of interest/i) as HTMLSelectElement;
        expect(select.value).toBe('pkg2');
      });
    });
  });

  describe('Form Validation Errors', () => {
    it('should show error when name is empty', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
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
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'A');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error when phone is too short', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/phone number must be at least 10 digits/i)).toBeInTheDocument();
      });
    });

    it('should show error when message is empty', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const messageInput = screen.getByLabelText(/your message/i);
      await user.click(messageInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when message is too short', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const messageInput = screen.getByLabelText(/your message/i);
      await user.type(messageInput, 'Short');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('should not show error for empty phone (optional field)', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.click(phoneInput);
      await user.tab();
      
      // Wait a bit to ensure no error appears
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByText(/phone number must be at least 10 digits/i)).not.toBeInTheDocument();
    });
  });

  describe('Successful Submission', () => {
    it('should submit inquiry successfully with all fields', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/inquiries', {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '9876543210',
          packageId: undefined,
          message: 'I would like more information about this package.',
        });
      });
      
      await waitFor(() => {
        expect(screen.getByText(/inquiry submitted successfully/i)).toBeInTheDocument();
      });
    });

    it('should submit inquiry without optional phone number', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/inquiries', {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '',
          packageId: undefined,
          message: 'I would like more information about this package.',
        });
      });
    });

    it('should submit inquiry with selected package', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      const packageSelect = screen.getByLabelText(/package of interest/i);
      await user.selectOptions(packageSelect, 'pkg1');
      
      const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/inquiries', {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '',
          packageId: 'pkg1',
          message: 'I would like more information about this package.',
        });
      });
    });

    it('should call onSuccess callback after successful submission', async () => {
      const user = userEvent.setup();
      const mockResponse = { data: { success: true } };
      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      await user.click(screen.getByRole('button', { name: /submit inquiry/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/inquiry submitted successfully/i)).toBeInTheDocument();
      });
      
      // Wait for the timeout in onSuccess
      await waitFor(() => {
        expect(mockProps.onSuccess).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('API Error Handling', () => {
    it('should display error message when API returns error with message', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Server is temporarily unavailable';
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      await user.click(screen.getByRole('button', { name: /submit inquiry/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display error message when API returns error with error field', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid email format';
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { error: errorMessage } },
      });
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/package of interest/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      await user.click(screen.getByRole('button', { name: /submit inquiry/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display generic error message when API error has no message', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'));
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      // Wait for packages to load
      await waitFor(() => {
        expect(screen.queryByText(/loading packages/i)).not.toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      await user.click(screen.getByRole('button', { name: /submit inquiry/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit inquiry/i)).toBeInTheDocument();
      });
    });

    it('should handle package loading error gracefully', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Failed to load packages'));
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading packages/i)).not.toBeInTheDocument();
      });
      
      // Should still render the form even if packages fail to load
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    it('should not render cancel button when onCancel is not provided', async () => {
      await act(async () => {
        render(<InquiryForm onSuccess={vi.fn()} />);
      });
      
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockImplementation(() => new Promise(() => {})); // Never resolves
      
      await act(async () => {
        render(<InquiryForm {...mockProps} />);
      });
      
      // Wait for packages to load
      await waitFor(() => {
        expect(screen.queryByText(/loading packages/i)).not.toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/your message/i), 'I would like more information about this package.');
      
      const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
