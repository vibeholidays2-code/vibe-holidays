import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryManagementPage from '../GalleryManagementPage';
import api from '../../../services/api';

// Mock the API
vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock window.alert and window.confirm
const mockAlert = vi.fn();
const mockConfirm = vi.fn();
globalThis.alert = mockAlert as any;
globalThis.confirm = mockConfirm as any;

describe('GalleryManagementPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
    mockConfirm.mockClear();
  });

  describe('Image Upload', () => {
    it('should open upload modal when Upload Image button is clicked', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });
    });

    it('should validate required fields before uploading', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });


      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });

      // Try to submit without selecting a file or entering category
      const submitButtons = screen.getAllByRole('button', { name: /upload image/i });
      const submitButton = submitButtons[submitButtons.length - 1]; // Get the one in the modal
      fireEvent.click(submitButton);

      // The form should not submit without required fields
      // Since validation prevents submission, the API should not be called
      await waitFor(() => {
        expect(api.post).not.toHaveBeenCalled();
      });
    });

    it('should validate file type during upload', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });

      // Create an invalid file (PDF)
      const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/browse files/i).closest('label')?.querySelector('input[type="file"]');
      
      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      }

      await waitFor(() => {
        expect(screen.getByText(/please select a valid image file/i)).toBeInTheDocument();
      });
    });

    it('should validate file size during upload', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });

      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/browse files/i).closest('label')?.querySelector('input[type="file"]');
      
      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [largeFile] } });
      }

      await waitFor(() => {
        expect(screen.getByText(/file size must be less than 5mb/i)).toBeInTheDocument();
      });
    });

    it('should successfully upload image with valid data', async () => {
      const user = userEvent.setup();

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      vi.mocked(api.post).mockResolvedValue({
        data: {
          success: true,
          data: {
            _id: '1',
            url: '/uploads/test.jpg',
            category: 'destinations',
            caption: 'Test caption',
            destination: 'Bali',
            order: 0,
          },
        },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });

      // Select a valid file
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/browse files/i).closest('label')?.querySelector('input[type="file"]');
      
      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      }

      // Fill in category
      const categoryInput = screen.getByPlaceholderText(/e.g., Beaches, Mountains, Cities/i);
      await user.type(categoryInput, 'destinations');

      // Submit form
      const submitButtons = screen.getAllByRole('button', { name: /upload image/i });
      const submitButton = submitButtons[submitButtons.length - 1]; // Get the one in the modal
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          '/admin/gallery',
          expect.any(FormData),
          expect.objectContaining({
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        );
      });

      expect(mockAlert).toHaveBeenCalledWith('Image uploaded successfully!');
    });

    it('should handle API errors during upload', async () => {
      const user = userEvent.setup();

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      vi.mocked(api.post).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to upload image',
          },
        },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument();
      });

      // Select file and fill category
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/browse files/i).closest('label')?.querySelector('input[type="file"]');
      
      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [validFile] } });
      }

      const categoryInput = screen.getByPlaceholderText(/e.g., Beaches, Mountains, Cities/i);
      await user.type(categoryInput, 'destinations');

      // Submit form
      const submitButtons = screen.getAllByRole('button', { name: /upload image/i });
      const submitButton = submitButtons[submitButtons.length - 1]; // Get the one in the modal
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to upload image');
      });
    });
  });

  describe('Category Assignment', () => {
    it('should allow editing image category', async () => {
      const user = userEvent.setup();

      const mockImage = {
        _id: '1',
        url: '/uploads/test.jpg',
        category: 'destinations',
        caption: 'Beach view',
        destination: 'Bali',
        order: 0,
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [mockImage], pagination: { page: 1, limit: 100, total: 1, pages: 1 } },
      });

      vi.mocked(api.put).mockResolvedValue({
        data: {
          success: true,
          data: { ...mockImage, category: 'experiences' },
        },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach view')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Image Metadata')).toBeInTheDocument();
      });

      // Change category
      const categoryInput = screen.getByDisplayValue('destinations');
      await user.clear(categoryInput);
      await user.type(categoryInput, 'experiences');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /update image/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith(
          '/admin/gallery/1',
          expect.objectContaining({
            category: 'experiences',
          })
        );
      });

      expect(mockAlert).toHaveBeenCalledWith('Image updated successfully!');
    });

    it('should validate category is required when editing', async () => {
      const user = userEvent.setup();

      const mockImage = {
        _id: '1',
        url: '/uploads/test.jpg',
        category: 'destinations',
        caption: 'Beach view',
        destination: 'Bali',
        order: 0,
      };

      vi.mocked(api.get).mockResolvedValue({
        data: { data: [mockImage], pagination: { page: 1, limit: 100, total: 1, pages: 1 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach view')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Image Metadata')).toBeInTheDocument();
      });

      // Clear category
      const categoryInput = screen.getByDisplayValue('destinations');
      await user.clear(categoryInput);

      // Try to submit form - validation should prevent submission
      const submitButton = screen.getByRole('button', { name: /update image/i });
      fireEvent.click(submitButton);

      // The form should not submit without category, but the error display depends on implementation
      // Since the component uses inline validation, we check that the API was not called
      await waitFor(() => {
        expect(api.put).not.toHaveBeenCalled();
      });
    });

    it('should filter images by category', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
        {
          _id: '2',
          url: '/uploads/test2.jpg',
          category: 'experiences',
          caption: 'Adventure',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 2, pages: 1 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
        expect(screen.getByText('Adventure')).toBeInTheDocument();
      });

      // Mock filtered response
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { data: [mockImages[0]], pagination: { page: 1, limit: 100, total: 1, pages: 1 } },
      });

      // Select category filter
      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'destinations' } });

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/gallery', {
          params: { limit: 100, category: 'destinations' },
        });
      });
    });
  });

  describe('Bulk Delete', () => {
    it('should allow selecting multiple images', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
        {
          _id: '2',
          url: '/uploads/test2.jpg',
          category: 'experiences',
          caption: 'Adventure',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 2, pages: 1 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
      });

      // Get checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Select first image
      fireEvent.click(checkboxes[0]);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(1\)/i)).toBeInTheDocument();
      });

      // Select second image
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(2\)/i)).toBeInTheDocument();
      });
    });

    it('should delete multiple images when bulk delete is confirmed', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
        {
          _id: '2',
          url: '/uploads/test2.jpg',
          category: 'experiences',
          caption: 'Adventure',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 2, pages: 1 } },
      });

      vi.mocked(api.delete).mockResolvedValue({
        data: { success: true, message: 'Image deleted' },
      });

      mockConfirm.mockReturnValue(true);

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
      });

      // Select both images
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(2\)/i)).toBeInTheDocument();
      });

      // Click bulk delete button
      const bulkDeleteButton = screen.getByText(/Delete Selected \(2\)/i);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete 2 image(s)?');
      });

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/admin/gallery/1');
        expect(api.delete).toHaveBeenCalledWith('/admin/gallery/2');
      });

      expect(mockAlert).toHaveBeenCalledWith('2 image(s) deleted successfully!');
    });

    it('should not delete if bulk delete is cancelled', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 1, pages: 1 } },
      });

      mockConfirm.mockReturnValue(false);

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
      });

      // Select image
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(1\)/i)).toBeInTheDocument();
      });

      // Click bulk delete button
      const bulkDeleteButton = screen.getByText(/Delete Selected \(1\)/i);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
      });

      expect(api.delete).not.toHaveBeenCalled();
    });

    it('should show alert if trying to bulk delete with no images selected', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { data: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('No images found')).toBeInTheDocument();
      });

      // There should be no bulk delete button visible when no images are selected
      expect(screen.queryByText(/Delete Selected/i)).not.toBeInTheDocument();
    });

    it('should handle API errors during bulk delete', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 1, pages: 1 } },
      });

      vi.mocked(api.delete).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to delete image',
          },
        },
      });

      mockConfirm.mockReturnValue(true);

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
      });

      // Select image
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(1\)/i)).toBeInTheDocument();
      });

      // Click bulk delete button
      const bulkDeleteButton = screen.getByText(/Delete Selected \(1\)/i);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to delete some images');
      });
    });

    it('should allow selecting all images at once', async () => {
      const mockImages = [
        {
          _id: '1',
          url: '/uploads/test1.jpg',
          category: 'destinations',
          caption: 'Beach',
          order: 0,
        },
        {
          _id: '2',
          url: '/uploads/test2.jpg',
          category: 'experiences',
          caption: 'Adventure',
          order: 0,
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        data: { data: mockImages, pagination: { page: 1, limit: 100, total: 2, pages: 1 } },
      });

      act(() => {
        render(<GalleryManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Beach')).toBeInTheDocument();
      });

      // Click "Select All" button
      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);

      await waitFor(() => {
        expect(screen.getByText(/Delete Selected \(2\)/i)).toBeInTheDocument();
      });

      // Click again to deselect all
      const deselectAllButton = screen.getByText('Deselect All');
      fireEvent.click(deselectAllButton);

      await waitFor(() => {
        expect(screen.queryByText(/Delete Selected/i)).not.toBeInTheDocument();
      });
    });
  });
});
