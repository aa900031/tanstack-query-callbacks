import type { QueryClient, QueryKey } from '@tanstack/svelte-query'
import type { QueryCallbacks } from '../core/index'
import { useQueryClient } from '@tanstack/svelte-query'
import { untrack } from 'svelte'
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
}

export function useQueryCallbacks<
	TQueryFnData = unknown,
	TError = unknown,
>(
	props: () => UseQueryCallbacksProps<TQueryFnData, TError>,
): void {
	const _props = $derived(props())
	const queryClient = $derived(useQueryClient(_props.queryClient))

	$effect(() => {
		const _queryKey = _props.queryKey
		const _queryClient = queryClient

		return untrack(() => subscribeQueryCallbacks({
			queryClient: _queryClient,
			queryKey: _queryKey,
			onSuccess: _props.onSuccess,
			onError: _props.onError,
			onSettled: _props.onSettled,
		}))
	})
}
