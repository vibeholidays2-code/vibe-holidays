import { ReactNode } from 'react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'error' | 'warning' | 'info';
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  illustration?: 'packages' | 'search' | 'gallery' | 'generic';
}

// Professional error state component
const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  icon,
  action,
  className = "",
  variant = "error"
}: ErrorStateProps) => {
  const variantStyles = {
    error: {
      iconBg: 'bg-error-100',
      iconColor: 'text-error-600',
      titleColor: 'text-error-700',
      messageColor: 'text-error-600'
    },
    warning: {
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      titleColor: 'text-secondary-700',
      messageColor: 'text-secondary-600'
    },
    info: {
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      titleColor: 'text-primary-700',
      messageColor: 'text-primary-600'
    }
  };

  const styles = variantStyles[variant];

  const defaultIcon = (
    <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
      <svg
        className={`w-8 h-8 ${styles.iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in ${className}`}>
      {icon || defaultIcon}
      <h3 className={`text-xl font-semibold mb-3 ${styles.titleColor}`}>
        {title}
      </h3>
      <p className={`text-base ${styles.messageColor} mb-8 max-w-md leading-relaxed`}>
        {message}
      </p>
      {action && (
        <Button
          variant={variant === 'error' ? 'secondary' : 'primary'}
          onClick={action.onClick}
          className="min-w-32"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Professional empty state component
const EmptyState = ({
  title = "No items found",
  message = "There are no items to display at the moment.",
  icon,
  action,
  className = "",
  illustration = "generic"
}: EmptyStateProps) => {
  const renderIllustration = () => {
    switch (illustration) {
      case 'packages':
        return (
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        );
      
      case 'search':
        return (
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        );
      
      case 'gallery':
        return (
          <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-secondary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      
      default:
        return (
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in ${className}`}>
      {icon || renderIllustration()}
      <h3 className="text-xl font-semibold text-neutral-700 mb-3">
        {title}
      </h3>
      <p className="text-base text-neutral-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          className="min-w-32"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Network error component
export const NetworkError = ({
  onRetry,
  className = ""
}: {
  onRetry?: () => void;
  className?: string;
}) => (
  <ErrorState
    title="Connection Problem"
    message="Unable to connect to our servers. Please check your internet connection and try again."
    variant="warning"
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry
    } : undefined}
    icon={
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-secondary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
      </div>
    }
    className={className}
  />
);

// Form validation error component
export const FormError = ({
  message,
  onDismiss,
  className = ""
}: {
  message: string;
  onDismiss?: () => void;
  className?: string;
}) => (
  <div className={`bg-error-50 border border-error-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in ${className}`}>
    <div className="flex-shrink-0">
      <svg
        className="w-5 h-5 text-error-600 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-error-700">
        {message}
      </p>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-error-400 hover:text-error-600 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// Success message component
export const SuccessMessage = ({
  message,
  onDismiss,
  className = ""
}: {
  message: string;
  onDismiss?: () => void;
  className?: string;
}) => (
  <div className={`bg-success-50 border border-success-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in ${className}`}>
    <div className="flex-shrink-0">
      <svg
        className="w-5 h-5 text-success-600 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-success-700">
        {message}
      </p>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-success-400 hover:text-success-600 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// Empty search results
export const EmptySearchResults = ({
  searchTerm,
  onClearSearch,
  onBrowseAll,
  className = ""
}: {
  searchTerm?: string;
  onClearSearch?: () => void;
  onBrowseAll?: () => void;
  className?: string;
}) => (
  <EmptyState
    title="No results found"
    message={searchTerm 
      ? `We couldn't find any packages matching "${searchTerm}". Try adjusting your search terms or browse all packages.`
      : "No packages match your current filters. Try adjusting your criteria."
    }
    illustration="search"
    action={onBrowseAll ? {
      label: "Browse All Packages",
      onClick: onBrowseAll
    } : onClearSearch ? {
      label: "Clear Search",
      onClick: onClearSearch
    } : undefined}
    className={className}
  />
);

// Empty package list
export const EmptyPackageList = ({
  onAddPackage,
  className = ""
}: {
  onAddPackage?: () => void;
  className?: string;
}) => (
  <EmptyState
    title="No packages available"
    message="There are no travel packages available at the moment. Check back soon for exciting new destinations!"
    illustration="packages"
    action={onAddPackage ? {
      label: "Add Package",
      onClick: onAddPackage
    } : undefined}
    className={className}
  />
);

// Empty gallery
export const EmptyGallery = ({
  onUploadImages,
  className = ""
}: {
  onUploadImages?: () => void;
  className?: string;
}) => (
  <EmptyState
    title="No images in gallery"
    message="Start building your gallery by uploading beautiful travel photos that showcase your destinations."
    illustration="gallery"
    action={onUploadImages ? {
      label: "Upload Images",
      onClick: onUploadImages
    } : undefined}
    className={className}
  />
);

// 404 Not Found
export const NotFound = ({
  onGoHome,
  className = ""
}: {
  onGoHome?: () => void;
  className?: string;
}) => (
  <ErrorState
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
    variant="info"
    action={onGoHome ? {
      label: "Go Home",
      onClick: onGoHome
    } : undefined}
    icon={
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    }
    className={className}
  />
);

export default ErrorState;
export { EmptyState };