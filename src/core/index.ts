import type { QueryClient, QueryKey } from '@tanstack/query-core'
import { isCancelledError, matchQuery } from '@tanstack/query-core'

export type QuerySuccessHandler<
	TQueryFnData,
> = (data: TQueryFnData) => void

export type QueryErrorHandler<
	TError,
> = (err: TError) => void

export type QuerySettledHandler<
	TQueryFnData,
	TError,
> = (data: TQueryFnData | undefined, error: TError | null) => void

export interface QueryCallbacks<
	TQueryFnData,
	TError,
> {
	onSuccess?: QuerySuccessHandler<TQueryFnData>
	onError?: QueryErrorHandler<TError>
	onSettled?: QuerySettledHandler<TQueryFnData, TError>
}

export interface SubscribeQueryCallbacksProps<
	TQueryFnData,
	TError,
> extends QueryCallbacks<TQueryFnData, TError> {
	queryClient: QueryClient
	queryKey: QueryKey
}

export function subscribeQueryCallbacks<
	TQueryFnData = unknown,
	TError = unknown,
>(
	{
		queryClient,
		queryKey,
		onSuccess,
		onError,
		onSettled,
	}: SubscribeQueryCallbacksProps<TQueryFnData, TError>,
): () => void {
	if (!onSuccess && !onError && !onSettled)
		return noop

	const cache = queryClient.getQueryCache()
	const unsubscribe = cache.subscribe((event) => {
		if (event.type !== 'updated')
			return

		if (!matchQuery({ queryKey, exact: true }, event.query))
			return

		switch (event.action.type) {
			case 'success': {
				/* istanbul ignore else */
				if (!event.action.manual) {
					onSuccess?.(event.action.data)
					onSettled?.(event.action.data, null)
				}
				break
			}
			case 'error': {
				/* istanbul ignore else */
				if (!isCancelledError(event.action.error)) {
					onError?.(event.action.error)
					onSettled?.(undefined, event.action.error)
				}
				break
			}
		}
	})

	return unsubscribe
}

function noop() {}
