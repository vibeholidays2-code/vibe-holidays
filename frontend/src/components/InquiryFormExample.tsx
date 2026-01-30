/**
 * Example usage of InquiryForm component
 * 
 * This file demonstrates how to integrate the InquiryForm into a page or modal.
 * You can use this as a reference when implementing the inquiry functionality
 * in ContactPage or other components.
 */

import { useState } from 'react';
import Modal from './Modal';
import InquiryForm from './InquiryForm';
import Button from './Button';

const InquiryFormExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInquirySuccess = () => {
    console.log('Inquiry submitted successfully!');
    // Close modal after a delay to show success message
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div>
      {/* Example 1: General inquiry button */}
      <Button onClick={() => setIsModalOpen(true)}>
        Make an Inquiry
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Send Us an Inquiry"
        size="lg"
      >
        <InquiryForm
          onSuccess={handleInquirySuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Example 2: Inquiry with preselected package */}
      {/* 
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inquire About This Package"
        size="lg"
      >
        <InquiryForm
          preselectedPackageId="507f1f77bcf86cd799439011"
          onSuccess={handleInquirySuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      */}
    </div>
  );
};

export default InquiryFormExample;
