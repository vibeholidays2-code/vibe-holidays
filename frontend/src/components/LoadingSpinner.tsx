interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring' | 'gradient' | 'orbit';
  className?: string;
  text?: string;
  color?: 'primary' | 'secondary' | 'neutral';
  showBackground?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '', 
  text,
  color = 'primary',
  showBackground = false
}: LoadingSpinnerProps) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorStyles = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    neutral: 'text-neutral-600',
  };

  const backgroundColorStyles = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    neutral: 'bg-neutral-600',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`${sizeStyles[size].replace('h-', 'h-').replace('w-', 'w-').split(' ')[0].replace('h-', 'w-')} ${sizeStyles[size].split(' ')[0]} ${backgroundColorStyles[color]} rounded-full animate-bounce`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeStyles[size]} ${backgroundColorStyles[color]} rounded-full animate-pulse opacity-75`} />
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`w-1 ${backgroundColorStyles[color]} animate-pulse rounded-sm`}
                style={{
                  height: `${[0.5, 0.75, 1, 0.75][index] * (size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40)}px`,
                  animationDelay: `${index * 0.15}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeStyles[size]} relative`}>
            <div className={`absolute inset-0 ${colorStyles[color].replace('text-', 'border-')} border-4 border-opacity-20 rounded-full`} />
            <div className={`absolute inset-0 ${colorStyles[color].replace('text-', 'border-t-')} border-4 border-transparent border-t-4 rounded-full animate-spin`} />
          </div>
        );

      case 'gradient':
        return (
          <div className={`${sizeStyles[size]} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 rounded-full animate-spin opacity-75" />
            <div className="absolute inset-1 bg-white rounded-full" />
            <div className="absolute inset-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse" />
          </div>
        );

      case 'orbit':
        return (
          <div className={`${sizeStyles[size]} relative`}>
            <div className={`absolute inset-0 ${backgroundColorStyles[color]} rounded-full opacity-20`} />
            <div className={`absolute top-0 left-1/2 w-2 h-2 ${backgroundColorStyles[color]} rounded-full animate-spin`} 
                 style={{ transformOrigin: `0 ${sizeStyles[size].split(' ')[0].replace('h-', '')}` }} />
            <div className={`absolute top-1/2 right-0 w-1 h-1 ${backgroundColorStyles[color]} rounded-full animate-spin opacity-60`} 
                 style={{ 
                   transformOrigin: `-${sizeStyles[size].split(' ')[1].replace('w-', '')} 0`,
                   animationDelay: '0.5s',
                   animationDuration: '2s'
                 }} />
          </div>
        );

      default:
        return (
          <svg
            className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${showBackground ? 'bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-neutral-100' : ''} ${className}`} role="status" aria-label="Loading">
      {renderSpinner()}
      {text && (
        <p className={`${textSizeStyles[size]} ${colorStyles[color]} font-medium animate-fade-in`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Professional loading overlay component
export const LoadingOverlay = ({ 
  isVisible, 
  text = "Loading...", 
  className = "",
  variant = "ring",
  showProgress = false,
  progress = 0
}: { 
  isVisible: boolean; 
  text?: string; 
  className?: string;
  variant?: 'ring' | 'gradient' | 'dots';
  showProgress?: boolean;
  progress?: number;
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in ${className}`}>
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm mx-4 border border-neutral-200/50 animate-scale-in">
        <LoadingSpinner size="lg" variant={variant} text={text} showBackground={false} />
        {showProgress && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline loading state for content areas
export const InlineLoader = ({ 
  text = "Loading content...", 
  subtext = "Please wait while we fetch your content",
  className = "",
  variant = "ring",
  size = "lg"
}: { 
  text?: string; 
  subtext?: string;
  className?: string;
  variant?: 'ring' | 'gradient' | 'dots' | 'orbit';
  size?: 'md' | 'lg' | 'xl';
}) => (
  <div className={`flex flex-col items-center justify-center py-16 px-4 animate-fade-in ${className}`}>
    <LoadingSpinner size={size} variant={variant} color="primary" showBackground={true} />
    <div className="mt-6 text-center max-w-sm">
      <p className="text-neutral-700 font-medium text-lg">{text}</p>
      {subtext && (
        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{subtext}</p>
      )}
    </div>
  </div>
);

// Professional page loading component
export const PageLoader = ({
  text = "Loading page...",
  showLogo = true
}: {
  text?: string;
  showLogo?: boolean;
}) => (
  <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
    <div className="text-center animate-fade-in">
      {showLogo && (
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-xl">VH</span>
          </div>
        </div>
      )}
      <LoadingSpinner size="xl" variant="gradient" showBackground={true} />
      <p className="mt-6 text-neutral-600 font-medium text-lg">{text}</p>
      <p className="mt-2 text-sm text-neutral-500">Setting up your experience</p>
    </div>
  </div>
);

// Button loading state
export const ButtonLoader = ({
  size = "md",
  color = "primary"
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'neutral';
}) => (
  <LoadingSpinner 
    size={size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm'} 
    variant="ring" 
    color={color === 'primary' ? 'neutral' : color}
  />
);

export default LoadingSpinner;
