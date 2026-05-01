import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * A custom hook to handle data fetching with loading and error states using Axios.
 * 
 * @param url - The URL to fetch data from
 * @param config - Optional Axios request configuration
 * @returns An object containing data, loading, and error states
 */
export default function useCustomFetch<T = any>(url: string, config?: AxiosRequestConfig): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<T>(url, { ...config, cancelToken: controller.token });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          // Request was cancelled, do nothing
          return;
        }
        const axiosError = err as AxiosError;
        setError(axiosError.message ? new Error(axiosError.message) : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.cancel('Operation cancelled by the user.');
    };
  }, [url, JSON.stringify(config)]); // Stringify config for deep comparison in dependency array

  return { data, loading, error };
}
