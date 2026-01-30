import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Button from './Button';

interface InquiryFormProps {
  preselectedPackageId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  packageId?: string;
  message: string;
}

interface Package {
  _id: string;
  name: string;
  destination: string;
}

const InquiryForm = ({
  preselectedPackageId,
  onSuccess,
  onCancel,
}: InquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InquiryFormData>({
    defaultValues: {
      packageId: preselectedPackageId || '',
    },
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        setPackages(response.data.data || response.data);
        setLoadingPackages(false);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (preselectedPackageId) {
      setValue('packageId', preselectedPackageId);
    }
  }, [preselectedPackageId, setValue]);

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const inquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        packageId: data.packageId || undefined,
        message: data.message,
      };

      await api.post('/inquiries', inquiryData);
      
      setSubmitSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to submit inquiry. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Inquiry Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          Thank you for your inquiry. We've received your message and sent an acknowledgment to your email.
          Our team will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  const packageOptions = [
    { value: '', label: 'Select a package (optional)' },
    ...packages.map((pkg) => ({
      value: pkg._id,
      label: `${pkg.name} - ${pkg.destination}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
          required
        />

        <Input
          label="Email Address"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email?.message}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          {...register('phone', {
            minLength: {
              value: 10,
              message: 'Phone number must be at least 10 digits',
            },
          })}
          error={errors.phone?.message}
          helperText="Optional - we'll call you if needed"
        />

        {loadingPackages ? (
          <div className="text-sm text-gray-500">Loading packages...</div>
        ) : (
          <Select
            label="Package of Interest"
            {...register('packageId')}
            options={packageOptions}
            error={errors.packageId?.message}
            helperText="Optional - select if inquiring about a specific package"
          />
        )}

        <Textarea
          label="Your Message"
          rows={6}
          {...register('message', {
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters',
            },
          })}
          error={errors.message?.message}
          helperText="Tell us about your travel plans, questions, or special requirements"
          required
        />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Submit Inquiry
        </Button>
      </div>
    </form>
  );
};

export default InquiryForm;
