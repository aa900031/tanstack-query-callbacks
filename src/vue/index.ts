import type { QueryClient, QueryKey } from '@tanstack/vue-query'
import type { Ref } from 'vue-demi'
import type { QueryCallbacks } from '../core/index'
import { useQueryClient } from '@tanstack/vue-query'
import { inject, unref, watch } from 'vue-demi'
import { subscribeQueryCallbacks } from '../core/index'

export interface UseQueryCallbacksProps<
	TQueryFnData,
	TError,
> extends QueryCallbacks<TQueryFnData, TError> {
	queryKey: QueryKey | Ref<QueryKey>
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
