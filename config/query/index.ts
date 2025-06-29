import {
  QueryCache,
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryCache = new QueryCache({
  onError: (error, query) => {
    console.log('[Query] onError =>', error, query);
  },
  onSuccess: (data, query) => {
    console.log('[Query] onSuccess =>', data, query);
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 0 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
  queryCache,
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
