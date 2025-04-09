import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { Context } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { QueryCallbacks } from '../core/index'
import { subscribeQueryCallbacks } from '../core/index'

export interface UseQueryCallbacksProps<
	TQueryFnData,
	TError,
> extends QueryCallbacks<TQueryFnData, TError> {
	queryKey: QueryKey
	/**
	 * QueryClient instance
	 */
	queryClient?: QueryClient
	/**
	 * QueryClient context for v4
	 */
	context?: Context<QueryClient | undefined>
}

export function useQueryCallbacks<
	TQueryFnData = unknown,
	TError = unknown,
>(
	props: UseQueryCallbacksProps<TQueryFnData, TError>,
): void {
	const queryClient = useQueryClient(
		props.context
			? { context: props.context } as any // for v4
			: props.queryClient, // for v5
	)

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
