/**
 * Utility functions for consistent state management across the application
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Standard error types for consistent error handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export class AppError extends Error {
  public type: ErrorType;
  public statusCode?: number;
  public details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Parse API errors into standardized format
 */
export const parseApiError = (error: any): AppError => {
  // Network errors
  if (!error.response) {
    return new AppError(
      'Unable to connect to the server. Please check your internet connection.',
      ErrorType.NETWORK
    );
  }

  const { status, data } = error.response;

  // Authentication errors
  if (status === 401) {
    return new AppError(
      'Your session has expired. Please log in again.',
      ErrorType.AUTHENTICATION,
      status
    );
  }

  // Authorization errors
  if (status === 403) {
    return new AppError(
      'You do not have permission to perform this action.',
      ErrorType.AUTHORIZATION,
      status
    );
  }

  // Not found errors
  if (status === 404) {
    return new AppError(
      'The requested resource was not found.',
      ErrorType.NOT_FOUND,
      status
    );
  }

  // Validation errors
  if (status === 400 || status === 422) {
    const message = data?.message || 'Please check your input and try again.';
    return new AppError(
      message,
      ErrorType.VALIDATION,
      status,
      data?.errors
    );
  }

  // Server errors
  if (status >= 500) {
    return new AppError(
      'A server error occurred. Please try again later.',
      ErrorType.SERVER,
      status
    );
  }

  // Generic error
  const message = data?.message || error.message || 'An unexpected error occurred.';
  return new AppError(message, ErrorType.UNKNOWN, status);
};

/**
 * Retry utility with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Debounce utility for search and input handling
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle utility for scroll and resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
      return false;
    }
  }
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error: AppError | Error | string): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Connection problem. Please check your internet and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorType.AUTHORIZATION:
        return 'You don\'t have permission for this action.';
      case ErrorType.NOT_FOUND:
        return 'The requested item could not be found.';
      case ErrorType.VALIDATION:
        return error.message || 'Please check your input and try again.';
      case ErrorType.SERVER:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return error.message || 'An unexpected error occurred.';
};

/**
 * Generate user-friendly success messages
 */
export const formatSuccessMessage = (action: string, item?: string): string => {
  const itemText = item ? ` ${item}` : '';
  
  switch (action.toLowerCase()) {
    case 'create':
    case 'created':
      return `${item || 'Item'} created successfully!`;
    case 'update':
    case 'updated':
      return `${item || 'Item'} updated successfully!`;
    case 'delete':
    case 'deleted':
      return `${item || 'Item'} deleted successfully!`;
    case 'save':
    case 'saved':
      return `${item || 'Changes'} saved successfully!`;
    case 'send':
    case 'sent':
      return `${item || 'Message'} sent successfully!`;
    case 'upload':
    case 'uploaded':
      return `${item || 'File'} uploaded successfully!`;
    default:
      return `${action}${itemText} completed successfully!`;
  }
};

/**
 * Validate common input types
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  }
};

/**
 * Format numbers for display
 */
export const formatters = {
  currency: (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  number: (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  },

  date: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  },

  dateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  },

  relativeTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatters.date(d);
  }
};

export default {
  parseApiError,
  retryWithBackoff,
  debounce,
  throttle,
  storage,
  formatErrorMessage,
  formatSuccessMessage,
  validators,
  formatters
};