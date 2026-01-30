import { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  package?: {
    id: string;
    name: string;
    destination: string;
  } | null;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

const InquiryManagementPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await api.get('/admin/inquiries', { params });
      setInquiries(response.data.data.inquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailsModalOpen(true);
    
    // Mark as read if it's new
    if (inquiry.status === 'new') {
      await handleStatusChange(inquiry.id, 'read');
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleOpenReplyModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedInquiry(null);
    setReplyMessage('');
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await api.put(`/admin/inquiries/${inquiryId}`, { status: newStatus });
      
      // Update local state
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus as 'new' | 'read' | 'responded' }
          : inquiry
      ));
      
      // Update selected inquiry if it's the one being updated
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as 'new' | 'read' | 'responded' });
      }
    } catch (error: any) {
      console.error('Error updating inquiry status:', error);
      alert(error.response?.data?.message || 'Failed to update inquiry status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      setSendingReply(true);
      
      // In a real application, you would have a dedicated endpoint for sending replies
      // For now, we'll simulate this by creating a mailto link and marking as responded
      const subject = `Re: Your inquiry${selectedInquiry.package ? ` about ${selectedInquiry.package.name}` : ''}`;
      const body = replyMessage;
      const mailtoLink = `mailto:${selectedInquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Mark as responded
      await handleStatusChange(selectedInquiry.id, 'responded');
      
      alert('Email client opened. Please send the email from your email application.');
      handleCloseReplyModal();
    } catch (error: any) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      case 'read':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
          </svg>
        );
      case 'responded':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
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
        <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
            options={[
              { value: '', label: 'All Inquiries' },
              { value: 'new', label: 'New' },
              { value: 'read', label: 'Read' },
              { value: 'responded', label: 'Responded' },
            ]}
          />
          {statusFilter && (
            <Button
              variant="outline"
              onClick={() => setStatusFilter('')}
              className="text-sm"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No inquiries found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  inquiry.status === 'new' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(inquiry.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.name}
                          </h3>
                          <p className="text-sm text-gray-600">{inquiry.email}</p>
                          {inquiry.phone && (
                            <p className="text-sm text-gray-600">{inquiry.phone}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status}
                          </span>
                        </div>
                      </div>

                      {inquiry.package && (
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                            Package: {inquiry.package.name} - {inquiry.package.destination}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {inquiry.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewDetails(inquiry)}
                            className="text-sm text-primary-600 hover:text-primary-900 font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleOpenReplyModal(inquiry)}
                            className="text-sm text-green-600 hover:text-green-900 font-medium"
                          >
                            Quick Reply
                          </button>
                          {inquiry.status !== 'responded' && (
                            <button
                              onClick={() => handleStatusChange(inquiry.id, 'responded')}
                              disabled={updatingStatus}
                              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                              Mark as Responded
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title="Inquiry Details"
        size="lg"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInquiry.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInquiry.email}
                  </p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedInquiry.phone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Inquiry Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Package Information */}
            {selectedInquiry.package && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Package of Interest
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInquiry.package.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedInquiry.package.destination}
                  </p>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                    selectedInquiry.status
                  )}`}
                >
                  {selectedInquiry.status}
                </span>
                {selectedInquiry.status !== 'responded' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedInquiry.id, 'responded')}
                    disabled={updatingStatus}
                  >
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>

            {/* Inquiry ID */}
            <div>
              <p className="text-xs text-gray-500">Inquiry ID: {selectedInquiry.id}</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={handleCloseDetailsModal}>
                Close
              </Button>
              <Button onClick={() => {
                handleCloseDetailsModal();
                handleOpenReplyModal(selectedInquiry);
              }}>
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Quick Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={handleCloseReplyModal}
        title="Quick Reply"
        size="lg"
      >
        {selectedInquiry && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Replying to:</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedInquiry.name} ({selectedInquiry.email})
              </p>
              {selectedInquiry.package && (
                <p className="text-sm text-gray-600 mt-2">
                  Re: {selectedInquiry.package.name}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Original Message:
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {selectedInquiry.message}
              </p>
            </div>

            <Textarea
              label="Your Reply"
              required
              rows={8}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              helperText="This will open your email client with the reply pre-filled"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={handleCloseReplyModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                isLoading={sendingReply}
                disabled={!replyMessage.trim()}
              >
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InquiryManagementPage;
