import { QueryClient, useQuery, useQueryClient, VueQueryPlugin } from '@tanstack/vue-query-v4'
import { waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { inject } from 'vue-demi'
import { cleanUp, mountSetup } from '../../test/vue-mount'
import { useQueryCallbacks } from './index'

vi.mock('@tanstack/query-core', () => import('@tanstack/query-core-v4'))
vi.mock('@tanstack/vue-query', () => import('@tanstack/vue-query-v4'))

describe('vue (v4)', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient()
		queryClient.mount()
	})

	afterEach(() => {
		queryClient.clear()
		cleanUp()
	})

	it('should call onSuccess & onSettled', async () => {
		const onSuccess = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = useQueryClientSetup(() => {
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

		const query = useQueryClientSetup(() => {
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

		const query = useQueryClientSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryClient,
				queryFn: () => Promise.resolve('bar'),
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClient: queryClient as any,
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

		const query = useQueryClientSetup(() => {
			const queryClient = useQueryClient(queryClientId)
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
				queryClient,
			})

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

	it('should call onSuccess with `queryClientKey`', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']
		const queryClientKey = '_vue_query_'

		const { result: query } = mountSetup(() => {
			const queryClient = inject(queryClientKey) as QueryClient
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
				queryClient,
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClientKey,
				onSuccess,
			})

			return result
		}, (app) => {
			app.provide(queryClientKey, new QueryClient())
		})

		expect(query.data.value).toBeUndefined()
		await waitFor(() => expect(query.data.value).not.toBeUndefined())

		expect(query.data.value).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})
})

function useQueryClientSetup<T>(
	setup: () => T,
	options?:
		| { queryClient: QueryClient }
		| { queryClientKey: string },
) {
	const { result } = mountSetup<T>(setup, (app) => {
		app.use(VueQueryPlugin, options)
	})
	return result
}
