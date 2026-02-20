import { useState, useEffect } from 'react';

interface Review {
    _id: string;
    name: string;
    email?: string;
    rating: number;
    comment: string;
    destination?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const ReviewManagementPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [error, setError] = useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const response = await fetch(`${apiUrl}/admin/reviews${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data.data || []);
            } else {
                setError('Failed to fetch reviews');
            }
        } catch {
            setError('Unable to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/admin/reviews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                fetchReviews();
            }
        } catch {
            alert('Failed to update review status');
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                fetchReviews();
            }
        } catch {
            alert('Failed to delete review');
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const statusCounts = {
        all: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                <p className="text-gray-600 mt-1">Manage customer reviews and testimonials</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', count: statusCounts.all, color: 'bg-blue-500', filterVal: 'all' },
                    { label: 'Pending', count: statusCounts.pending, color: 'bg-yellow-500', filterVal: 'pending' },
                    { label: 'Approved', count: statusCounts.approved, color: 'bg-green-500', filterVal: 'approved' },
                    { label: 'Rejected', count: statusCounts.rejected, color: 'bg-red-500', filterVal: 'rejected' },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setFilter(stat.filterVal)}
                        className={`p-4 rounded-xl border transition-all ${filter === stat.filterVal
                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2`}>
                            {stat.count}
                        </div>
                        <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4" />
                        <p className="text-gray-500">Loading reviews...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchReviews}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-4xl mb-4">⭐</div>
                        <p className="font-medium">No reviews found</p>
                        <p className="text-sm mt-1">Reviews submitted by customers will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-900">{review.name}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[review.status]}`}>
                                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                            </span>
                                            {review.destination && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    📍 {review.destination}
                                                </span>
                                            )}
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={`text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                                                    ★
                                                </span>
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">({review.rating}/5)</span>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.comment}</p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            {review.email && <span>📧 {review.email}</span>}
                                            <span>🕐 {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {review.status !== 'approved' && (
                                            <button
                                                onClick={() => updateStatus(review._id, 'approved')}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                ✓ Approve
                                            </button>
                                        )}
                                        {review.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateStatus(review._id, 'rejected')}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                ✕ Reject
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteReview(review._id)}
                                            className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagementPage;
