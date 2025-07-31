import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

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
    (config) => {
      // Add authorization header if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
    (error: AxiosError) => {
      // Handle common HTTP errors
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        // Could redirect to login page here
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

// Network detection utility
const detectOptimalBaseURL = async (): Promise<string> => {
  const publicURL = 'https://foundation-server.duckdns.org/api/billaton';
  const localURL = 'http://192.168.1.158:8080/api/billaton'; 
  
  try {
    // Try to get public IP to compare with domain resolution
    const [publicIPResponse, domainIPResponse] = await Promise.allSettled([
      fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) }),
      fetch('https://dns.google/resolve?name=foundation-server.duckdns.org&type=A', { signal: AbortSignal.timeout(3000) })
    ]);

    if (publicIPResponse.status === 'fulfilled' && domainIPResponse.status === 'fulfilled') {
      const publicIP = await publicIPResponse.value.json();
      const domainData = await domainIPResponse.value.json();
      
      // Check if domain resolves to same IP as public IP (NAT loopback issue)
      if (domainData.Answer && domainData.Answer.length > 0) {
        const domainIP = domainData.Answer[0].data;
        if (publicIP.ip === domainIP) {
          console.log('NAT loopback detected, using local IP');
          return localURL;
        }
      }
    }
  } catch (error) {
    console.log('IP detection failed, trying connectivity test');
  }

  // Fallback: Try a quick connectivity test
  try {
    const testResponse = await fetch(`${publicURL}/identification-types`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // Quick timeout
    });
    
    if (testResponse.ok) {
      console.log('Public URL is accessible');
      return publicURL;
    }
  } catch (error) {
    console.log('Public URL not accessible, using local IP');
    return localURL;
  }

  // Default to public URL
  return publicURL;
};

// Initialize with dynamic base URL detection
let httpService: HttpService;

const initializeHttpService = async (): Promise<HttpService> => {
  if (!httpService) {
    const baseURL = await detectOptimalBaseURL();
    httpService = new HttpService({
      baseURL,
      timeout: 15000,
    });
    console.log(`HttpService initialized with baseURL: ${baseURL}`);
  }
  return httpService;
};

// Create a promise that resolves to the service
const httpServicePromise = initializeHttpService();

export const useHttpService = () => {
  return {
    get: async <T>(url: string, params?: Record<string, any>): Promise<BaseResponse<T>> => {
      const service = await httpServicePromise;
      return service.get<T>(url, params);
    },
    getForFile: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
      const service = await httpServicePromise;
      return service.getForFile<T>(url, params);
    },
    post: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      const service = await httpServicePromise;
      return service.post<T>(url, data);
    },
    put: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      const service = await httpServicePromise;
      return service.put<T>(url, data);
    },
    del: async <T>(url: string): Promise<BaseResponse<T>> => {
      const service = await httpServicePromise;
      return service.delete<T>(url);
    },
    postWithFile: async <T>(url: string, data?: any): Promise<BaseResponse<T>> => {
      const service = await httpServicePromise;
      return service.postWithFile<T>(url, data);
    },
    postForFile: async <T>(url: string, data?: any): Promise<T> => {
      const service = await httpServicePromise;
      return service.postForFile<T>(url, data);
    },
  };
};

// Export the promise for direct access if needed
export const getHttpService = (): Promise<HttpService> => httpServicePromise;

export default httpServicePromise;
