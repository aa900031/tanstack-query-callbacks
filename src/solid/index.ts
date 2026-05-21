import type { QueryClient, QueryKey } from '@tanstack/solid-query'
import type { QueryCallbacks } from '../index'
import { useQueryClient } from '@tanstack/solid-query'
import { createEffect, onCleanup, untrack } from 'solid-js'
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
	props: () => UseQueryCallbacksProps<TQueryFnData, TError>,
): void {
	const queryClient = useQueryClient(untrack(() => props().queryClient))

	createEffect(() => {
		const _queryKey = props().queryKey

		const unsubscribe = untrack(() => subscribeQueryCallbacks({
			queryClient,
			queryKey: _queryKey,
			onSuccess: props().onSuccess,
			onError: props().onError,
			onSettled: props().onSettled,
		}))

		onCleanup(() => unsubscribe())
	})
}
