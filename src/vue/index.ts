import { inject, unref, watch } from 'vue-demi'
import type { MaybeRef } from 'vue-demi'
import type { QueryClient, QueryKey } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import type { QueryCallbacks } from '../core/index'
import { subscribeQueryCallbacks } from '../core/index'

export interface UseQueryCallbacksProps<
	TQueryFnData,
	TError,
> extends QueryCallbacks<TQueryFnData, TError> {
	queryKey: MaybeRef<QueryKey>
	/**
	 * QueryClient instance
	 */
	queryClient?: QueryClient
	/**
	 * QueryClient Context Key for inject
	 */
	queryClientKey?: string
	/**
	 * QueryClient ID for v5 useQueryClient()
	 */
	queryClientId?: string
}

export function useQueryCallbacks<
	TQueryFnData = unknown,
	TError = unknown,
>(
	props: UseQueryCallbacksProps<TQueryFnData, TError>,
): void {
	const queryClient = props.queryClient
		?? (
			props.queryClientKey
				? inject(props.queryClientKey, undefined)
				: undefined
		)
		?? useQueryClient(props.queryClientId)

	watch(
		() => unref(props.queryKey),
		(queryKey, _oldVal, onCleanup) => {
			const unsubscribe = subscribeQueryCallbacks({
				queryClient,
				queryKey,
				onSuccess: props.onSuccess,
				onError: props.onError,
				onSettled: props.onSettled,
			})

			onCleanup(() => {
				unsubscribe()
			})
		},
		{ immediate: true },
	)
}
