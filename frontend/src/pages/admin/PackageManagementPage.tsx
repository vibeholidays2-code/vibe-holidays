import { useState, useEffect } from 'react';
import { packageService } from '../../services/packageService';
import { Package } from '../../types/package';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';

interface PackageFormData {
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  images: string;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  category: string;
}

const PackageManagementPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    destination: '',
    duration: 1,
    price: 0,
    description: '',
    itinerary: '',
    inclusions: '',
    exclusions: '',
    images: '',
    thumbnail: '',
    featured: false,
    active: true,
    category: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // Fetch all packages including inactive ones for admin view
      const response = await packageService.getPackages({ limit: 100 });
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      alert('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        destination: pkg.destination,
        duration: pkg.duration,
        price: pkg.price,
        description: pkg.description,
        itinerary: pkg.itinerary.join('\n'),
        inclusions: pkg.inclusions.join('\n'),
        exclusions: pkg.exclusions.join('\n'),
        images: pkg.images.join('\n'),
        thumbnail: pkg.thumbnail || '',
        featured: pkg.featured,
        active: pkg.active,
        category: pkg.category || '',
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        destination: '',
        duration: 1,
        price: 0,
        description: '',
        itinerary: '',
        inclusions: '',
        exclusions: '',
        images: '',
        thumbnail: '',
        featured: false,
        active: true,
        category: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Package name is required';
    }
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }
    if (formData.duration < 1) {
      errors.duration = 'Duration must be at least 1 day';
    }
    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const packageData = {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        duration: formData.duration,
        price: formData.price,
        description: formData.description.trim(),
        itinerary: formData.itinerary
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item),
        inclusions: formData.inclusions
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item),
        exclusions: formData.exclusions
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item),
        images: formData.images
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item),
        thumbnail: formData.thumbnail.trim() || undefined,
        featured: formData.featured,
        active: formData.active,
        category: formData.category.trim() || undefined,
      };

      if (editingPackage) {
        await packageService.updatePackage(editingPackage._id, packageData);
        alert('Package updated successfully!');
      } else {
        await packageService.createPackage(packageData);
        alert('Package created successfully!');
      }

      handleCloseModal();
      fetchPackages();
    } catch (error: any) {
      console.error('Error saving package:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          apiErrors[err.field] = err.message;
        });
        setFormErrors(apiErrors);
      } else {
        alert(error.response?.data?.message || 'Failed to save package');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await packageService.deletePackage(id);
      alert('Package deleted successfully!');
      fetchPackages();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Error deleting package:', error);
      alert(error.response?.data?.message || 'Failed to delete package');
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      await packageService.updatePackage(pkg._id, { active: !pkg.active });
      fetchPackages();
    } catch (error: any) {
      console.error('Error toggling package status:', error);
      alert(error.response?.data?.message || 'Failed to update package status');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
        <Button onClick={() => handleOpenModal()}>
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
          Add New Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No packages found</p>
          <Button onClick={() => handleOpenModal()}>Create Your First Package</Button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {pkg.thumbnail && (
                        <img
                          src={pkg.thumbnail}
                          alt={pkg.name}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.name}
                        </div>
                        {pkg.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.duration} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${pkg.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pkg.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(pkg)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className={`${
                        deleteConfirm === pkg._id
                          ? 'text-red-900 font-bold'
                          : 'text-red-600 hover:text-red-900'
                      }`}
                    >
                      {deleteConfirm === pkg._id ? 'Confirm?' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Package Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <Input
              label="Destination"
              required
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              error={formErrors.destination}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Duration (days)"
              type="number"
              required
              min="1"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })
              }
              error={formErrors.duration}
            />
            <Input
              label="Price ($)"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              error={formErrors.price}
            />
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={formErrors.description}
            helperText="Provide a detailed description of the package"
          />

          <Textarea
            label="Itinerary"
            rows={4}
            value={formData.itinerary}
            onChange={(e) =>
              setFormData({ ...formData, itinerary: e.target.value })
            }
            helperText="Enter each day's itinerary on a new line"
          />

          <Textarea
            label="Inclusions"
            rows={3}
            value={formData.inclusions}
            onChange={(e) =>
              setFormData({ ...formData, inclusions: e.target.value })
            }
            helperText="Enter each inclusion on a new line"
          />

          <Textarea
            label="Exclusions"
            rows={3}
            value={formData.exclusions}
            onChange={(e) =>
              setFormData({ ...formData, exclusions: e.target.value })
            }
            helperText="Enter each exclusion on a new line"
          />

          <Textarea
            label="Image URLs"
            rows={3}
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            helperText="Enter each image URL on a new line"
          />

          <Input
            label="Thumbnail URL"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            helperText="URL for the package thumbnail image"
          />

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Package</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackageManagementPage;
