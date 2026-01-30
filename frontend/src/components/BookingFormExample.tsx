/**
 * Example usage of BookingForm component
 * 
 * This file demonstrates how to integrate the BookingForm into a page or modal.
 * You can use this as a reference when implementing the booking functionality
 * in PackageDetailPage or other components.
 */

import { useState } from 'react';
import Modal from './Modal';
import BookingForm from './BookingForm';
import Button from './Button';

const BookingFormExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Example package data - in real usage, this would come from props or API
  const examplePackage = {
    id: '507f1f77bcf86cd799439011',
    name: 'Bali Paradise Getaway',
    price: 1299,
  };

  const handleBookingSuccess = () => {
    console.log('Booking submitted successfully!');
    // Close modal after a delay to show success message
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        Book This Package
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Complete Your Booking"
        size="lg"
      >
        <BookingForm
          packageId={examplePackage.id}
          packageName={examplePackage.name}
          packagePrice={examplePackage.price}
          onSuccess={handleBookingSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BookingFormExample;
