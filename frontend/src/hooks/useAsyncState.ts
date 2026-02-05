import { useState, useCallback, useRef, useEffect } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export interface AsyncStateActions<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: Error | null) => void;
}

export interface UseAsyncStateOptions {
  initialLoading?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Custom hook for managing async operations with loading, error, and success states
 */
export const useAsyncState = <T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncStateOptions = {}
): [AsyncState<T>, AsyncStateActions<T>] => {
  const {
    initialLoading = false,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: initialLoading,
    error: null,
    success: false
  });

  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    if (!isMountedRef.current) return Promise.reject(new Error('Component unmounted'));

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));

    try {
      const result = await asyncFunction(...args);
      
      if (!isMountedRef.current) return result;

      setState({
        data: result,
        loading: false,
        error: null,
        success: true
      });

      retryCountRef.current = 0;
      onSuccess?.(result);
      return result;
    } catch (error) {
      if (!isMountedRef.current) throw error;

      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        
        setTimeout(() => {
          if (isMountedRef.current) {
            execute(...args);
          }
        }, retryDelay);
        
        return Promise.reject(errorObj);
      }

      setState({
        data: null,
        loading: false,
        error: errorObj,
        success: false
      });

      onError?.(errorObj);
      throw errorObj;
    }
  }, [asyncFunction, onSuccess, onError, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false
    });
    retryCountRef.current = 0;
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({
      ...prev,
      data,
      success: data !== null
    }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({
      ...prev,
      error,
      success: false
    }));
  }, []);

  return [
    state,
    { execute, reset, setData, setError }
  ];
};

/**
 * Hook for managing multiple async operations
 */
export const useMultipleAsyncState = <T extends Record<string, any>>(
  operations: Record<keyof T, (...args: any[]) => Promise<any>>
) => {
  const [states, setStates] = useState<Record<keyof T, AsyncState<any>>>(() => {
    const initialStates = {} as Record<keyof T, AsyncState<any>>;
    Object.keys(operations).forEach(key => {
      initialStates[key] = {
        data: null,
        loading: false,
        error: null,
        success: false
      };
    });
    return initialStates;
  });

  const execute = useCallback(async (
    operationKey: keyof T,
    ...args: any[]
  ) => {
    setStates(prev => ({
      ...prev,
      [operationKey]: {
        ...prev[operationKey],
        loading: true,
        error: null,
        success: false
      }
    }));

    try {
      const result = await operations[operationKey](...args);
      
      setStates(prev => ({
        ...prev,
        [operationKey]: {
          data: result,
          loading: false,
          error: null,
          success: true
        }
      }));

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setStates(prev => ({
        ...prev,
        [operationKey]: {
          data: null,
          loading: false,
          error: errorObj,
          success: false
        }
      }));

      throw errorObj;
    }
  }, [operations]);

  const reset = useCallback((operationKey?: keyof T) => {
    if (operationKey) {
      setStates(prev => ({
        ...prev,
        [operationKey]: {
          data: null,
          loading: false,
          error: null,
          success: false
        }
      }));
    } else {
      setStates(prev => {
        const resetStates = {} as Record<keyof T, AsyncState<any>>;
        Object.keys(prev).forEach(key => {
          resetStates[key] = {
            data: null,
            loading: false,
            error: null,
            success: false
          };
        });
        return resetStates;
      });
    }
  }, []);

  const isAnyLoading = Object.values(states).some(state => state.loading);
  const hasAnyError = Object.values(states).some(state => state.error);
  const allSuccessful = Object.values(states).every(state => state.success);

  return {
    states,
    execute,
    reset,
    isAnyLoading,
    hasAnyError,
    allSuccessful
  };
};

/**
 * Hook for managing form submission states
 */
export const useFormSubmission = <T = any>(
  submitFunction: (data: any) => Promise<T>,
  options: UseAsyncStateOptions = {}
) => {
  const [state, actions] = useAsyncState(submitFunction, options);

  const submit = useCallback(async (formData: any) => {
    try {
      return await actions.execute(formData);
    } catch (error) {
      // Form-specific error handling can be added here
      throw error;
    }
  }, [actions]);

  return {
    ...state,
    submit,
    reset: actions.reset,
    isSubmitting: state.loading,
    isSubmitted: state.success,
    submissionError: state.error
  };
};

export default useAsyncState;