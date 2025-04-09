import { QueryClient, VueQueryPlugin, useQuery, useQueryClient } from '@tanstack/vue-query'
import { cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQueryCallbacks } from './index'

describe('vue', () => {
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

		const query = renderSetup(() => {
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
			queryClient,
		})

		expect(query.data.value).toBeUndefined()
		await waitFor(() => expect(query.data.value).not.toBeUndefined())

		expect(query.data.value).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = renderSetup(() => {
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
			queryClient,
		})

		expect(query.error.value).toBeNull()
		await waitFor(() => expect(query.error.value).not.toBeNull())

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should call onSuccess with custom QueryClient', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']

		const query = renderSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClient,
				onSuccess,
			})

			return result
		})

		expect(query.data.value).toBeUndefined()
		await waitFor(() => expect(query.data.value).not.toBeUndefined())

		expect(query.data.value).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})

	it('should call onSuccess with `queryClientId`', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']
		const queryClientId = 'custom-key'

		const query = renderSetup(() => {
			const queryClient = useQueryClient(queryClientId)
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClientId,
				onSuccess,
			})

			return result
		}, {
			queryClientKey: queryClientId,
		})

		expect(query.data.value).toBeUndefined()
		await waitFor(() => expect(query.data.value).not.toBeUndefined())

		expect(query.data.value).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})
})

function renderSetup<T>(
	setup: () => T,
	options?:
		| { queryClient: QueryClient }
		| { queryClientKey: string },
): T {
	let result: T

	render({
		setup: () => {
			result = setup()
			return () => null
		},
	}, {
		...options,
		// eslint-disable-next-line ts/ban-ts-comment
		// @ts-expect-error
		shallow: true,
		global: {
			plugins: [
				options && [VueQueryPlugin, options],
			].filter(Boolean) as any,
		},
	})

	return result!
}
