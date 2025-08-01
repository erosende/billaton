import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { supabase } from '../config/supabase';

// Base response type from API documentation
interface BaseResponse<T = any> {
  error?: string;
  data: T;
}

// HTTP service configuration
interface HttpServiceConfig {
  baseURL: string;
  timeout?: number;
}

// Error response type
interface ErrorResponse {
  error?: string;
  [key: string]: any;
}



// Create axios instance with default configuration
const createHttpClient = (config: HttpServiceConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth tokens if needed
  client.interceptors.request.use(
    async (config) => {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      // Add authorization header if session and token exist
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
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
        // Handle unauthorized access - sign out from Supabase
        await supabase.auth.signOut();
        // The AuthContext will handle the redirect to login page
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// HTTP service class
class HttpService {
  private client: AxiosInstance;

  constructor(config: HttpServiceConfig) {
    this.client = createHttpClient(config);
  }

  // GET method
  async get<T>(url: string, params?: Record<string, any>): Promise<BaseResponse<T>> {
    try {
      const response: AxiosResponse<BaseResponse<T>> = await this.client.get(url, {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // GET method for file
  async getForFile<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, { params, responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // POST method
  async post<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response: AxiosResponse<BaseResponse<T>> = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // PUT method
  async put<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response: AxiosResponse<BaseResponse<T>> = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // DELETE method
  async delete<T>(url: string): Promise<BaseResponse<T>> {
    try {
      const response: AxiosResponse<BaseResponse<T>> = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  async postWithFile<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response: AxiosResponse<BaseResponse<T>> = await this.client.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  async postForFile<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Error handler
  private handleError = (error: AxiosError<ErrorResponse>): Error => {
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
}

// Create and export the HTTP service instance with Billaton API base URL
// const httpService = new HttpService({
//   baseURL: 'https://foundation-server.duckdns.org/api/billaton',
//   timeout: 15000,
// });

const httpService = new HttpService({
  baseURL: 'http://localhost:8080/api/billaton',
  timeout: 15000,
});

export const useHttpService = () => {
  return {
    get: httpService.get.bind(httpService),
    getForFile: httpService.getForFile.bind(httpService),
    post: httpService.post.bind(httpService),
    put: httpService.put.bind(httpService),
    del: httpService.delete.bind(httpService),
    postWithFile: httpService.postWithFile.bind(httpService),
    postForFile: httpService.postForFile.bind(httpService),
  };
};

export default httpService;
