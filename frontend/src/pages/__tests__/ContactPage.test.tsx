import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from '../ContactPage';
import api from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ContactPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render contact page heading', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByRole('heading', { name: /^contact us$/i })).toBeInTheDocument();
    });

    it('should render contact form', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell us how we can help you/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should render contact information section', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
      expect(screen.getByText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
      expect(screen.getByText(/info@vibeholidays\.com/i)).toBeInTheDocument();
    });

    it('should render business hours', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByRole('heading', { name: /business hours/i })).toBeInTheDocument();
      expect(screen.getByText(/monday - friday: 9:00 am - 6:00 pm/i)).toBeInTheDocument();
    });

    it('should render social media links', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByRole('heading', { name: /follow us/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/instagram/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
    });

    it('should render embedded map', () => {
      renderWithRouter(<ContactPage />);
      
      const iframe = screen.getByTitle(/vibe holidays location/i);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('google.com/maps'));
    });
  });

  describe('Contact Form Validation', () => {
    it('should require name field', async () => {
      renderWithRouter(<ContactPage />);
      
      const nameInput = screen.getByPlaceholderText(/your full name/i);
      expect(nameInput).toBeRequired();
    });

    it('should require email field', async () => {
      renderWithRouter(<ContactPage />);
      
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should not require phone field', async () => {
      renderWithRouter(<ContactPage />);
      
      const phoneInput = screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i);
      expect(phoneInput).not.toBeRequired();
    });

    it('should require message field', async () => {
      renderWithRouter(<ContactPage />);
      
      const messageInput = screen.getByPlaceholderText(/tell us how we can help you/i);
      expect(messageInput).toBeRequired();
    });

    it('should validate email format', async () => {
      renderWithRouter(<ContactPage />);
      
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i), '+1 555-123-4567');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'I would like to inquire about your services.');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/contact', {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 555-123-4567',
          message: 'I would like to inquire about your services.',
        });
      });
    });

    it('should handle empty message field', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ContactPage />);
      
      // Try to submit with empty message
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Form should not be submitted (API not called)
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should display success message after successful submission', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(
          screen.getByText(/thank you for contacting us/i)
        ).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
      
      renderWithRouter(<ContactPage />);
      
      const nameInput = screen.getByPlaceholderText(/your full name/i) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i) as HTMLInputElement;
      const phoneInput = screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i) as HTMLInputElement;
      const messageInput = screen.getByPlaceholderText(/tell us how we can help you/i) as HTMLTextAreaElement;
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '+1 555-123-4567');
      await user.type(messageInput, 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(phoneInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to send message',
          },
        },
      });
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });

    it('should display generic error message when no specific error is provided', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(
          screen.getByText(/failed to send message\. please try again later\./i)
        ).toBeInTheDocument();
      });
    });

    it('should not retain error message after successful submission', async () => {
      const user = userEvent.setup();
      
      // First submission fails
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'));
      
      renderWithRouter(<ContactPage />);
      
      await user.type(screen.getByPlaceholderText(/your full name/i), 'John Doe');
      await user.type(screen.getByPlaceholderText(/your\.email@example\.com/i), 'john@example.com');
      await user.type(screen.getByPlaceholderText(/tell us how we can help you/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
      
      // Second submission succeeds - clear the form first
      vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });
      
      // Clear and re-enter form data
      const nameInput = screen.getByPlaceholderText(/your full name/i) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i) as HTMLInputElement;
      const messageInput = screen.getByPlaceholderText(/tell us how we can help you/i) as HTMLTextAreaElement;
      
      await user.clear(nameInput);
      await user.clear(emailInput);
      await user.clear(messageInput);
      
      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.type(messageInput, 'New message');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/failed to send message/i)).not.toBeInTheDocument();
        expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
      });
    });
  });
});
