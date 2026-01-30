import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

interface BookingFormProps {
  packageId: string;
  packageName: string;
  packagePrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  numberOfTravelers: number;
  specialRequests?: string;
}

const BookingForm = ({
  packageId,
  packageName,
  packagePrice,
  onSuccess,
  onCancel,
}: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<BookingFormData>();

  const numberOfTravelers = watch('numberOfTravelers', 1);
  const totalPrice = packagePrice * numberOfTravelers;

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['customerName', 'email', 'phone'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData = {
        packageId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        travelDate: data.travelDate,
        numberOfTravelers: data.numberOfTravelers,
        specialRequests: data.specialRequests || '',
        totalPrice,
      };

      await api.post('/bookings', bookingData);
      
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
        'Failed to submit booking. Please try again.';
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
          Booking Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          We've received your booking request and sent a confirmation email to your address.
          Our team will contact you shortly to confirm your booking.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Package Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">{packageName}</h4>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Price per person:</span>
          <span className="font-medium">₹{packagePrice}</span>
        </div>
        {numberOfTravelers > 0 && (
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Number of travelers:</span>
            <span className="font-medium">{numberOfTravelers}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            Personal Info
          </span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            Travel Details
          </span>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            {...register('customerName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            error={errors.customerName?.message}
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
              required: 'Phone number is required',
              minLength: {
                value: 10,
                message: 'Phone number must be at least 10 digits',
              },
            })}
            error={errors.phone?.message}
            required
          />
        </div>
      )}

      {/* Step 2: Travel Details */}
      {step === 2 && (
        <div className="space-y-4">
          <Input
            label="Travel Date"
            type="date"
            {...register('travelDate', {
              required: 'Travel date is required',
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  selectedDate > today ||
                  'Travel date must be in the future'
                );
              },
            })}
            error={errors.travelDate?.message}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          <Input
            label="Number of Travelers"
            type="number"
            {...register('numberOfTravelers', {
              required: 'Number of travelers is required',
              min: {
                value: 1,
                message: 'At least 1 traveler is required',
              },
              max: {
                value: 20,
                message: 'Maximum 20 travelers allowed',
              },
              valueAsNumber: true,
            })}
            error={errors.numberOfTravelers?.message}
            min={1}
            max={20}
            required
          />

          <Textarea
            label="Special Requests"
            rows={4}
            {...register('specialRequests')}
            error={errors.specialRequests?.message}
            helperText="Any dietary requirements, accessibility needs, or special preferences"
          />
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between pt-4">
        {step === 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
          >
            Back
          </Button>
        )}

        {step === 1 ? (
          <Button type="button" onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit" isLoading={isSubmitting}>
            Submit Booking
          </Button>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
