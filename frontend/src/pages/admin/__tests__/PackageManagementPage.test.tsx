import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PackageManagementPage from '../PackageManagementPage';
import { packageService } from '../../../services/packageService';

// Mock the package service
vi.mock('../../../services/packageService', () => ({
  packageService: {
    getPackages: vi.fn(),
    createPackage: vi.fn(),
    updatePackage: vi.fn(),
    deletePackage: vi.fn(),
  },
}));

// Mock window.alert
const mockAlert = vi.fn();
globalThis.alert = mockAlert as any;

describe('PackageManagementPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
  });

  describe('Package Creation', () => {
    it('should open modal when Add New Package button is clicked', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });
    });

    it('should create a new package successfully', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      vi.mocked(packageService.createPackage).mockResolvedValue({
        success: true,
        data: {
          _id: '1',
          name: 'Beach Paradise',
          destination: 'Maldives',
          duration: 7,
          price: 2500,
          description: 'Relaxing beach vacation',
          itinerary: ['Day 1: Arrival'],
          inclusions: ['Hotel', 'Meals'],
          exclusions: ['Flights'],
          images: ['image1.jpg'],
          featured: false,
          active: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });

      // Get form inputs
      const inputs = screen.getAllByRole('textbox');
      const numberInputs = screen.getAllByRole('spinbutton');

      // Fill form - first 2 textboxes are name and destination
      fireEvent.change(inputs[0], { target: { value: 'Beach Paradise' } });
      fireEvent.change(inputs[1], { target: { value: 'Maldives' } });
      fireEvent.change(numberInputs[0], { target: { value: '7' } });
      fireEvent.change(numberInputs[1], { target: { value: '2500' } });
      fireEvent.change(inputs[2], { target: { value: 'Relaxing beach vacation' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(packageService.createPackage).toHaveBeenCalled();
      });

      expect(mockAlert).toHaveBeenCalledWith('Package created successfully!');
    });

    it('should validate required fields before creating package', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });

      // Submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /create package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Package name is required')).toBeInTheDocument();
        expect(screen.getByText('Destination is required')).toBeInTheDocument();
        expect(screen.getByText('Description is required')).toBeInTheDocument();
      });

      expect(packageService.createPackage).not.toHaveBeenCalled();
    });

    it('should handle API errors during package creation', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      vi.mocked(packageService.createPackage).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to create package',
          },
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });

      // Fill form
      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Test Package' } });
      fireEvent.change(inputs[1], { target: { value: 'Test Destination' } });
      fireEvent.change(inputs[2], { target: { value: 'Test Description' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to create package');
      });
    });
  });

  describe('Package Editing', () => {
    it('should open modal with package data when Edit button is clicked', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Mountain Adventure',
        destination: 'Switzerland',
        duration: 5,
        price: 3000,
        description: 'Exciting mountain trek',
        itinerary: ['Day 1: Arrival', 'Day 2: Trek'],
        inclusions: ['Guide', 'Equipment'],
        exclusions: ['Insurance'],
        images: ['image1.jpg', 'image2.jpg'],
        thumbnail: 'thumb.jpg',
        featured: true,
        active: true,
        category: 'Adventure',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Mountain Adventure')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Package')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Mountain Adventure')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Switzerland')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
        expect(screen.getByDisplayValue('3000')).toBeInTheDocument();
      });
    });

    it('should update package with modified data', async () => {
      const user = userEvent.setup();
      
      const mockPackage = {
        _id: '1',
        name: 'City Tour',
        destination: 'Paris',
        duration: 3,
        price: 1500,
        description: 'Explore the city',
        itinerary: ['Day 1: Museums'],
        inclusions: ['Guide'],
        exclusions: ['Meals'],
        images: ['image1.jpg'],
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      vi.mocked(packageService.updatePackage).mockResolvedValue({
        success: true,
        data: { ...mockPackage, price: 1800 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('City Tour')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
      });

      // Modify price
      const priceInput = screen.getByDisplayValue('1500');
      await user.clear(priceInput);
      await user.type(priceInput, '1800');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /update package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(packageService.updatePackage).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            price: 1800,
          })
        );
      });

      expect(mockAlert).toHaveBeenCalledWith('Package updated successfully!');
    });

    it('should handle API errors during package update', async () => {
      const user = userEvent.setup();
      
      const mockPackage = {
        _id: '1',
        name: 'Safari Tour',
        destination: 'Kenya',
        duration: 7,
        price: 4000,
        description: 'Wildlife safari',
        itinerary: ['Day 1: Safari'],
        inclusions: ['Transport'],
        exclusions: ['Tips'],
        images: ['image1.jpg'],
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      vi.mocked(packageService.updatePackage).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to update package',
          },
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Safari Tour')).toBeInTheDocument();
      });

      // Click edit and modify
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Safari Tour')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Safari Tour');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Safari Tour');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /update package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to update package');
      });
    });
  });

  describe('Package Deletion', () => {
    it('should require confirmation before deleting package', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Island Hopping',
        destination: 'Greece',
        duration: 10,
        price: 3500,
        description: 'Visit multiple islands',
        itinerary: ['Day 1: Athens'],
        inclusions: ['Ferry tickets'],
        exclusions: ['Meals'],
        images: ['image1.jpg'],
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Island Hopping')).toBeInTheDocument();
      });

      // First click - should show confirmation
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm?')).toBeInTheDocument();
      });

      expect(packageService.deletePackage).not.toHaveBeenCalled();
    });

    it('should delete package after confirmation', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Cruise Package',
        destination: 'Caribbean',
        duration: 14,
        price: 5000,
        description: 'Luxury cruise',
        itinerary: ['Day 1: Departure'],
        inclusions: ['All meals'],
        exclusions: ['Excursions'],
        images: ['image1.jpg'],
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      vi.mocked(packageService.deletePackage).mockResolvedValue({
        success: true,
        message: 'Package deleted',
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Cruise Package')).toBeInTheDocument();
      });

      // First click
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm?')).toBeInTheDocument();
      });

      // Second click to confirm
      const confirmButton = screen.getByText('Confirm?');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(packageService.deletePackage).toHaveBeenCalledWith('1');
      });

      expect(mockAlert).toHaveBeenCalledWith('Package deleted successfully!');
    });

    it('should handle API errors during package deletion', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Desert Safari',
        destination: 'Dubai',
        duration: 1,
        price: 500,
        description: 'Desert adventure',
        itinerary: ['Evening safari'],
        inclusions: ['Transport', 'Dinner'],
        exclusions: ['Tips'],
        images: ['image1.jpg'],
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      vi.mocked(packageService.deletePackage).mockRejectedValue({
        response: {
          data: {
            message: 'Failed to delete package',
          },
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Desert Safari')).toBeInTheDocument();
      });

      // Click delete twice
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm?');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to delete package');
      });
    });
  });

  describe('Image Upload', () => {
    it('should accept image URLs in the images field', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      vi.mocked(packageService.createPackage).mockResolvedValue({
        success: true,
        data: {
          _id: '1',
          name: 'Test Package',
          destination: 'Test',
          duration: 5,
          price: 1000,
          description: 'Test description',
          itinerary: [],
          inclusions: [],
          exclusions: [],
          images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
          featured: false,
          active: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });

      // Get all textboxes - images field is one of the textareas
      const inputs = screen.getAllByRole('textbox');
      
      // Fill required fields (first 3 are name, destination, description)
      fireEvent.change(inputs[0], { target: { value: 'Test Package' } });
      fireEvent.change(inputs[1], { target: { value: 'Test' } });
      fireEvent.change(inputs[2], { target: { value: 'Test description' } });

      // Images field is typically the 6th textarea (after itinerary, inclusions, exclusions)
      const imagesField = inputs[5];
      fireEvent.change(imagesField, { target: { value: 'https://example.com/image1.jpg\nhttps://example.com/image2.jpg' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(packageService.createPackage).toHaveBeenCalledWith(
          expect.objectContaining({
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
          })
        );
      });
    });

    it('should accept thumbnail URL in the thumbnail field', async () => {
      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, pages: 0 },
      });

      vi.mocked(packageService.createPackage).mockResolvedValue({
        success: true,
        data: {
          _id: '1',
          name: 'Test Package',
          destination: 'Test',
          duration: 5,
          price: 1000,
          description: 'Test description',
          itinerary: [],
          inclusions: [],
          exclusions: [],
          images: [],
          thumbnail: 'https://example.com/thumbnail.jpg',
          featured: false,
          active: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Add New Package')).toBeInTheDocument();
      });

      // Open modal
      const addButton = screen.getByText('Add New Package');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Package Name')).toBeInTheDocument();
      });

      // Get all textboxes
      const inputs = screen.getAllByRole('textbox');
      
      // Fill required fields
      fireEvent.change(inputs[0], { target: { value: 'Test Package' } });
      fireEvent.change(inputs[1], { target: { value: 'Test' } });
      fireEvent.change(inputs[2], { target: { value: 'Test description' } });

      // Thumbnail field is after images field
      const thumbnailField = inputs[6];
      fireEvent.change(thumbnailField, { target: { value: 'https://example.com/thumbnail.jpg' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create package/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(packageService.createPackage).toHaveBeenCalledWith(
          expect.objectContaining({
            thumbnail: 'https://example.com/thumbnail.jpg',
          })
        );
      });
    });

    it('should display thumbnail image in package list when available', async () => {
      const mockPackage = {
        _id: '1',
        name: 'Tropical Paradise',
        destination: 'Bali',
        duration: 7,
        price: 2000,
        description: 'Beach resort',
        itinerary: ['Day 1: Arrival'],
        inclusions: ['Hotel'],
        exclusions: ['Flights'],
        images: ['image1.jpg'],
        thumbnail: 'https://example.com/thumbnail.jpg',
        featured: false,
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      vi.mocked(packageService.getPackages).mockResolvedValue({
        success: true,
        data: [mockPackage],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      });

      act(() => {
        render(<PackageManagementPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Tropical Paradise')).toBeInTheDocument();
      });

      const thumbnailImage = screen.getByAltText('Tropical Paradise');
      expect(thumbnailImage).toBeInTheDocument();
      expect(thumbnailImage).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
    });
  });
});
