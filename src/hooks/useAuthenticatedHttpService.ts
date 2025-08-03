import { useMemo } from 'react'
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { useAuth } from '../contexts/AuthContext'

// Base response type from API documentation
interface BaseResponse<T = any> {
  error?: string;
  data: T;
}

// Error response type
interface ErrorResponse {
  error?: string;
  [key: string]: any;
}

// HTTP service configuration
interface HttpServiceConfig {
  baseURL: string;
  timeout?: number;
}

// Create an authenticated HTTP client
const createAuthenticatedHttpClient = (
  config: HttpServiceConfig,
  accessToken: string | null,
  signOut: () => Promise<any>
): AxiosInstance => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth tokens
  client.interceptors.request.use(
    (config) => {
      // Add authorization header if token exists
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling common errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Handle common HTTP errors
      if (error.response?.status === 401) {
        // Handle unauthorized access - sign out
        await signOut();
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Error handler
const handleError = (error: AxiosError<ErrorResponse>): Error => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.error || error.message;
    return new Error(`HTTP ${status}: ${message}`);
  } else if (error.request) {
    // Request was made but no response received
    return new Error('Network error: No response received from server');
  } else {
    // Something else happened
    return new Error(`Request error: ${error.message}`);
  }
};

// Hook that provides an authenticated HTTP service
export const useAuthenticatedHttpService = () => {
  const { session, signOut } = useAuth();

  // Get access token from session
  const accessToken = session?.access_token || null;

  // Create HTTP client with current auth token
  const client = useMemo(() => {
    const config = {
      baseURL: 'https://foundation.edgarrosende.com/api/billaton',
      timeout: 15000,
    };

    return createAuthenticatedHttpClient(config, accessToken, signOut);
  }, [accessToken, signOut]);

  // HTTP methods
  const httpService = useMemo(() => ({
    // GET method
    get: async <T>(url: string, params?: Record<string, any>): Promise<BaseResponse<T>> => {
      try {
        const response: AxiosResponse<BaseResponse<T>> = await client.get(url, { params });
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // GET method for file
    getForFile: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.get(url, { 
          params, 
          responseType: 'blob' 
        });
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // POST method
    post: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      try {
        const response: AxiosResponse<BaseResponse<T>> = await client.post(url, data);
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // PUT method
    put: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      try {
        const response: AxiosResponse<BaseResponse<T>> = await client.put(url, data);
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // DELETE method
    del: async <T>(url: string): Promise<BaseResponse<T>> => {
      try {
        const response: AxiosResponse<BaseResponse<T>> = await client.delete(url);
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // POST with file
    postWithFile: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      try {
        const response: AxiosResponse<BaseResponse<T>> = await client.post(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    },

    // POST for file download
    postForFile: async <T>(url: string, data?: any): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.post(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' }, 
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw handleError(error as AxiosError<ErrorResponse>);
      }
    }
  }), [client]);

  return httpService;
};

export default useAuthenticatedHttpService;