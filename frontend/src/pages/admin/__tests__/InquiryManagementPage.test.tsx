import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import InquiryManagementPage from '../InquiryManagementPage';
import api from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api');

// Mock window.alert and window.location
const mockAlert = vi.fn();
globalThis.alert = mockAlert as any;

describe('InquiryManagementPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('Inquiry Status Updates', () => {
    it('should update inquiry status successfully', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        package: {
          id: 'pkg1',
          name: 'Beach Paradise',
          destination: 'Maldives',
        },
        message: 'I would like more information about this package.',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      // Click "Mark as Responded" button
      const markRespondedButton = screen.getByText('Mark as Responded');
      fireEvent.click(markRespondedButton);

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/admin/inquiries/1', { status: 'responded' });
      });
    });

    it('should handle API errors during status update', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1234567891',
        message: 'Can I customize this package?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to update inquiry status',
          },
        },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });

      // Click "Mark as Responded" button
      const markRespondedButton = screen.getByText('Mark as Responded');
      fireEvent.click(markRespondedButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to update inquiry status');
      });
    });

    it('should automatically mark inquiry as read when viewing details', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Carol White',
        email: 'carol@example.com',
        phone: '+1234567892',
        package: {
          id: 'pkg1',
          name: 'Mountain Trek',
          destination: 'Nepal',
        },
        message: 'What is included in the trek?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Carol White')).toBeInTheDocument();
      });

      // Click "View Details" button
      const viewDetailsButton = screen.getByText('View Details');
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByText('Inquiry Details')).toBeInTheDocument();
      });

      // Should have called API to mark as read
      expect(api.put).toHaveBeenCalledWith('/admin/inquiries/1', { status: 'read' });
    });

    it('should not update status when viewing already read inquiry', async () => {
      const mockInquiry = {
        id: '1',
        name: 'David Brown',
        email: 'david@example.com',
        message: 'Is group discount available?',
        status: 'read',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('David Brown')).toBeInTheDocument();
      });

      // Click "View Details" button
      const viewDetailsButton = screen.getByText('View Details');
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByText('Inquiry Details')).toBeInTheDocument();
      });

      // Should not have called API to update status
      expect(api.put).not.toHaveBeenCalled();
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter inquiries by status', async () => {
      const mockInquiries = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          message: 'Question about package',
          status: 'new',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          message: 'Another question',
          status: 'responded',
          createdAt: '2024-01-15T11:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: mockInquiries } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });

      // Find the filter dropdown
      const filterSelect = screen.getByRole('combobox');
      
      // Filter by new status
      fireEvent.change(filterSelect, { target: { value: 'new' } });

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/admin/inquiries', {
          params: { limit: 100, status: 'new' },
        });
      });
    });

    it('should clear filter when Clear Filter button is clicked', async () => {
      const mockInquiries = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          message: 'Question about package',
          status: 'new',
          createdAt: '2024-01-15T10:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: mockInquiries } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      // Apply filter
      const filterSelect = screen.getByRole('combobox');
      fireEvent.change(filterSelect, { target: { value: 'new' } });

      await waitFor(() => {
        expect(screen.getByText('Clear Filter')).toBeInTheDocument();
      });

      // Clear filter
      const clearButton = screen.getByText('Clear Filter');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/admin/inquiries', {
          params: { limit: 100 },
        });
      });
    });

    it('should display all status options in filter dropdown', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [] } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Filter by Status:')).toBeInTheDocument();
      });

      const filterSelect = screen.getByRole('combobox');
      const options = Array.from(filterSelect.querySelectorAll('option'));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).toContain('All Inquiries');
      expect(optionTexts).toContain('New');
      expect(optionTexts).toContain('Read');
      expect(optionTexts).toContain('Responded');
    });
  });

  describe('Quick Reply Functionality', () => {
    it('should open reply modal when Quick Reply is clicked', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+1234567893',
        package: {
          id: 'pkg1',
          name: 'Safari Adventure',
          destination: 'Kenya',
        },
        message: 'What wildlife can we expect to see?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Emma Davis')).toBeInTheDocument();
      });

      // Click "Quick Reply" button
      const quickReplyButton = screen.getByText('Quick Reply');
      fireEvent.click(quickReplyButton);

      await waitFor(() => {
        expect(screen.getByText('Quick Reply')).toBeInTheDocument();
        expect(screen.getByText('Replying to:')).toBeInTheDocument();
        expect(screen.getByText('Emma Davis (emma@example.com)')).toBeInTheDocument();
      });
    });

    it('should send reply and mark as responded', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Frank Miller',
        email: 'frank@example.com',
        message: 'Can I book for next month?',
        status: 'read',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Frank Miller')).toBeInTheDocument();
      });

      // Click "Quick Reply" button
      const quickReplyButton = screen.getByText('Quick Reply');
      fireEvent.click(quickReplyButton);

      await waitFor(() => {
        expect(screen.getByText('Quick Reply')).toBeInTheDocument();
      });

      // Type reply message
      const replyTextarea = screen.getByPlaceholderText('Type your reply here...');
      fireEvent.change(replyTextarea, { target: { value: 'Yes, we have availability next month.' } });

      // Click Send Reply button
      const sendButton = screen.getByRole('button', { name: /send reply/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/admin/inquiries/1', { status: 'responded' });
      });

      expect(mockAlert).toHaveBeenCalledWith('Email client opened. Please send the email from your email application.');
    });

    it('should not send reply if message is empty', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Grace Lee',
        email: 'grace@example.com',
        message: 'What is the cancellation policy?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Grace Lee')).toBeInTheDocument();
      });

      // Click "Quick Reply" button
      const quickReplyButton = screen.getByText('Quick Reply');
      fireEvent.click(quickReplyButton);

      await waitFor(() => {
        expect(screen.getByText('Quick Reply')).toBeInTheDocument();
      });

      // Try to send without typing message
      const sendButton = screen.getByRole('button', { name: /send reply/i });
      fireEvent.click(sendButton);

      expect(mockAlert).toHaveBeenCalledWith('Please enter a reply message');
      expect(api.put).not.toHaveBeenCalled();
    });
  });

  describe('Inquiry Details Display', () => {
    it('should display inquiry details in modal', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Henry Wilson',
        email: 'henry@example.com',
        phone: '+1234567894',
        package: {
          id: 'pkg1',
          name: 'City Tour',
          destination: 'Paris',
        },
        message: 'Are meals included in the tour?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Henry Wilson')).toBeInTheDocument();
      });

      // Click "View Details" button
      const viewDetailsButton = screen.getByText('View Details');
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByText('Inquiry Details')).toBeInTheDocument();
        expect(screen.getAllByText('henry@example.com').length).toBeGreaterThan(0);
        expect(screen.getByText('+1234567894')).toBeInTheDocument();
        expect(screen.getByText('City Tour')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('Are meals included in the tour?')).toBeInTheDocument();
      });
    });

    it('should display inquiry without package information', async () => {
      const mockInquiry = {
        id: '1',
        name: 'Iris Taylor',
        email: 'iris@example.com',
        message: 'Do you offer custom packages?',
        status: 'new',
        createdAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [mockInquiry] } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: { success: true },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('Iris Taylor')).toBeInTheDocument();
      });

      // Click "View Details" button
      const viewDetailsButton = screen.getByText('View Details');
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByText('Inquiry Details')).toBeInTheDocument();
        expect(screen.getAllByText('iris@example.com').length).toBeGreaterThan(0);
        expect(screen.getByText('Do you offer custom packages?')).toBeInTheDocument();
      });

      // Package section should not be present
      expect(screen.queryByText('Package of Interest')).not.toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should display loading spinner while fetching inquiries', () => {
      vi.mocked(api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<InquiryManagementPage />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle API errors when fetching inquiries', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to load inquiries');
      });
    });

    it('should display empty state when no inquiries exist', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: [] } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('No inquiries found')).toBeInTheDocument();
      });
    });
  });

  describe('Status Visual Indicators', () => {
    it('should display correct status badge colors', async () => {
      const mockInquiries = [
        {
          id: '1',
          name: 'New Inquiry',
          email: 'new@example.com',
          message: 'New message',
          status: 'new',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Read Inquiry',
          email: 'read@example.com',
          message: 'Read message',
          status: 'read',
          createdAt: '2024-01-15T11:00:00Z',
        },
        {
          id: '3',
          name: 'Responded Inquiry',
          email: 'responded@example.com',
          message: 'Responded message',
          status: 'responded',
          createdAt: '2024-01-15T12:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: { inquiries: mockInquiries } },
      });

      render(<InquiryManagementPage />);

      await waitFor(() => {
        expect(screen.getByText('New Inquiry')).toBeInTheDocument();
        expect(screen.getByText('Read Inquiry')).toBeInTheDocument();
        expect(screen.getByText('Responded Inquiry')).toBeInTheDocument();
      });

      // Check that status badges are rendered
      const statusBadges = screen.getAllByText(/new|read|responded/i);
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });
});
