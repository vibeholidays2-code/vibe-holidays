import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Gallery } from '../../types/gallery';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';

interface UploadFormData {
  category: string;
  caption: string;
  destination: string;
  order: number;
}

const GalleryManagementPage = () => {
  const [images, setImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Gallery | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<UploadFormData>({
    category: '',
    caption: '',
    destination: '',
    order: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [categoryFilter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      const response = await api.get('/gallery', { params });
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadModal = () => {
    setFormData({
      category: '',
      caption: '',
      destination: '',
      order: 0,
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setFormErrors({});
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setFormErrors({});
  };

  const handleOpenEditModal = (image: Gallery) => {
    setEditingImage(image);
    setFormData({
      category: image.category,
      caption: image.caption || '',
      destination: image.destination || '',
      order: image.order,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
    setFormErrors({});
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({ file: 'Please select a valid image file (JPEG, PNG, or WebP)' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormErrors({ file: 'File size must be less than 5MB' });
      return;
    }

    setSelectedFile(file);
    setFormErrors({});

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const validateUploadForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedFile) {
      errors.file = 'Please select an image file';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUploadForm()) {
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile!);
      formDataToSend.append('category', formData.category.trim());
      if (formData.caption.trim()) {
        formDataToSend.append('caption', formData.caption.trim());
      }
      if (formData.destination.trim()) {
        formDataToSend.append('destination', formData.destination.trim());
      }
      formDataToSend.append('order', formData.order.toString());

      await api.post('/admin/gallery', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Image uploaded successfully!');
      handleCloseUploadModal();
      fetchImages();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          apiErrors[err.field] = err.message;
        });
        setFormErrors(apiErrors);
      } else {
        alert(error.response?.data?.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || !editingImage) {
      return;
    }

    setUploading(true);

    try {
      const updateData = {
        category: formData.category.trim(),
        caption: formData.caption.trim() || undefined,
        destination: formData.destination.trim() || undefined,
        order: formData.order,
      };

      await api.put(`/admin/gallery/${editingImage._id}`, updateData);

      alert('Image updated successfully!');
      handleCloseEditModal();
      fetchImages();
    } catch (error: any) {
      console.error('Error updating image:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          apiErrors[err.field] = err.message;
        });
        setFormErrors(apiErrors);
      } else {
        alert(error.response?.data?.message || 'Failed to update image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await api.delete(`/admin/gallery/${id}`);
      alert('Image deleted successfully!');
      fetchImages();
      setSelectedImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      alert(error.response?.data?.message || 'Failed to delete image');
    }
  };

  const handleToggleSelectImage = (id: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) {
      alert('Please select images to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) {
      return;
    }

    try {
      // Delete images one by one
      const deletePromises = Array.from(selectedImages).map((id) =>
        api.delete(`/admin/gallery/${id}`)
      );

      await Promise.all(deletePromises);

      alert(`${selectedImages.size} image(s) deleted successfully!`);
      setSelectedImages(new Set());
      fetchImages();
    } catch (error: any) {
      console.error('Error deleting images:', error);
      alert('Failed to delete some images');
      fetchImages(); // Refresh to show current state
    }
  };

  // Get unique categories from images
  const categories = Array.from(new Set(images.map((img) => img.category))).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
        <div className="flex space-x-3">
          {selectedImages.size > 0 && (
            <Button variant="outline" onClick={handleBulkDelete}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Selected ({selectedImages.size})
            </Button>
          )}
          <Button onClick={handleOpenUploadModal}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Image
          </Button>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Category:
            </label>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-48"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({ value: cat, label: cat })),
              ]}
            />
            {categoryFilter && (
              <Button
                variant="outline"
                onClick={() => setCategoryFilter('')}
                className="text-sm"
              >
                Clear Filter
              </Button>
            )}
          </div>

          {images.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary-600 hover:text-primary-900 font-medium"
            >
              {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 mb-4 mt-4">No images found</p>
          <Button onClick={handleOpenUploadModal}>Upload Your First Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className={`relative group bg-white rounded-lg shadow-md overflow-hidden ${
                selectedImages.has(image._id) ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedImages.has(image._id)}
                  onChange={() => handleToggleSelectImage(image._id)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
              </div>

              {/* Image */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.caption || image.category}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                    {image.category}
                  </span>
                  {image.destination && (
                    <span className="text-xs text-gray-500">{image.destination}</span>
                  )}
                </div>
                {image.caption && (
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {image.caption}
                  </p>
                )}
                <p className="text-xs text-gray-500">Order: {image.order}</p>
              </div>

              {/* Action Buttons (shown on hover) */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(image)}
                    className="bg-white text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        title="Upload Image"
        size="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop an image here, or
                </p>
                <label className="mt-2 inline-block">
                  <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                    browse files
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, or WebP (max 5MB)
                </p>
              </div>
            )}
            {formErrors.file && (
              <p className="mt-2 text-sm text-red-600">{formErrors.file}</p>
            )}
          </div>

          {/* Form Fields */}
          <Input
            label="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={formErrors.category}
            placeholder="e.g., Beaches, Mountains, Cities"
          />

          <Input
            label="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g., Bali, Switzerland"
          />

          <Textarea
            label="Caption"
            rows={3}
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="Add a description for this image"
          />

          <Input
            label="Display Order"
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            helperText="Lower numbers appear first"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseUploadModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={uploading}>
              Upload Image
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Image Metadata"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {editingImage && (
            <div className="mb-4">
              <img
                src={editingImage.url}
                alt={editingImage.caption || editingImage.category}
                className="max-h-48 mx-auto rounded"
              />
            </div>
          )}

          <Input
            label="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={formErrors.category}
            placeholder="e.g., Beaches, Mountains, Cities"
          />

          <Input
            label="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g., Bali, Switzerland"
          />

          <Textarea
            label="Caption"
            rows={3}
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="Add a description for this image"
          />

          <Input
            label="Display Order"
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            helperText="Lower numbers appear first"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={uploading}>
              Update Image
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryManagementPage;
