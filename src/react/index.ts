import { useEffect } from 'react'
import type { QueryClient, QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type { QueryCallbacks } from '../index'
import { subscribeQueryCallbacks } from '../index'

export interface UseQueryCallbacksProps<
	TQueryFnData,
	TError,
> extends QueryCallbacks<TQueryFnData, TError> {
	queryKey: QueryKey
	/**
	 * QueryClient instance
	 */
	queryClient?: QueryClient
}

export function useQueryCallbacks<
	TQueryFnData = unknown,
	TError = unknown,
>(
	props: UseQueryCallbacksProps<TQueryFnData, TError>,
): void {
	const queryClient = useQueryClient(props.queryClient)

	useEffect(() => {
		return subscribeQueryCallbacks({
			queryClient,
			queryKey: props.queryKey,
			onSuccess: props.onSuccess,
			onError: props.onError,
			onSettled: props.onSettled,
		})
	}, [
		props.queryKey,
		props.onSuccess,
		props.onError,
		props.onSettled,
	])
}
