import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query-v4'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQueryCallbacks } from './index'

vi.mock('@tanstack/query-core', () => import('@tanstack/query-core-v4'))
vi.mock('@tanstack/react-query', () => import('@tanstack/react-query-v4'))

describe('react (v4)', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient()
		queryClient.mount()
	})

	afterEach(() => {
		queryClient.clear()
		cleanup()
	})

	it('should call onSuccess & onSettled', async () => {
		const onSuccess = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const { result } = renderHook(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				onSuccess,
				onSettled,
			})

			return result
		}, {
			wrapper: createWrapper(queryClient),
		})

		expect(result.current.data).toBeUndefined()

		await waitFor(() => expect(result.current.data).not.toBeUndefined())

		expect(result.current.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const { result } = renderHook(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				// eslint-disable-next-line prefer-promise-reject-errors
				queryFn: () => Promise.reject('bar'),
				retry: false,
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				onError,
				onSettled,
			})

			return result
		}, {
			wrapper: createWrapper(queryClient),
		})

		expect(result.current.error).toBeNull()
		await waitFor(() => expect(result.current.error).not.toBeNull())

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should call onSccess with custom QueryClient context', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']
		const context = React.createContext(queryClient)

		const { result } = renderHook(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
				context: context as any,
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				context: context as any,
				onSuccess,
			})

			return result
		})

		expect(result.current.data).toBeUndefined()

		await waitFor(() => expect(result.current.data).not.toBeUndefined())

		expect(result.current.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})
})

function createWrapper(
	queryClient: QueryClient,
	context?: React.Context<any>,
): React.JSXElementConstructor<{ children: React.ReactNode }> {
	return ({
		children,
	}) => (
		<QueryClientProvider client={queryClient} context={context}>
			{children}
		</QueryClientProvider>
	)
}
