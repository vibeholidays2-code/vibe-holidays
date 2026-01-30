import { Link } from 'react-router-dom';
import { Package } from '../types/package';
import Card from './Card';

interface PackageCardProps {
  package: Package;
}

const PackageCard = ({ package: pkg }: PackageCardProps) => {
  const imageUrl = pkg.thumbnail || pkg.images[0] || '/placeholder-image.jpg';

  return (
    <Link to={`/packages/${pkg._id}`}>
      <Card padding="none" hover className="h-full overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {pkg.featured && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {pkg.name}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm">{pkg.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{pkg.duration} days</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {pkg.description}
          </p>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ₹{pkg.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm ml-1">per person</span>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View Details →
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PackageCard;
